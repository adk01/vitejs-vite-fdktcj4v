// src/components/TripSettingsModal.jsx
import React, { useState, useEffect } from 'react';
import { Settings, Calendar, DollarSign, Layout } from 'lucide-react';

const TripSettingsModal = ({ isOpen, onClose, tripMeta, onUpdate }) => {
  const [formData, setFormData] = useState(tripMeta);

  useEffect(() => {
    if (tripMeta) setFormData(tripMeta);
  }, [tripMeta]);

  const handleSave = () => {
    onUpdate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 animate-fade-in">
      <div className="bg-[#f4e4bc] w-full max-w-sm border-4 border-black p-4 shadow-2xl relative">
        <h2 className="font-bold text-lg text-[#2c1810] border-b-2 border-[#8b4513] pb-2 mb-4 flex items-center gap-2">
          <Settings size={20} /> 行程設定 (Cloud Sync)
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#8b4513] block mb-1">冒險名稱</label>
            <input 
              className="w-full p-2 border-2 border-[#8b4513] bg-white font-bold text-[#2c1810]" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#8b4513] block mb-1 flex items-center gap-1"><Calendar size={12}/> 出發日期</label>
              <input 
                type="date"
                className="w-full p-2 border-2 border-[#8b4513] bg-white" 
                value={formData.start_date} 
                onChange={e => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#8b4513] block mb-1 flex items-center gap-1"><Layout size={12}/> 天數</label>
              <input 
                type="number"
                className="w-full p-2 border-2 border-[#8b4513] bg-white" 
                value={formData.day_count} 
                onChange={e => setFormData({...formData, day_count: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#8b4513] block mb-1 flex items-center gap-1"><DollarSign size={12}/> 總預算 (Gold)</label>
            <input 
              type="number"
              className="w-full p-2 border-2 border-[#8b4513] bg-white font-mono" 
              value={formData.total_budget} 
              onChange={e => setFormData({...formData, total_budget: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 bg-gray-500 text-white p-2 font-bold border-2 border-black active:translate-y-1">取消</button>
          <button onClick={handleSave} className="flex-1 bg-blue-600 text-white p-2 font-bold border-2 border-black active:translate-y-1 shadow-[2px_2px_0_0_black]">儲存設定</button>
        </div>
      </div>
    </div>
  );
};

export default TripSettingsModal;