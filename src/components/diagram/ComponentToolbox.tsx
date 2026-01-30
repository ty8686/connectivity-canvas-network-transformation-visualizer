import React from 'react';
import { Shield, Server, Database, Users, Layers, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
const TOOLS = [
  { type: 'users', label: 'Users', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { type: 'shield', label: 'Firewall', icon: Shield, color: 'text-red-500', bg: 'bg-red-50' },
  { type: 'layers', label: 'Load Balancer', icon: Layers, color: 'text-purple-500', bg: 'bg-purple-50' },
  { type: 'server', label: 'Web Server', icon: Server, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { type: 'database', label: 'Database', icon: Database, color: 'text-amber-600', bg: 'bg-amber-50' },
  { type: 'cloud', label: 'Cloud Edge', icon: Cloud, color: 'text-[#F48120]', bg: 'bg-orange-50' },
];
export function ComponentToolbox() {
  const onDragStart = (event: React.DragEvent, nodeType: string, iconType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, iconType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <aside className="absolute left-6 top-6 z-20 w-16 md:w-44 flex flex-col gap-4 font-sans">
      <div className="sketchy-card p-3 bg-white/95 backdrop-blur-sm shadow-xl border-[#2D2D2D]">
        <h3 className="font-sans font-bold text-md mb-3 hidden md:block border-b border-border pb-2 text-[#2D2D2D]">Infrastructure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {TOOLS.map((tool) => (
            <div
              key={tool.type}
              draggable
              onDragStart={(e) => onDragStart(e, 'sketchy', tool.type, tool.label)}
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary cursor-grab active:cursor-grabbing transition-all group border border-transparent hover:border-border"
              title={tool.label}
            >
              <div className={cn("p-2 rounded-md transition-all shadow-sm border border-border group-hover:scale-110", tool.bg, tool.color)}>
                <tool.icon size={20} strokeWidth={2} />
              </div>
              <span className="text-[9px] mt-1 font-semibold uppercase tracking-tighter text-[#2D2D2D] hidden md:block">{tool.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="sketchy-card p-3 bg-white/95 backdrop-blur-sm hidden md:block border-[#2D2D2D]">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F48120] animate-pulse" />
          <p className="text-[10px] text-[#2D2D2D] uppercase font-semibold tracking-tighter">Usage</p>
        </div>
        <p className="text-[11px] leading-tight text-[#2D2D2D] opacity-80 font-semibold">Drag icons to the canvas to map your infrastructure.</p>
      </div>
    </aside>
  );
}