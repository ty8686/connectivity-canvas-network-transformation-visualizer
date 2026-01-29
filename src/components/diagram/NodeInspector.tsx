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
    <div className="absolute top-24 right-6 z-20 w-72 sketchy-card bg-white p-5 shadow-xl animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-illustrative text-lg">Component Details</h3>
        <Button variant="ghost" size="icon" onClick={() => setSelectedNodeId(null)} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="node-label" className="text-xs uppercase font-bold text-muted-foreground">Label</Label>
          <Input 
            id="node-label"
            value={node.data.label as string}
            onChange={(e) => updateNodeData(node.id, { label: e.target.value })}
            className="sketchy-border rounded-none"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase font-bold text-muted-foreground">Service Type</Label>
          <div className="grid grid-cols-4 gap-2">
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => updateNodeData(node.id, { iconType: opt.type })}
                className={cn(
                  "p-2 rounded-md border-2 transition-all flex items-center justify-center hover:bg-gray-50",
                  node.data.iconType === opt.type ? "border-[#F48120] bg-orange-50" : "border-transparent bg-gray-50/50"
                )}
              >
                <opt.icon className={cn("w-5 h-5", node.data.iconType === opt.type ? "text-[#F48120]" : "text-gray-400")} />
              </button>
            ))}
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100 flex gap-2">
          <Button 
            variant="destructive" 
            className="w-full sketchy-border border-none gap-2 h-9"
            onClick={() => deleteNode(node.id)}
          >
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
}