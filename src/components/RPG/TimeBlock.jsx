import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ActivityCard from './ActivityCard';
import { Sun, Sunset, Moon } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PERIOD_STYLES = {
  morning: { icon: Sun, color: 'text-orange-500', bg: 'bg-orange-100/10' },
  afternoon: { icon: Sunset, color: 'text-yellow-600', bg: 'bg-yellow-100/10' },
  evening: { icon: Moon, color: 'text-purple-400', bg: 'bg-indigo-900/20' },
};

// 🟢 修復重點：Wrapper 必須正確處理 onClick
const DraggableActivityWrapper = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none', 
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* 重點：這裡我們明確傳入 onClick，當卡片被點擊時，
         如果不是在拖曳狀態，就會觸發 onEdit 
      */}
      <ActivityCard 
        {...props} 
        onClick={() => props.onEdit(props.item)} 
      />
    </div>
  );
};

const TimeBlock = ({ id, label, activities, onEdit, onToggleComplete, appSettings }) => {
  const { setNodeRef } = useDroppable({ id });
  const style = PERIOD_STYLES[id] || PERIOD_STYLES.morning;
  const Icon = style.icon;

  return (
    <div ref={setNodeRef} className={`mb-4 rounded-lg border-2 border-[#8b4513]/30 overflow-hidden ${style.bg}`}>
      <div className="bg-[#2c1810]/80 p-2 flex items-center justify-between border-b border-[#8b4513]/30">
        <div className="flex items-center gap-2">
          <Icon size={18} className={style.color} />
          <h3 className="text-[#f4e4bc] font-bold text-sm tracking-wider">{label}</h3>
        </div>
        <span className="text-[10px] text-[#f4e4bc]/60 font-mono">
          {activities.length} QUESTS
        </span>
      </div>

      <div className="p-2 min-h-[100px] space-y-2">
        <SortableContext 
          items={activities.map(a => a.id)} 
          strategy={verticalListSortingStrategy}
        >
          {activities.length === 0 ? (
            <div className="h-20 flex items-center justify-center border-2 border-dashed border-[#8b4513]/20 rounded text-[#8b4513]/40 text-xs font-bold">
              拖曳任務至此或新增
            </div>
          ) : (
            activities.map(item => (
              <DraggableActivityWrapper 
                key={item.id} 
                item={item} 
                onEdit={onEdit} 
                onToggleComplete={onToggleComplete}
                appSettings={appSettings}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default TimeBlock;