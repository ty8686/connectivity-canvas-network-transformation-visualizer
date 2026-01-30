import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Shield, Server, Database, Users, Layers, Cloud, HardDrive, PlayCircle, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/editor-store';
import { useShallow } from 'zustand/react/shallow';
const ICON_MAP = {
  shield: Shield,
  server: Server,
  database: Database,
  users: Users,
  layers: Layers,
  cloud: Cloud,
  harddrive: HardDrive,
};
export const SketchyNode = memo(({ id, data }: NodeProps) => {
  const mode = useEditorStore(s => s.mode);
  const hoveredNodeId = useEditorStore(s => s.hoveredNodeId);
  const activePathNodeIds = useEditorStore(useShallow(s => s.activePathNodeIds));
  const Icon = ICON_MAP[data.iconType as keyof typeof ICON_MAP] || Server;
  const isPrimary = !!data.isPrimary;
  const isTrafficStart = !!data.isTrafficStart;
  const isTrafficEnd = !!data.isTrafficEnd;
  const isActivePath = activePathNodeIds.includes(id);
  const isHovered = hoveredNodeId === id;
  const activeColor = mode === 'future' ? '#F38020' : '#2D2D2D';
  return (
    <div className={cn(
      "px-5 py-3 min-w-[140px] sketchy-card flex flex-col items-center gap-2.5 transition-all duration-300",
      isPrimary ? "border-[#F48120] bg-orange-50/30 shadow-[4px_4px_0px_#F48120]" : "border-[#2D2D2D] bg-white shadow-[4px_4px_0px_#2D2D2D]",
      isActivePath && "ring-4 ring-[#F38020]/20 scale-105 z-50",
      isHovered && "translate-y-[-2px] shadow-[6px_6px_0px_#2D2D2D]"
    )}>
      {/* Dynamic Role Indicators */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {isTrafficStart && (
          <div className="bg-blue-600 text-white p-1 rounded-full shadow-lg border-2 border-white animate-bounce">
            <PlayCircle size={14} fill="currentColor" fillOpacity={0.2} />
          </div>
        )}
        {isTrafficEnd && (
          <div className="bg-rose-600 text-white p-1 rounded-full shadow-lg border-2 border-white">
            <Flag size={14} fill="currentColor" fillOpacity={0.2} />
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-[#2D2D2D] border-2 border-white" />
      <div className={cn(
        "p-2.5 rounded-full transition-all duration-500 border-2",
        mode === 'future' ? "bg-orange-100/50 border-orange-200" : "bg-slate-100 border-slate-200",
        isActivePath && "bg-orange-100 border-[#F38020]"
      )} style={{ color: isActivePath || isHovered ? '#F38020' : activeColor }}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <span
        className="text-[10px] font-black font-sans uppercase tracking-tight transition-colors duration-500"
        style={{ color: isActivePath || isHovered ? '#F38020' : activeColor }}
      >
        {data.label as string}
      </span>
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-[#2D2D2D] border-2 border-white" />
      {isTrafficEnd && (
        <div className="absolute inset-0 border-[3px] border-double border-rose-100 pointer-events-none rounded-lg opacity-50" />
      )}
    </div>
  );
});
SketchyNode.displayName = 'SketchyNode';