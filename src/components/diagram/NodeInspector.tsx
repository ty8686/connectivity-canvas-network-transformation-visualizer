import React, { useMemo } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useShallow } from 'zustand/react/shallow';
import { Shield, Server, Database, Users, Layers, Cloud, HardDrive, Trash2, X, PlayCircle, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
const ICON_OPTIONS = [
  { type: 'users', icon: Users },
  { type: 'shield', icon: Shield },
  { type: 'layers', icon: Layers },
  { type: 'server', icon: Server },
  { type: 'database', icon: Database },
  { type: 'cloud', icon: Cloud },
  { type: 'harddrive', icon: HardDrive },
];
export function NodeInspector() {
  const selectedId = useEditorStore(s => s.selectedNodeId);
  const nodes = useEditorStore(useShallow(s => s.nodes));
  const updateNodeData = useEditorStore(s => s.updateNodeData);
  const deleteNode = useEditorStore(s => s.deleteNode);
  const setSelectedNodeId = useEditorStore(s => s.setSelectedNodeId);
  const node = useMemo(() => nodes.find(n => n.id === selectedId), [nodes, selectedId]);
  if (!node) return null;
  return (
    <div className="absolute top-24 right-8 z-20 w-80 bg-white border-2 border-[#2D2D2D] p-6 shadow-[8px_8px_0px_#2D2D2D] rounded-xl animate-in fade-in slide-in-from-right-6 duration-300 font-sans text-[#2D2D2D]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-black tracking-tight text-[#2D2D2D] uppercase italic">Edit Node</h3>
          <p className="text-[10px] text-[#2D2D2D] opacity-60 font-mono font-bold">UID: {node.id.slice(0, 12)}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedNodeId(null)} className="h-8 w-8 rounded-full hover:bg-secondary">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-6">
        <div className="space-y-2.5">
          <Label htmlFor="node-label" className="text-[10px] uppercase font-black tracking-widest text-[#2D2D2D] opacity-80 px-1">Display Label</Label>
          <Input
            id="node-label"
            value={String(node.data.label || "")}
            onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
            className="rounded-md border-2 border-[#2D2D2D] h-10 focus-visible:ring-[#F38020] transition-shadow bg-secondary/20 text-[#2D2D2D] font-bold"
          />
        </div>
        <div className="space-y-3 p-3 border-2 border-[#2D2D2D] rounded-lg bg-gray-50/50">
          <Label className="text-[10px] uppercase font-black tracking-widest text-[#2D2D2D] opacity-80 px-1">Traffic Roles</Label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isTrafficStart" 
                checked={!!node.data.isTrafficStart}
                onCheckedChange={(val) => updateNodeData(node.id, { isTrafficStart: !!val })}
                className="border-2 border-[#2D2D2D] data-[state=checked]:bg-[#F38020] data-[state=checked]:border-[#F38020]"
              />
              <label htmlFor="isTrafficStart" className="text-sm font-bold flex items-center gap-2 cursor-pointer">
                <PlayCircle className="w-4 h-4 text-blue-500" /> Traffic Start
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isTrafficEnd" 
                checked={!!node.data.isTrafficEnd}
                onCheckedChange={(val) => updateNodeData(node.id, { isTrafficEnd: !!val })}
                className="border-2 border-[#2D2D2D] data-[state=checked]:bg-[#F38020] data-[state=checked]:border-[#F38020]"
              />
              <label htmlFor="isTrafficEnd" className="text-sm font-bold flex items-center gap-2 cursor-pointer">
                <Flag className="w-4 h-4 text-red-500" /> Traffic End
              </label>
            </div>
          </div>
        </div>
        <div className="space-y-2.5">
          <Label className="text-[10px] uppercase font-black tracking-widest text-[#2D2D2D] opacity-80 px-1">Visual Icon</Label>
          <div className="grid grid-cols-4 gap-2">
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => updateNodeData(node.id, { iconType: opt.type })}
                className={cn(
                  "p-2.5 rounded-lg border-2 transition-all flex items-center justify-center h-12 hover:scale-105 active:scale-95",
                  node.data.iconType === opt.type
                    ? "border-[#F38020] bg-orange-50 text-[#F38020] shadow-inner"
                    : "border-[#2D2D2D]/10 bg-gray-50 text-muted-foreground hover:border-[#2D2D2D]"
                )}
                title={opt.type}
              >
                <opt.icon size={20} strokeWidth={2.5} />
              </button>
            ))}
          </div>
        </div>
        <div className="pt-6 border-t border-[#2D2D2D]/10 flex gap-2">
          <Button
            variant="destructive"
            className="w-full gap-2 h-10 rounded-md font-black shadow-[4px_4px_0px_#7f1d1d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            onClick={() => deleteNode(node.id)}
          >
            <Trash2 className="w-4 h-4" /> DELETE COMPONENT
          </Button>
        </div>
      </div>
    </div>
  );
}