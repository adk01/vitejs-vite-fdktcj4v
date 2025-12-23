import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  DndContext,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  closestCorners,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Loader2,
  DollarSign,
  X,
  Backpack,
  CheckSquare,
  Square,
  Trash2,
  FileText,
  Check,
  ExternalLink,
  Settings,
  Maximize2,
  Minimize2,
  Map as MapIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  LocateFixed,
  Menu,
  Clock, // 🟢 新增引用
  Lock, // 🟢 新增引用
  ShoppingBag, //
  LogOut, //
} from 'lucide-react';
import { supabase } from '../supabaseClient';

// Imports
import { useItinerary } from '../hooks/useItinerary';
import GameMap from '../components/Map/GameMap';
import TripSettingsModal from '../components/TripSettingsModal';
import { TYPE_CONFIG, SUPPLY_MAP, getCoords } from '../utils';

// ==========================================
// 1. ActivityCard (含錨定卡視覺優化)
// ==========================================
const ActivityCard = ({
  item,
  isActive,
  onClick,
  onEdit,
  onToggleComplete,
  appSettings,
  onGainXp,
}) => {
  const [isSupplyOpen, setIsSupplyOpen] = useState(false);
  const [isEquipped, setIsEquipped] = useState(false);

  const typeConfig = TYPE_CONFIG[item.type] || TYPE_CONFIG.sightseeing;
  const TypeIcon = typeConfig.icon;

  const matchedKey = Object.keys(SUPPLY_MAP).find((key) => {
    const titleLower = item.title?.toLowerCase() || '';
    const keyLower = key.toLowerCase();
    return titleLower.includes(keyLower);
  });

  const supply = matchedKey ? SUPPLY_MAP[matchedKey] : null;
  const showSupplies = appSettings?.showSupplies ?? true;

  // 🟢 定義錨定卡：只要有填寫時間，就算錨定
  const isAnchored = !!item.time;

  useEffect(() => {
    if (item.completed) setIsSupplyOpen(false);
  }, [item.completed]);

  const openMaps = (e) => {
    e.stopPropagation();
    const coords = getCoords(item.location);
    const url = coords
      ? `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          item.location || item.title
        )}`;
    window.open(url, '_blank');
  };

  const handleSupplyClick = (e) => {
    e.stopPropagation();
    setIsSupplyOpen(!isSupplyOpen);
  };

  const handlePurchase = (e) => {
    e.stopPropagation();
    setIsEquipped(true);
    setIsSupplyOpen(false);
    if (onGainXp && supply) {
      const xpVal = parseInt(supply.reward) || 20;
      onGainXp(xpVal);
      alert(`🎁 購買成功！獲得 ${xpVal} XP`);
    }
  };

  return (
    <div
      id={`card-${item.id}`}
      onClick={onClick}
      className={`
        relative px-2 py-2 mb-2 cursor-pointer select-none
        border-2 rounded-md 
        border-b-[3px] border-r-[3px] 
        active:border-b-2 active:border-r-2 active:translate-y-[1px] active:translate-x-[1px]
        transition-all duration-100 ease-out
        ${
          isActive
            ? 'bg-[#fcf5e0] border-yellow-500 z-10'
            : item.completed
            ? 'bg-gray-100 opacity-60 border-gray-400'
            : isAnchored
            ? 'bg-white border-yellow-600 shadow-[0_0_8px_rgba(234,179,8,0.15)]' // 🟢 金色邊框
            : 'bg-white border-[#2c1810]'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(item);
          }}
          className={`w-5 h-5 border-2 border-black rounded flex items-center justify-center bg-white shrink-0 active:scale-90 transition-all ${
            item.completed ? 'bg-yellow-400' : ''
          }`}
        >
          {item.completed && (
            <Check size={14} className="text-black stroke-[4]" />
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            {/* 🟢 錨定時間顯示 */}
            {isAnchored && (
              <span className="bg-yellow-100 text-yellow-900 border border-yellow-600 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 flex items-center gap-1">
                <Clock size={10} /> {item.time}
              </span>
            )}
            <h3
              className={`font-bold text-[#2c1810] text-xs truncate ${
                item.completed ? 'line-through opacity-50' : ''
              }`}
            >
              {item.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* 🟢 鎖頭圖示 */}
          {isAnchored && !item.completed && (
            <Lock size={12} className="text-yellow-600/70" />
          )}

          {showSupplies && supply && !item.completed && (
            <button
              onClick={handleSupplyClick}
              className={`w-6 h-6 rounded border border-black flex items-center justify-center relative transition-all active:scale-95 ${
                isEquipped
                  ? 'bg-green-600 text-white'
                  : isSupplyOpen
                  ? 'bg-[#f4e4bc] translate-y-[1px]'
                  : 'bg-yellow-400 text-black animate-bounce'
              }`}
            >
              {isEquipped ? (
                <Check size={14} strokeWidth={4} />
              ) : (
                <span className="text-[10px]">{supply.icon}</span>
              )}
              {!isEquipped && !isSupplyOpen && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-black" />
              )}
            </button>
          )}
          <div
            className="w-6 h-6 flex items-center justify-center border border-black rounded shadow-sm text-white"
            style={{ backgroundColor: typeConfig.color }}
          >
            <TypeIcon size={12} />
          </div>
          <button
            onClick={openMaps}
            className="bg-blue-600 text-white w-6 h-6 rounded border border-black active:scale-95 flex items-center justify-center shadow-sm"
          >
            <span className="text-[8px] font-bold italic">GO</span>
          </button>
        </div>
      </div>

      {isSupplyOpen && showSupplies && supply && !item.completed && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-2 pt-1 border-t border-dashed border-gray-300 flex flex-col animate-slide-down origin-top"
        >
          <div className="p-1.5 bg-[#fcf5e0] rounded border border-[#8b4513] relative shadow-inner">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#8b4513] font-bold">
                ✨ 推薦補給
              </span>
              <span className="text-[9px] text-white font-bold bg-[#8b4513] px-1.5 rounded-full">
                +{supply.reward}
              </span>
            </div>
            <a
              href={supply.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handlePurchase}
              className={`flex items-center justify-center gap-1.5 ${supply.color} text-white py-1.5 rounded border border-black shadow-[1px_1px_0_0_rgba(0,0,0,0.2)] active:translate-y-0.5 active:shadow-none transition-all text-[10px] font-bold`}
            >
              <span>{supply.icon}</span>
              <span>獲取 {supply.label}</span>
              <ExternalLink size={10} className="opacity-70" />
            </a>
          </div>
        </div>
      )}
      {isActive && (
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 bg-red-600 text-white text-[8px] py-1 px-0.5 border border-black font-bold z-20 [writing-mode:vertical-lr] rotate-180 rounded-l">
          Q
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. TimeBlock
// ==========================================
const DraggableActivityWrapper = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
    touchAction: 'pan-y',
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ActivityCard {...props} onClick={() => props.onEdit(props.item)} />
    </div>
  );
};

const TimeBlock = ({
  id,
  activities,
  onEdit,
  onToggleComplete,
  appSettings,
  onGainXp,
}) => {
  const { setNodeRef } = useDroppable({ id });
  const theme = {
    morning: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      bar: 'bg-orange-400',
    },
    afternoon: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      bar: 'bg-blue-400',
    },
    evening: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      bar: 'bg-indigo-900',
    },
  };
  const style = theme[id];

  return (
    <div
      ref={setNodeRef}
      className={`relative flex w-full min-h-[40px] ${style.bg} border-b ${style.border}`}
    >
      <div className={`w-1.5 shrink-0 ${style.bar}`}></div>
      <div className="flex-1 p-1 pl-2">
        <SortableContext
          items={activities.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {activities.length === 0 ? (
            <div className="h-8 flex items-center justify-center text-[10px] text-gray-300 font-bold border border-dashed border-gray-200 rounded">
              +
            </div>
          ) : (
            activities.map((item) => (
              <DraggableActivityWrapper
                key={item.id}
                item={item}
                onEdit={onEdit}
                onToggleComplete={onToggleComplete}
                appSettings={appSettings}
                onGainXp={onGainXp}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

// ==========================================
// 3. Modals
// ==========================================
const BudgetStatsModal = ({ isOpen, onClose, totalBudget }) => {
  const [stats, setStats] = useState({ total: 0, breakdown: {} });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const fetchGlobalStats = async () => {
        const { data } = await supabase.from('itinerary').select('type, cost');
        if (data) {
          const newStats = data.reduce(
            (acc, item) => {
              const type = item.type || 'other';
              const cost = Number(item.cost) || 0;
              acc.breakdown[type] = (acc.breakdown[type] || 0) + cost;
              acc.total += cost;
              return acc;
            },
            { total: 0, breakdown: {} }
          );
          setStats(newStats);
        }
        setLoading(false);
      };
      fetchGlobalStats();
    }
  }, [isOpen]);
  if (!isOpen) return null;
  const sortedKeys = Object.keys(stats.breakdown).sort(
    (a, b) => stats.breakdown[b] - stats.breakdown[a]
  );
  const remaining = (totalBudget || 0) - stats.total;
  const isOverBudget = remaining < 0;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 animate-fade-in">
      <div className="bg-[#f4e4bc] w-full max-w-md border-4 border-black p-0 shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
        <div className="bg-[#2c1810] p-4 flex justify-between items-center shrink-0">
          <h2 className="text-[#f4e4bc] font-bold text-lg flex items-center gap-2">
            <DollarSign size={20} /> 旅費分析書
          </h2>
          <button onClick={onClose} className="text-[#f4e4bc]">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#fffcf5] border-2 border-[#8b4513] p-3 rounded text-center">
                  <div className="text-xs text-[#8b4513]/70 font-bold mb-1">
                    總預算
                  </div>
                  <div className="font-bold text-lg text-[#2c1810]">
                    ${(totalBudget || 0).toLocaleString()}
                  </div>
                </div>
                <div
                  className={`bg-[#fffcf5] border-2 p-3 rounded text-center ${
                    isOverBudget
                      ? 'border-red-500 bg-red-50'
                      : 'border-[#8b4513]'
                  }`}
                >
                  <div className="text-xs text-[#8b4513]/70 font-bold mb-1">
                    已支出
                  </div>
                  <div
                    className={`font-bold text-lg ${
                      isOverBudget ? 'text-red-600' : 'text-[#2c1810]'
                    }`}
                  >
                    ${stats.total.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>預算進度</span>
                  <span
                    className={isOverBudget ? 'text-red-600' : 'text-green-700'}
                  >
                    {isOverBudget
                      ? `超支 $${Math.abs(remaining).toLocaleString()}`
                      : `剩餘 $${remaining.toLocaleString()}`}
                  </span>
                </div>
                <div className="h-4 bg-gray-300 rounded-full border border-black overflow-hidden relative">
                  <div
                    className={`h-full ${
                      isOverBudget ? 'bg-red-500' : 'bg-green-600'
                    }`}
                    style={{
                      width: `${Math.min(
                        (stats.total / (totalBudget || 1)) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <h3 className="font-bold text-[#2c1810] border-b-2 border-[#8b4513] mb-3 pb-1">
                支出分類
              </h3>
              <div className="space-y-3">
                {sortedKeys.map((type) => {
                  const amount = stats.breakdown[type];
                  const percent = Math.min(
                    Math.round((amount / stats.total) * 100),
                    100
                  );
                  const config = TYPE_CONFIG[type] || TYPE_CONFIG.sightseeing;
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded border border-black flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: config.color }}
                      >
                        {React.createElement(config.icon, { size: 16 })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs font-bold text-[#2c1810] mb-1">
                          <span>{config.label}</span>
                          <span>${amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#e6d6ac] rounded-full overflow-hidden">
                          <div
                            className="h-full"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: config.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ isOpen, onClose, item, onSave, onDelete }) => {
  const [form, setForm] = useState({
    title: '',
    type: 'sightseeing',
    timePeriod: 'morning',
    cost: 0,
    time: '',
    location: '',
  });
  useEffect(() => {
    if (item) setForm(item);
    else
      setForm({
        title: '',
        type: 'sightseeing',
        timePeriod: 'morning',
        cost: 0,
        time: '',
        location: '',
      });
  }, [item]);
  const handleSubmit = () => {
    onSave(form, item?.id);
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[#f4e4bc] w-full max-w-sm border-4 border-black p-4 space-y-3 shadow-2xl">
        <h2 className="font-bold text-lg text-[#2c1810] border-b-2 border-[#8b4513] pb-1">
          {item ? '編輯任務' : '新任務'}
        </h2>
        <div>
          <label className="text-xs font-bold text-[#8b4513]">任務名稱</label>
          <input
            className="w-full p-2 border-2 border-[#8b4513] bg-white"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-[#8b4513]">
              時間 (選填)
            </label>
            <input
              type="time"
              className="w-full p-2 border-2 border-[#8b4513] bg-white"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#8b4513]">花費</label>
            <input
              type="number"
              className="w-full p-2 border-2 border-[#8b4513] bg-white"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-[#8b4513]">類型</label>
          <select
            className="w-full p-2 border-2 border-[#8b4513] bg-white"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {Object.keys(TYPE_CONFIG).map((key) => (
              <option key={key} value={key}>
                {TYPE_CONFIG[key].label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-[#8b4513]">地點</label>
          <input
            className="w-full p-2 border-2 border-[#8b4513] bg-white"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="輸入地點..."
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white p-2 font-bold border-2 border-black"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white p-2 font-bold border-2 border-black"
          >
            儲存
          </button>
        </div>
        {item && (
          <button
            onClick={() => onDelete(item.id)}
            className="w-full text-red-600 text-xs font-bold mt-1 hover:underline"
          >
            刪除此任務
          </button>
        )}
      </div>
    </div>
  );
};

// 🟢 增強版 BackpackModal (含匯入功能)
const BackpackModal = ({ isOpen, onClose }) => {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [isImportMode, setIsImportMode] = useState(false); // 控制是否顯示匯入框
  const [importText, setImportText] = useState('');

  useEffect(() => {
    if (isOpen)
      supabase
        .from('backpack')
        .select('*')
        .order('id')
        .then(({ data }) => {
          if (data) setItems(data);
        });
  }, [isOpen]);

  const handleAdd = async () => {
    if (!newItemText.trim()) return;
    const { data } = await supabase
      .from('backpack')
      .insert([{ text: newItemText, checked: false }])
      .select();
    if (data) setItems([...items, data[0]]);
    setNewItemText('');
  };

  // 批量匯入邏輯
  const handleBulkImport = async () => {
    const lines = importText.split('\n').filter((l) => l.trim());
    if (lines.length === 0) return;
    const newItems = lines.map((text) => ({
      text: text.trim(),
      checked: false,
    }));

    const { data } = await supabase.from('backpack').insert(newItems).select();
    if (data) setItems([...items, ...data]);
    setImportText('');
    setIsImportMode(false);
  };

  const toggleItem = async (id, currentChecked) => {
    setItems(
      items.map((i) => (i.id === id ? { ...i, checked: !currentChecked } : i))
    );
    await supabase
      .from('backpack')
      .update({ checked: !currentChecked })
      .eq('id', id);
  };
  const deleteItem = async (id) => {
    setItems(items.filter((i) => i.id !== id));
    await supabase.from('backpack').delete().eq('id', id);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[#f4e4bc] w-full max-w-sm border-4 border-black p-4 shadow-2xl relative">
        <div className="flex justify-between items-center mb-4 border-b-2 border-[#8b4513] pb-2">
          <h2 className="font-bold text-[#2c1810] flex gap-2">
            <Backpack /> 冒險背包
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsImportMode(!isImportMode)}
              className="text-xs font-bold text-blue-600 underline"
            >
              {isImportMode ? '返回列表' : '批量匯入'}
            </button>
            <button onClick={onClose}>
              <X />
            </button>
          </div>
        </div>

        {isImportMode ? (
          <div className="animate-fade-in">
            <p className="text-xs text-[#8b4513] mb-2">一行一個物品：</p>
            <textarea
              className="w-full h-40 p-2 border-2 border-[#8b4513] bg-white text-sm"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="護照&#10;充電器&#10;雨傘..."
            />
            <button
              onClick={handleBulkImport}
              className="w-full mt-2 bg-[#2c1810] text-[#f4e4bc] py-2 font-bold"
            >
              開始匯入
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <input
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="flex-1 border-2 border-[#8b4513] px-2 py-1"
                placeholder="新增裝備..."
              />
              <button
                onClick={handleAdd}
                className="bg-[#2c1810] text-[#f4e4bc] px-3 font-bold"
              >
                ＋
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 p-2 border-2 ${
                    item.checked
                      ? 'bg-gray-300 opacity-60'
                      : 'bg-white border-[#8b4513]'
                  }`}
                >
                  <button onClick={() => toggleItem(item.id, item.checked)}>
                    {item.checked ? (
                      <CheckSquare className="text-green-600" />
                    ) : (
                      <Square />
                    )}
                  </button>
                  <span
                    className={`flex-1 font-bold ${
                      item.checked ? 'line-through' : ''
                    }`}
                  >
                    {item.text}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/// 🟢 增強版 ShoppingModal (含匯入功能)
const ShoppingModal = ({ isOpen, onClose }) => {
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');

  // 新增這兩個狀態來控制匯入介面
  const [isImportMode, setIsImportMode] = useState(false);
  const [importText, setImportText] = useState('');

  useEffect(() => {
    if (isOpen)
      supabase
        .from('shopping')
        .select('*')
        .order('id')
        .then(({ data }) => {
          if (data) setItems(data);
        });
  }, [isOpen]);

  const handleAdd = async () => {
    if (!newItemText.trim()) return;
    const { data } = await supabase
      .from('shopping')
      .insert([{ text: newItemText, checked: false }])
      .select();
    if (data) setItems([...items, data[0]]);
    setNewItemText('');
  };

  // 🟢 批量匯入邏輯 (寫入 shopping 表)
  const handleBulkImport = async () => {
    const lines = importText.split('\n').filter((l) => l.trim());
    if (lines.length === 0) return;
    const newItems = lines.map((text) => ({
      text: text.trim(),
      checked: false,
    }));

    const { data } = await supabase.from('shopping').insert(newItems).select();
    if (data) setItems([...items, ...data]);
    setImportText('');
    setIsImportMode(false);
  };

  const toggleItem = async (id, currentChecked) => {
    setItems(
      items.map((i) => (i.id === id ? { ...i, checked: !currentChecked } : i))
    );
    await supabase
      .from('shopping')
      .update({ checked: !currentChecked })
      .eq('id', id);
  };
  const deleteItem = async (id) => {
    setItems(items.filter((i) => i.id !== id));
    await supabase.from('shopping').delete().eq('id', id);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[#f4e4bc] w-full max-w-sm border-4 border-black p-4 shadow-2xl relative">
        <div className="flex justify-between items-center mb-4 border-b-2 border-[#8b4513] pb-2">
          <h2 className="font-bold text-[#2c1810] flex gap-2">
            <ShoppingBag /> 購物清單
          </h2>
          <div className="flex gap-2">
            {/* 🟢 切換匯入模式的按鈕 */}
            <button
              onClick={() => setIsImportMode(!isImportMode)}
              className="text-xs font-bold text-blue-600 underline"
            >
              {isImportMode ? '返回列表' : '批量匯入'}
            </button>
            <button onClick={onClose}>
              <X />
            </button>
          </div>
        </div>

        {/* 🟢 匯入介面與列表介面的切換 */}
        {isImportMode ? (
          <div className="animate-fade-in">
            <p className="text-xs text-[#8b4513] mb-2">一行一個商品：</p>
            <textarea
              className="w-full h-40 p-2 border-2 border-[#8b4513] bg-white text-sm"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="合利他命&#10;抹茶餅乾&#10;清酒..."
            />
            <button
              onClick={handleBulkImport}
              className="w-full mt-2 bg-[#2c1810] text-[#f4e4bc] py-2 font-bold"
            >
              開始匯入
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <input
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="flex-1 border-2 border-[#8b4513] px-2 py-1"
                placeholder="新增購買項目..."
              />
              <button
                onClick={handleAdd}
                className="bg-[#2c1810] text-[#f4e4bc] px-3 font-bold"
              >
                ＋
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 p-2 border-2 ${
                    item.checked
                      ? 'bg-gray-300 opacity-60'
                      : 'bg-white border-[#8b4513]'
                  }`}
                >
                  <button onClick={() => toggleItem(item.id, item.checked)}>
                    {item.checked ? (
                      <CheckSquare className="text-green-600" />
                    ) : (
                      <Square />
                    )}
                  </button>
                  <span
                    className={`flex-1 font-bold ${
                      item.checked ? 'line-through' : ''
                    }`}
                  >
                    {item.text}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ImportModal = ({ isOpen, onClose, onImport, dayId }) => {
  const [text, setText] = useState('');
  const handleImport = () => {
    if (!text.trim()) return;
    onImport(text, dayId);
    setText('');
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[#f4e4bc] w-full max-w-md border-4 border-black p-4 shadow-2xl relative animate-slide-up">
        <div className="flex justify-between items-center mb-4 border-b-2 border-[#8b4513] pb-2">
          <h2 className="font-bold text-[#2c1810] flex gap-2">
            <FileText /> 快速匯入 (Day {dayId})
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <textarea
          className="w-full h-40 p-2 border-2 border-[#8b4513] bg-white resize-none font-mono text-sm"
          placeholder="在此貼上你的行程..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white p-2 font-bold border-2 border-black"
          >
            取消
          </button>
          <button
            onClick={handleImport}
            className="flex-1 bg-blue-600 text-white p-2 font-bold border-2 border-black"
          >
            開始匯入
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. FloatingMenu (漢堡選單整合)
// ==========================================
// 🟢 3. 更新 FloatingMenu，加入 onBack 與離開按鈕
const FloatingMenu = ({
  onOpenStats,
  onOpenBackpack,
  onOpenSettings,
  onOpenImport,
  onOpenShopping,
  onBack, // 接收回到首頁的函式
  tripTitle,
  budgetRemaining,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="pointer-events-auto relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#2c1810] text-[#f4e4bc] w-12 h-12 rounded-full border-2 border-[#f4e4bc] flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-[#4a2818]"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-14 right-0 bg-[#fffcf5] border-2 border-[#2c1810] rounded-lg shadow-xl w-48 overflow-hidden animate-slide-down origin-top-right flex flex-col z-50">
          <div
            onClick={() => {
              onOpenStats();
              setIsOpen(false);
            }}
            className="p-3 bg-[#2c1810] text-[#f4e4bc] border-b border-[#8b4513] flex flex-col items-center cursor-pointer hover:bg-[#4a2818] transition-colors"
          >
            <span className="text-[10px] opacity-70 font-bold uppercase tracking-wider">
              剩餘預算
            </span>
            <div className="flex items-center gap-1 font-mono font-black text-xl">
              <DollarSign size={16} />
              {budgetRemaining?.toLocaleString()}
            </div>
          </div>
          <div className="p-1">
            <button
              onClick={() => {
                onOpenBackpack();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2 text-[#2c1810] font-bold hover:bg-[#f4e4bc] rounded transition-colors text-sm"
            >
              <Backpack size={18} /> 冒險背包
            </button>
            <button
              onClick={() => {
                onOpenShopping();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2 text-[#2c1810] font-bold hover:bg-[#f4e4bc] rounded transition-colors text-sm"
            >
              <ShoppingBag size={18} /> 購物清單
            </button>
            <button
              onClick={() => {
                onOpenSettings();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2 text-[#2c1810] font-bold hover:bg-[#f4e4bc] rounded transition-colors text-sm"
            >
              <Settings size={18} /> 行程設定
            </button>
            <button
              onClick={() => {
                onOpenImport();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2 text-[#2c1810] font-bold hover:bg-[#f4e4bc] rounded transition-colors text-sm"
            >
              <FileText size={18} /> 快速匯入
            </button>

            {/* 分隔線 */}
            <div className="h-px bg-[#e6d6ac] my-1 mx-2"></div>

            {/* 🔴 離開按鈕 */}
            <button
              onClick={() => {
                onBack();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2 text-red-600 font-bold hover:bg-red-50 rounded transition-colors text-sm"
            >
              <LogOut size={18} /> 離開旅程
            </button>
          </div>
          <div className="bg-gray-200 p-1 text-center text-[9px] text-gray-500 font-mono">
            v1.4.1 RPG
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. DrawerHeader (表頭)
// ==========================================
const DrawerHeader = ({
  days,
  selectedDayId,
  onSelectDay,
  panelState,
  onTogglePanel,
  onMaximize,
}) => {
  const selectedDayIndex = days.findIndex((d) => d.id === selectedDayId);
  const handlePrev = (e) => {
    e.stopPropagation();
    if (selectedDayIndex > 0) onSelectDay(days[selectedDayIndex - 1].id);
  };
  const handleNext = (e) => {
    e.stopPropagation();
    if (selectedDayIndex < days.length - 1)
      onSelectDay(days[selectedDayIndex + 1].id);
  };

  return (
    <div
      onClick={onTogglePanel}
      className="h-[50px] bg-[#2c1810] flex items-center justify-between px-3 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.3)] relative z-30 cursor-pointer"
    >
      <div className="flex items-center gap-3 pl-1">
        <button
          onClick={handlePrev}
          disabled={selectedDayIndex === 0}
          className="w-8 h-8 rounded-full border border-[#f4e4bc]/30 flex items-center justify-center text-[#f4e4bc] disabled:opacity-30 active:bg-white/10"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center min-w-[80px]">
          <div className="text-[10px] text-[#f4e4bc]/60 font-bold tracking-widest uppercase leading-none mb-1">
            DAY {selectedDayIndex + 1}
          </div>
          <div className="text-[#f4e4bc] font-bold text-lg leading-none">
            {days[selectedDayIndex]?.date || 'Date'}
          </div>
        </div>
        <button
          onClick={handleNext}
          disabled={selectedDayIndex === days.length - 1}
          className="w-8 h-8 rounded-full border border-[#f4e4bc]/30 flex items-center justify-center text-[#f4e4bc] disabled:opacity-30 active:bg-white/10"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onMaximize();
        }}
        className="w-10 h-10 rounded hover:bg-white/10 flex items-center justify-center text-[#f4e4bc] transition-colors"
      >
        {panelState === 'full' ? (
          <Minimize2 size={20} />
        ) : (
          <Maximize2 size={20} />
        )}
      </button>
    </div>
  );
};

// ==========================================
// 🚀 主頁面 ItineraryPage
// ==========================================
export default function ItineraryPage({ appSettings, onOpenSettings, onBack }) {
  const [dayId, setDayId] = useState(1);
  const [panelState, setPanelState] = useState('mid');

  const {
    activities,
    userProfile,
    tripMeta,
    totalTripCost,
    updateTripMeta,
    loading,
    saveActivity,
    deleteActivity,
    toggleComplete,
    reorderActivities,
    addXp,
  } = useItinerary(1, dayId);

  const [activeId, setActiveId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [isShoppingOpen, setIsShoppingOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isTripSettingsOpen, setIsTripSettingsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const days = useMemo(() => {
    const list = [];
    const start = tripMeta?.start_date
      ? new Date(tripMeta.start_date)
      : new Date();
    const count = tripMeta?.day_count || 1;
    for (let i = 0; i < count; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      list.push({ id: i + 1, date: `${d.getMonth() + 1}/${d.getDate()}` });
    }
    return list;
  }, [tripMeta]);

  const getPanelHeight = () => {
    if (panelState === 'min') return 'h-[50px]';
    if (panelState === 'mid') return 'h-[45%]';
    return 'h-[90%]';
  };
  const togglePanel = () => {
    if (panelState === 'full') setPanelState('mid');
    else if (panelState === 'mid') setPanelState('min');
    else setPanelState('mid');
  };
  const toggleMaximize = () => {
    if (panelState === 'full') setPanelState('mid');
    else setPanelState('full');
  };

  // 🟢 修正：手機版拖曳感應器設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // 原本是 distance: 8 (移動8px就拖曳)，這會卡死捲動
        // 👇 改成這樣：
        delay: 250, // 手指要「按住」250毫秒 (0.25秒) 才會觸發拖曳
        tolerance: 5, // 如果在這 0.25秒內，手指移動超過 5px，系統就判定你是要「滑動頁面」，取消拖曳
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => setActiveId(event.active.id);

  // 跨時段拖曳邏輯 (DragOver)
  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeItem = activities.find((a) => a.id === active.id);
    if (!activeItem) return;
  };

  // 拖曳結束邏輯 (DragEnd)
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const overId = over.id;
    let overContainer = null;

    if (['morning', 'afternoon', 'evening'].includes(overId)) {
      overContainer = overId;
    } else {
      const overItem = activities.find((a) => a.id === overId);
      if (overItem) overContainer = overItem.timePeriod;
    }

    if (overContainer) {
      reorderActivities(active.id, over.id, overContainer);
    }
    setActiveId(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };
  const handleAdd = () => {
    setEditingItem(null);
    setIsEditOpen(true);
  };

  const handleMarkerClick = (id) => {
    // 1. 打開抽屜
    setPanelState('mid');

    // 2. 等待動畫
    setTimeout(() => {
      const element = document.getElementById(`card-${id}`);

      if (element) {
        // 🟢 修改點 1：將 block 改為 'start'，讓卡片捲動到列表的最頂端
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // 🟢 修改點 2：加入短暫的黃色閃爍特效 (Highlight)
        // 這樣使用者一眼就知道是哪一張
        element.style.transition = 'background-color 0.5s';
        const originalBg = element.style.backgroundColor; // 暫存原本背景
        element.style.backgroundColor = '#fef08a'; // 亮黃色 (yellow-200)

        // 1秒後恢復原狀
        setTimeout(() => {
          element.style.backgroundColor = originalBg;
        }, 1000);
      }
    }, 300);
  };

  // 🟢 智慧匯入 (修正時間定義版)
  const handleSmartImport = (text, targetDayId) => {
    // 1. 關鍵字標準化
    const normalizedText = text
      .replace(/：/g, ':')
      .replace(/(Time|time|TIME):/g, '時間:')
      .replace(/(Name|name|Title|title):/g, '名稱:')
      .replace(/(Loc|Location|location):/g, '地點:')
      .replace(/(Type|type):/g, '類型:')
      .replace(/(Cost|Price|cost):/g, '花費:');

    // 2. 解析單一天行程
    const parseBlock = (blockText, dayToSave) => {
      const lines = blockText.split('\n');
      let currentItem = {};
      const typeMap = {
        移動: 'transport',
        交通: 'transport',
        吃飯: 'food',
        用餐: 'food',
        美食: 'food',
        住宿: 'checkin',
        飯店: 'checkin',
        景點: 'sightseeing',
        遊玩: 'sightseeing',
        購物: 'shopping',
        買: 'shopping',
      };

      // 🟢 修改：新的時間判定邏輯
      const getTimePeriod = (timeStr) => {
        if (!timeStr) return 'morning'; // 沒寫時間預設早上
        const hour = parseInt(timeStr.split(':')[0], 10);
        if (isNaN(hour)) return 'morning';

        // 04:00 - 11:59 => 上午
        if (hour >= 4 && hour < 12) return 'morning';

        // 12:00 - 17:59 => 下午
        if (hour >= 12 && hour < 18) return 'afternoon';

        // 剩餘時段 (18:00-23:59 及 00:00-03:59) => 晚上
        return 'evening';
      };

      const flushItem = () => {
        if (currentItem.title) {
          // 使用新的判定邏輯
          const period = getTimePeriod(currentItem.time);

          saveActivity({
            day: dayToSave,
            title: currentItem.title,
            time: currentItem.time || '',
            type: currentItem.type || 'sightseeing',
            location: currentItem.location || '',
            cost: Number(currentItem.cost) || 0,
            timePeriod: period,
          });
          currentItem = {};
        }
      };

      lines.forEach((line) => {
        const cleanLine = line.trim();
        if (!cleanLine) return;
        if (cleanLine.startsWith('時間:'))
          currentItem.time = cleanLine.replace('時間:', '').trim();
        else if (cleanLine.startsWith('名稱:'))
          currentItem.title = cleanLine.replace('名稱:', '').trim();
        else if (cleanLine.startsWith('地點:'))
          currentItem.location = cleanLine.replace('地點:', '').trim();
        else if (cleanLine.startsWith('類型:'))
          currentItem.type =
            typeMap[cleanLine.replace('類型:', '').trim()] || 'sightseeing';
        else if (cleanLine.startsWith('花費:'))
          currentItem.cost = cleanLine.replace('花費:', '').trim();
        else if (cleanLine === '---') flushItem();
      });
      flushItem();
    };

    // 3. 執行匯入
    const dayBlocks = normalizedText.split(/###\s*DAY\s*(\d+)/i);
    if (dayBlocks.length > 1) {
      for (let i = 1; i < dayBlocks.length; i += 2) {
        const dayNum = parseInt(dayBlocks[i]);
        const content = dayBlocks[i + 1];
        parseBlock(content, dayNum);
      }
      alert(
        '🎉 匯入完成！已套用新的時間分類標準 (04:00~11:59 上午 / 12:00~17:59 下午 / 18:00~03:59 晚上)'
      );
    } else {
      parseBlock(normalizedText, targetDayId);
    }
  };

  const morningActs = activities.filter((a) => a.timePeriod === 'morning');
  const afternoonActs = activities.filter((a) => a.timePeriod === 'afternoon');
  const eveningActs = activities.filter((a) => a.timePeriod === 'evening');

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0">
        <GameMap
          activities={activities}
          isToday={true}
          // 🟢 綁定新的函式，它會接收到 GameMap 傳來的 id
          onMarkerClick={handleMarkerClick}
        />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <FloatingMenu
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenBackpack={() => setIsBackpackOpen(true)}
          onOpenShopping={() => setIsShoppingOpen(true)}
          onOpenSettings={() => setIsTripSettingsOpen(true)}
          onOpenImport={() => setIsImportOpen(true)}
          onBack={onBack}
          tripTitle={tripMeta?.title}
          budgetRemaining={tripMeta?.total_budget - totalTripCost}
        />
      </div>

      <div
        className={`absolute bottom-0 w-full bg-white z-20 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-2xl transition-[height] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${getPanelHeight()}`}
      >
        <div className="absolute -top-16 left-4 pointer-events-auto">
          <button
            onClick={() => window.flyToUser && window.flyToUser()}
            className="bg-white text-gray-700 w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:bg-gray-50"
          >
            <LocateFixed size={22} />
          </button>
        </div>
        <div className="absolute -top-16 right-4 pointer-events-auto">
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white w-12 h-12 rounded-full border-2 border-white flex items-center justify-center shadow-xl active:scale-95 transition-transform hover:scale-105"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>

        <DrawerHeader
          days={days}
          selectedDayId={dayId}
          onSelectDay={setDayId}
          panelState={panelState}
          onTogglePanel={togglePanel}
          onMaximize={toggleMaximize}
        />

        <div className="flex-1 overflow-y-auto bg-[#fffcf5] pb-20">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <TimeBlock
              id="morning"
              activities={morningActs}
              onEdit={handleEdit}
              onToggleComplete={toggleComplete}
              appSettings={appSettings}
              onGainXp={addXp}
            />
            <TimeBlock
              id="afternoon"
              activities={afternoonActs}
              onEdit={handleEdit}
              onToggleComplete={toggleComplete}
              appSettings={appSettings}
              onGainXp={addXp}
            />
            <TimeBlock
              id="evening"
              activities={eveningActs}
              onEdit={handleEdit}
              onToggleComplete={toggleComplete}
              appSettings={appSettings}
              onGainXp={addXp}
            />
            <DragOverlay>
              {activeId ? (
                <div className="opacity-90 rotate-3 scale-105">
                  <ActivityCard
                    item={activities.find((a) => a.id === activeId)}
                    isActive={true}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
          <div className="h-24 flex items-center justify-center opacity-20 pointer-events-none">
            <MapIcon size={48} className="text-[#8b4513]" />
          </div>
        </div>
      </div>
      <EditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        item={editingItem}
        onSave={saveActivity}
        onDelete={deleteActivity}
      />
      <BackpackModal
        isOpen={isBackpackOpen}
        onClose={() => setIsBackpackOpen(false)}
      />
      <BudgetStatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        totalBudget={tripMeta?.total_budget}
      />
      <TripSettingsModal
        isOpen={isTripSettingsOpen}
        onClose={() => setIsTripSettingsOpen(false)}
        tripMeta={tripMeta}
        onUpdate={updateTripMeta}
      />
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleSmartImport}
        dayId={dayId}
      />
      <ShoppingModal
        isOpen={isShoppingOpen}
        onClose={() => setIsShoppingOpen(false)}
      />
    </div>
  );
}
