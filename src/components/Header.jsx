import React from 'react';
import { Backpack, Settings, TrendingDown, Coins, LogOut, FileText } from 'lucide-react';

const Header = ({ trip, user, totalCost, onOpenBackpack, onOpenSettings, onGoHome, onOpenStats, onOpenImport }) => {
  // 🟢 修正 1：Supabase 回傳的是 snake_case (total_budget)，這裡要對應修正
  // 這樣就能正確讀到你設定的總預算了
  const budget = trip?.total_budget || 0;
  const remainingBudget = budget - totalCost;
  
  return (
    <header className="relative z-20 bg-[#2c1810] p-2 md:p-3 border-b-4 border-black">
      <div className="flex justify-between items-center gap-2">
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* 左側：回首頁與標題 */}
          <div className="flex items-center gap-2">
            <button
              onClick={onGoHome}
              className="bg-red-800 text-white p-1 rounded-sm border border-red-950 shadow active:scale-95 mr-1"
            >
              <LogOut size={14} />
            </button>
            <h1 className="text-sm md:text-lg font-bold text-[#f4e4bc] truncate tracking-wider">
              {trip.title || '我的冒險'}
            </h1>
            <button
              onClick={onOpenBackpack}
              className="bg-[#8b4513] hover:bg-[#a0522d] text-[#f4e4bc] text-[10px] px-2 py-0.5 rounded-sm border border-[#5c4835] flex items-center gap-1 active:scale-95 transition-transform shrink-0 shadow-sm"
            >
              <Backpack size={10} /> 背包
            </button>
          </div>

          {/* 等級與經驗值條 */}
          <div className="flex items-center gap-2 w-full max-w-[160px]">
            <span className="text-[#f4e4bc] text-[10px] font-bold shrink-0">
              Lv.{user.level}
            </span>
            <div className="h-1.5 flex-1 bg-black border border-[#5c4835] rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 右側：預算與功能按鈕 */}
        <div className="flex flex-col items-end shrink-0 gap-1">
          {/* 預算顯示 */}
          <div 
            onClick={onOpenStats}
            className="cursor-pointer bg-black/30 px-2 py-1 rounded border border-[#f4e4bc]/30 text-right hover:bg-black/50 active:scale-95 transition-all"
          >
            <div className={`text-xs font-bold flex items-center justify-end gap-1 leading-none mb-0.5 ${remainingBudget < 0 ? 'text-red-500' : 'text-yellow-400'}`}>
              <Coins size={12} /> 剩: {remainingBudget.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-red-300 flex items-center justify-end gap-1 leading-none">
              <TrendingDown size={10} /> 花: {totalCost.toLocaleString()}
            </div>
          </div>

          {/* 🟢 修正 2：功能按鈕區 (匯入 + 設定) */}
          <div className="flex gap-1.5">
             {/* 匯入按鈕：樣式與設定按鈕統一 */}
             <button
              onClick={onOpenImport}
              className="w-7 h-7 bg-[#2c1810]/80 border border-[#d4c49c]/50 rounded flex items-center justify-center text-[#d4c49c] active:bg-[#3d2b20] active:scale-95 transition-all"
              title="快速匯入"
            >
              <FileText size={14} />
            </button>

            {/* 設定按鈕 */}
            <button
              onClick={onOpenSettings}
              className="w-7 h-7 bg-[#2c1810]/80 border border-[#d4c49c]/50 rounded flex items-center justify-center text-[#d4c49c] active:bg-[#3d2b20] active:scale-95 transition-all"
              title="行程設定"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;