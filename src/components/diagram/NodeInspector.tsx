import React from 'react';
import { useEditorStore } from '@/store/editor-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Server, Database, Users, Layers, Cloud, HardDrive, Trash2, X } from 'lucide-react';
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
  const nodes = useEditorStore(s => s.nodes);
  const updateNodeData = useEditorStore(s => s.updateNodeData);
  const deleteNode = useEditorStore(s => s.deleteNode);
  const setSelectedNodeId = useEditorStore(s => s.setSelectedNodeId);
  const node = nodes.find(n => n.id === selectedId);
  if (!node) return null;
  return (
    <div className="absolute top-24 right-8 z-20 w-80 bg-white border border-border p-6 shadow-2xl rounded-xl animate-in fade-in slide-in-from-right-6 duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Inspector</h3>
          <p className="text-[10px] text-muted-foreground font-mono uppercase">ID: {node.id.slice(0, 8)}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedNodeId(null)} className="h-8 w-8 rounded-full hover:bg-secondary">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-6">
        <div className="space-y-2.5">
          <Label htmlFor="node-label" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground px-1">Display Label</Label>
          <Input
            id="node-label"
            value={node.data.label as string}
            onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
            className="rounded-md border-border h-10 focus-visible:ring-[#F38020] transition-shadow"
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground px-1">Visual Icon</Label>
          <div className="grid grid-cols-4 gap-2">
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => updateNodeData(node.id, { iconType: opt.type })}
                className={cn(
                  "p-2.5 rounded-lg border-2 transition-all flex items-center justify-center h-12 hover:scale-105 active:scale-95",
                  node.data.iconType === opt.type 
                    ? "border-[#F38020] bg-orange-50 text-[#F38020] shadow-sm" 
                    : "border-secondary bg-secondary/50 text-muted-foreground"
                )}
                title={opt.type}
              >
                <opt.icon size={20} strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>
        <div className="pt-6 border-t border-border flex gap-2">
          <Button
            variant="destructive"
            className="w-full gap-2 h-10 rounded-md font-bold shadow-sm"
            onClick={() => deleteNode(node.id)}
          >
            <Trash2 className="w-4 h-4" /> Delete Component
          </Button>
        </div>
      </div>
    </div>
  );
}