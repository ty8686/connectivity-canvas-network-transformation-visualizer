import React from 'react';
import { useEditorStore } from '@/store/editor-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Trash2, X, Zap } from 'lucide-react';
export function EdgeInspector() {
  const selectedId = useEditorStore(s => s.selectedEdgeId);
  const edges = useEditorStore(s => s.edges);
  const updateEdgeData = useEditorStore(s => s.updateEdgeData);
  const deleteEdge = useEditorStore(s => s.deleteEdge);
  const setSelectedEdgeId = useEditorStore(s => s.setSelectedEdgeId);
  const edge = edges.find(e => e.id === selectedId);
  if (!edge) {
    return null;
  }
  const weight = typeof edge.data?.weight === 'number' ? edge.data.weight : 1;
  const edgeLabel = (edge.data?.label as string) || "";
  return (
    <div className="absolute top-24 right-8 z-20 w-80 bg-white border border-border p-6 shadow-2xl rounded-xl animate-in fade-in slide-in-from-right-6 duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Edge Link</h3>
          <p className="text-[10px] text-muted-foreground font-mono uppercase">ID: {edge.id.slice(0, 8)}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedEdgeId(null)} className="h-8 w-8 rounded-full hover:bg-secondary">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-6">
        <div className="space-y-2.5">
          <Label htmlFor="edge-label" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground px-1">Link Label</Label>
          <Input
            id="edge-label"
            value={edgeLabel}
            onChange={(e) => updateEdgeData(edge.id, { label: e.target.value })}
            className="rounded-md border-border h-10 focus-visible:ring-[#F38020] transition-shadow"
            placeholder="e.g. MPLS, VPN, Fiber"
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Latency Weight</Label>
            <span className="text-xs font-bold text-[#F38020]">{weight * 15}ms Impact</span>
          </div>
          <Slider
            value={[weight]}
            onValueChange={([val]) => updateEdgeData(edge.id, { weight: val })}
            min={1}
            max={5}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase px-1">
            <span>Fast</span>
            <span>Congested</span>
          </div>
        </div>
        <div className="pt-6 border-t border-border flex flex-col gap-3">
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 flex items-start gap-2">
            <Zap className="w-4 h-4 text-[#F38020] mt-0.5 shrink-0" />
            <p className="text-[10px] leading-relaxed text-orange-900 font-medium">
              In Cloudflare mode, this legacy link will be optimized to near-zero edge latency.
            </p>
          </div>
          <Button
            variant="destructive"
            className="w-full gap-2 h-10 rounded-md font-bold shadow-sm"
            onClick={() => deleteEdge(edge.id)}
          >
            <Trash2 className="w-4 h-4" /> Remove Link
          </Button>
        </div>
      </div>
    </div>
  );
}