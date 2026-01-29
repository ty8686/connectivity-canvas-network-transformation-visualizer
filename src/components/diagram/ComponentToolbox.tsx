import React from 'react';
import { Shield, Server, Database, Users, Layers, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
const TOOLS = [
  { type: 'users', label: 'Users', icon: Users },
  { type: 'shield', label: 'Firewall', icon: Shield },
  { type: 'layers', label: 'Load Balancer', icon: Layers },
  { type: 'server', label: 'Web Server', icon: Server },
  { type: 'database', label: 'Database', icon: Database },
  { type: 'cloud', label: 'Cloud Edge', icon: Cloud },
];
export function ComponentToolbox() {
  const onDragStart = (event: React.DragEvent, nodeType: string, iconType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, iconType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <aside className="absolute left-6 top-24 z-20 w-16 md:w-48 flex flex-col gap-4">
      <div className="sketchy-card p-4 bg-white/90 backdrop-blur-sm">
        <h3 className="font-illustrative text-lg mb-4 hidden md:block">Palette</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TOOLS.map((tool) => (
            <div
              key={tool.type}
              draggable
              onDragStart={(e) => onDragStart(e, 'sketchy', tool.type, tool.label)}
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-orange-50 cursor-grab active:cursor-grabbing transition-colors group"
              title={tool.label}
            >
              <div className="p-2 sketchy-border bg-white group-hover:border-[#F48120] transition-colors">
                <tool.icon size={20} className="group-hover:text-[#F48120]" />
              </div>
              <span className="text-[10px] mt-1 font-medium hidden md:block">{tool.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="sketchy-card p-4 bg-white/90 backdrop-blur-sm hidden md:block">
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Pro Tip</p>
        <p className="text-xs mt-1">Drag components to build your current stack.</p>
      </div>
    </aside>
  );
}