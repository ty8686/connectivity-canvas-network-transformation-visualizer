import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Shield, Server, Database, Users, Layers, Cloud, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';
const ICON_MAP = {
  shield: Shield,
  server: Server,
  database: Database,
  users: Users,
  layers: Layers,
  cloud: Cloud,
  harddrive: HardDrive,
};
export const SketchyNode = memo(({ data }: NodeProps) => {
  const Icon = ICON_MAP[data.iconType as keyof typeof ICON_MAP] || Server;
  const isPrimary = data.isPrimary as boolean;
  return (
    <div className={cn(
      "px-4 py-2 min-w-[120px] text-center sketchy-card flex flex-col items-center gap-2",
      isPrimary ? "border-[#F48120] bg-orange-50" : "border-[#2D2D2D] bg-white"
    )}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-foreground" />
      <div className={cn(
        "p-2 rounded-full",
        isPrimary ? "bg-orange-100 text-[#F48120]" : "bg-gray-100 text-gray-600"
      )}>
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <span className="text-sm font-medium font-sans text-foreground">
        {data.label as string}
      </span>
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-foreground" />
    </div>
  );
});
SketchyNode.displayName = 'SketchyNode';