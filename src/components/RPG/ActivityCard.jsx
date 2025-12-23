import React, { useState, useEffect } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { TYPE_CONFIG, getCoords } from '../../utils'; // 確保路徑

// 這裡我們暫時保留 Supply Map，之後建議移入資料庫
const SUPPLY_MAP = {
  stay: { label: '預訂據點', icon: '🏨', link: 'https://www.agoda.com/', color: 'bg-blue-600', reward: '50 EXP' },
  hotel: { label: '預訂據點', icon: '🏨', link: 'https://www.agoda.com/', color: 'bg-blue-600', reward: '50 EXP' },
  門票: { label: '獲取通行證', icon: '🎟️', link: 'https://www.klook.com/', color: 'bg-orange-500', reward: '30 EXP' },
  車: { label: '購買移動卷軸', icon: '🚄', link: 'https://www.jrpass.com/', color: 'bg-green-600', reward: '40 EXP' },
  交通: { label: '購買移動卷軸', icon: '🚄', link: 'https://www.jrpass.com/', color: 'bg-green-600', reward: '40 EXP' },
  網: { label: '裝備通訊物資', icon: '📶', link: 'https://www.klook.com/', color: 'bg-emerald-500', reward: '20 EXP' },
  // ... 其他關鍵字可自行補充
};

const ActivityCard = ({ item, isActive, onClick, onEdit, onToggleComplete, appSettings }) => {
  const [isSupplyOpen, setIsSupplyOpen] = useState(false);
  const [isEquipped, setIsEquipped] = useState(false);

  const typeConfig = TYPE_CONFIG[item.type] || TYPE_CONFIG.sightseeing;
  const TypeIcon = typeConfig.icon;

  // 簡單的關鍵字匹配邏輯
  const matchedKey = Object.keys(SUPPLY_MAP).find((key) =>
    item.title?.toLowerCase().includes(key)
  );
  const supply = matchedKey ? SUPPLY_MAP[matchedKey] : null;

  useEffect(() => {
    if (item.completed) setIsSupplyOpen(false);
  }, [item.completed]);

  const openMaps = (e) => {
    e.stopPropagation();
    const coords = getCoords(item.location);
    const url = coords
      ? `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location || item.title)}`;
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
  };

  return (
    <div
      id={`card-${item.id}`}
      onClick={onClick}
      className={`relative px-3 py-3 border-4 cursor-pointer transition-all flex flex-col gap-2 mb-2 ${
        isActive
          ? 'bg-[#f4e4bc] border-[#ffd700] scale-[1.02] z-10 shadow-xl'
          : item.completed
          ? 'bg-gray-400 border-gray-600 opacity-60'
          : 'bg-[#e6d6ac] border-[#8b4513] opacity-95'
      }`}
    >
      {/* 內容區塊 */}
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <div
          onClick={(e) => { e.stopPropagation(); onToggleComplete(item); }}
          className={`w-6 h-6 border-2 border-black flex items-center justify-center bg-white shrink-0 active:scale-90 transition-all ${item.completed ? 'bg-yellow-400' : ''}`}
        >
          {item.completed && <Check size={16} className="text-black stroke-[3]" />}
        </div>

        {/* Title & Time */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            {/* 🟢 修改：若時間為空，不顯示或顯示時段圖示 */}
            {item.time ? (
               <span className="bg-[#2c1810] text-[#f4e4bc] text-[10px] px-1.5 py-0.5 font-bold shrink-0">
               {item.time}
             </span>
            ) : null}
           
            <h3 className={`font-bold text-[#2c1810] text-sm truncate ${item.completed ? 'line-through opacity-50' : ''}`}>
              {item.title}
            </h3>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Supply Slot (裝備槽) */}
          {appSettings?.showSupplies && supply && !item.completed && (
            <button
              onClick={handleSupplyClick}
              className={`w-8 h-8 rounded-sm border-2 border-black flex items-center justify-center relative transition-all shadow-sm active:scale-95 ${
                isEquipped ? 'bg-green-600 text-white' : isSupplyOpen ? 'bg-[#f4e4bc] translate-y-[2px] shadow-none' : 'bg-yellow-400 text-black animate-bounce-slow'
              }`}
            >
              {isEquipped ? <Check size={18} strokeWidth={4} /> : <span className="text-sm">{supply.icon}</span>}
              {!isEquipped && !isSupplyOpen && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black" />
              )}
            </button>
          )}

          {/* Type Icon */}
          <div className="w-8 h-8 flex items-center justify-center border-2 border-black rounded shadow-sm text-white" style={{ backgroundColor: typeConfig.color }}>
            <TypeIcon size={16} />
          </div>

          {/* Map Button */}
          <button onClick={openMaps} className="bg-blue-600 text-white w-8 h-8 rounded-sm border-2 border-black active:scale-95 flex items-center justify-center shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            <span className="text-[10px] font-bold italic">GO</span>
          </button>
        </div>
      </div>

      {/* Supply Detail Panel */}
      {isSupplyOpen && appSettings?.showSupplies && supply && !item.completed && (
        <div onClick={(e) => e.stopPropagation()} className="mt-1 pt-2 border-t-2 border-[#8b4513]/20 flex flex-col animate-slide-down origin-top">
          <div className="mt-0 p-2 bg-[#4a3528]/30 rounded-sm border border-[#f4e4bc]/10 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#f4e4bc] font-black uppercase opacity-70">✨ Suggested Supply</span>
              <span className="text-[9px] text-yellow-500 font-black drop-shadow-sm bg-black/40 px-2 py-0.5 rounded-full">+{supply.reward}</span>
            </div>
            <a href={supply.link} target="_blank" rel="noopener noreferrer" onClick={handlePurchase} className={`flex items-center justify-center gap-3 ${supply.color} text-white py-2.5 rounded-sm border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-xs font-black uppercase tracking-widest`}>
              <span>{supply.icon}</span><span>{supply.label}</span><ExternalLink size={12} className="opacity-50" />
            </a>
          </div>
        </div>
      )}

      {isActive && (
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] py-2 px-1 border-2 border-black font-bold z-20 [writing-mode:vertical-lr] rotate-180">
          CURRENT QUEST
        </div>
      )}
    </div>
  );
};

export default ActivityCard;