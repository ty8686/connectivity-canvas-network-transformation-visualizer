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
  const isPrimary = data.isPrimary as boolean;
  const isTrafficStart = !!data.isTrafficStart;
  const isTrafficEnd = !!data.isTrafficEnd;
  const isDirectHover = hoveredNodeId === id;
  const isActivePath = activePathNodeIds.includes(id);
  const activeColor = mode === 'future' ? '#F38020' : '#2D2D2D';
  return (
    <div className={cn(
      "px-4 py-2 min-w-[120px] text-center sketchy-card flex flex-col items-center gap-2 transition-all duration-300",
      isPrimary ? "border-[#F48120] bg-orange-50/50 shadow-[4px_4px_0px_#F48120]" : "border-[#2D2D2D] bg-white shadow-[4px_4px_0px_#2D2D2D]",
      isActivePath && "ring-2 ring-[#F38020] ring-offset-2 scale-105",
      isTrafficEnd && "bg-gray-50 border-double border-4"
    )}>
      {/* Role Indicators */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1">
        {isTrafficStart && (
          <div className="bg-blue-500 text-white p-1 rounded-full shadow-sm border border-white animate-bounce">
            <PlayCircle size={12} />
          </div>
        )}
        {isTrafficEnd && (
          <div className="bg-red-500 text-white p-1 rounded-full shadow-sm border border-white">
            <Flag size={12} />
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-[#2D2D2D] border-2 border-white" />
      <div className={cn(
        "p-2 rounded-full transition-colors duration-500 border-2",
        mode === 'future' ? "bg-orange-100/50 border-orange-200" : "bg-gray-100 border-gray-200",
        isActivePath && "bg-orange-100 border-[#F38020]"
      )} style={{ color: isActivePath ? '#F38020' : activeColor }}>
        <Icon size={24} strokeWidth={2} />
      </div>
      <span
        className="text-xs font-black font-sans uppercase tracking-tight transition-colors duration-500"
        style={{ color: isActivePath ? '#F38020' : activeColor }}
      >
        {data.label as string}
      </span>
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-[#2D2D2D] border-2 border-white" />
    </div>
  );
});
SketchyNode.displayName = 'SketchyNode';