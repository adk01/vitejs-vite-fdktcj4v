import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { formatDbItem } from '../utils';

export const TIME_PERIODS = {
  morning: { id: 'morning', label: '🌅 MORNING', timeRange: '06:00 - 12:00' },
  afternoon: { id: 'afternoon', label: '☀️ AFTERNOON', timeRange: '12:00 - 18:00' },
  evening: { id: 'evening', label: '🌙 EVENING', timeRange: '18:00 - 02:00' },
};

export const useItinerary = (tripId = 1, dayId = 1) => {
  const [activities, setActivities] = useState([]);
  const [tripMeta, setTripMeta] = useState({ title: '我的冒險', start_date: '', day_count: 1, total_budget: 0 });
  const [totalTripCost, setTotalTripCost] = useState(0);
  const [userProfile, setUserProfile] = useState({ level: 1, xp: 0, nextLevelXp: 100, stats: {}, points: 0 });
  const [loading, setLoading] = useState(true);
  const isFirstLoad = useRef(true);

  // 1. 抓取全域資料
  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const { data: trip } = await supabase.from('trips').select('*').eq('id', tripId).single();
        const { data: profile } = await supabase.from('profile').select('*').single();
        if (trip) setTripMeta(trip);
        if (profile) {
          setUserProfile({
            level: profile.level || 1,
            xp: profile.xp || 0,
            nextLevelXp: Math.floor(100 * Math.pow(1.5, (profile.level || 1) - 1)),
            stats: { int: profile.int_stat || 0, cha: profile.cha_stat || 0, agi: profile.agi_stat || 0, luk: profile.luk_stat || 0 },
            points: profile.unassigned_points || 0
          });
        }
        const { data: allItems } = await supabase.from('itinerary').select('cost');
        if (allItems) setTotalTripCost(allItems.reduce((sum, item) => sum + (Number(item.cost) || 0), 0));
      } catch (e) { console.error('Global error:', e); }
    };
    fetchGlobalData();
  }, [tripId]);

  // 2. 抓取當日活動
  const fetchActivities = useCallback(async () => {
    if (isFirstLoad.current) setLoading(true);
    try {
      const { data: acts } = await supabase.from('itinerary').select('*').eq('day', dayId).order('time_period').order('sort_order');
      if (acts) setActivities(acts.map(formatDbItem));
    } catch (error) { console.error('Activities error:', error); }
    finally {
      if (isFirstLoad.current) { setLoading(false); isFirstLoad.current = false; }
    }
  }, [dayId]);

// 🟢 修正後的即時監聽：同時監聽行程(itinerary)與設定(trips)
useEffect(() => {
  fetchActivities(); // 初始載入

  const channel = supabase
    .channel('trip_updates')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'itinerary' },
      (payload) => {
        console.log('🔄 行程變動:', payload);
        fetchActivities(); // 重新抓取行程列表
        // 更新總花費
        supabase.from('itinerary').select('cost').then(({ data }) => {
           if (data) setTotalTripCost(data.reduce((sum, item) => sum + (Number(item.cost) || 0), 0));
        });
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'trips' }, // 🟢 新增這一段
      (payload) => {
        console.log('⚙️ 設定變動:', payload);
        // 當有人修改標題或預算時，這裡會收到通知
        if (payload.new && payload.new.id === tripId) {
           setTripMeta(payload.new);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [fetchActivities, tripId]);

  const addXp = async (amount) => {
    const newXp = (userProfile.xp || 0) + amount;
    const nextLevel = userProfile.nextLevelXp || 100;
    let finalLevel = userProfile.level;
    let finalXp = newXp;
    let finalNextXp = nextLevel;
    let pointsToAdd = 0;

    if (newXp >= nextLevel) {
      finalLevel += 1;
      finalXp = newXp - nextLevel;
      finalNextXp = Math.floor(nextLevel * 1.5);
      pointsToAdd = 3; 
      alert(`🎉 LEVEL UP! Lv.${finalLevel}`);
    }
    const newPoints = (userProfile.points || 0) + pointsToAdd;
    
    setUserProfile({ ...userProfile, level: finalLevel, xp: finalXp, nextLevelXp: finalNextXp, points: newPoints });
    await supabase.from('profile').update({ level: finalLevel, xp: finalXp, unassigned_points: newPoints }).eq('id', userProfile.id || 1);
  };

  const updateTripMeta = async (newMeta) => {
    setTripMeta(newMeta);
    await supabase.from('trips').update(newMeta).eq('id', tripId);
  };

  const saveActivity = async (formData, editId = null) => {
    const dbData = {
      day: formData.day || dayId,
      time_period: formData.timePeriod || 'morning',
      time: formData.time || null,
      activity: formData.title,
      location: formData.location || '',
      cost: Number(formData.cost) || 0,
      type: formData.type || 'sightseeing',
      notes: formData.notes || '',
      trans_mode: formData.transMode || 'train',
      trans_time: Number(formData.transTime) || 0,
    };

    if (editId) {
      await supabase.from('itinerary').update(dbData).eq('id', editId);
    } else {
      await supabase.from('itinerary').insert([{ ...dbData, sort_order: 999 }]);
    }
    // 注意：這裡不需要手動 call fetchActivities() 了，因為 Realtime 監聽器會自動觸發
  };

  const deleteActivity = async (id) => {
    await supabase.from('itinerary').delete().eq('id', id);
  };

  const toggleComplete = async (item) => {
    const isDone = !item.completed;
    // 樂觀更新
    setActivities(prev => prev.map(a => a.id === item.id ? { ...a, completed: isDone } : a));
    if (isDone) addXp(10);
    await supabase.from('itinerary').update({ completed: isDone }).eq('id', item.id);
  };

  const reorderActivities = async (activeId, overId, newPeriod) => {
    setActivities((items) => {
      const oldIndex = items.findIndex(i => i.id === activeId);
      const newIndex = items.findIndex(i => i.id === overId);
      const newItems = [...items];
      const [movedItem] = newItems.splice(oldIndex, 1);
      movedItem.timePeriod = newPeriod;
      newItems.splice(newIndex, 0, movedItem);
      return newItems;
    });
    // 實際專案建議在這裡加防抖 (Debounce) 後再寫入 DB 排序，暫時略過複雜實作
  };

  return {
    activities, userProfile, tripMeta, totalTripCost, updateTripMeta, loading, 
    saveActivity, deleteActivity, toggleComplete, reorderActivities, addXp
  };
};