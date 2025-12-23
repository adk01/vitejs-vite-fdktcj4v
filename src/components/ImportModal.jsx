// src/components/ImportModal.jsx
import React, { useState } from 'react';
import { FileText, X } from 'lucide-react';

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
          <h2 className="font-bold text-[#2c1810] flex gap-2"><FileText /> 快速匯入 (Day {dayId})</h2>
          <button onClick={onClose}><X /></button>
        </div>
        
        <div className="text-xs text-[#8b4513] mb-3 bg-[#e6d6ac] p-2 rounded border border-[#8b4513]">
          <p className="font-bold mb-1">支援格式：</p>
          <code className="block whitespace-pre font-mono">
            時間：10:00<br/>
            名稱：抵達機場<br/>
            類型：交通
          </code>
        </div>
        
        <textarea
          className="w-full h-40 p-2 border-2 border-[#8b4513] bg-white resize-none font-mono text-sm"
          placeholder="在此貼上你的行程..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 bg-gray-500 text-white p-2 font-bold border-2 border-black">取消</button>
          <button onClick={handleImport} className="flex-1 bg-blue-600 text-white p-2 font-bold border-2 border-black">開始匯入</button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;