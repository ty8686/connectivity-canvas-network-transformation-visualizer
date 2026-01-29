import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Shield, Server, Database, Users, Layers, Cloud, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/editor-store';
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
  const Icon = ICON_MAP[data.iconType as keyof typeof ICON_MAP] || Server;
  const isPrimary = data.isPrimary as boolean;
  const isHovered = hoveredNodeId === id;
  const activeColor = mode === 'future' ? '#F38020' : '#2D2D2D';
  return (
    <div className={cn(
      "px-4 py-2 min-w-[120px] text-center sketchy-card flex flex-col items-center gap-2 transition-all duration-300",
      isPrimary ? "border-[#F48120] bg-orange-50/50" : "border-[#2D2D2D] bg-white",
      isHovered && "ring-2 ring-[#F38020] ring-offset-2 scale-105 shadow-glow"
    )}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-foreground" />
      <div className={cn(
        "p-2 rounded-full transition-colors duration-500",
        mode === 'future' ? "bg-orange-100/50" : "bg-gray-100",
        isHovered && "bg-orange-100"
      )} style={{ color: isHovered ? '#F38020' : activeColor }}>
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <span
        className="text-sm font-medium font-sans transition-colors duration-500"
        style={{ color: isHovered ? '#F38020' : activeColor }}
      >
        {data.label as string}
      </span>
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-foreground" />
    </div>
  );
});
SketchyNode.displayName = 'SketchyNode';