import React, { useMemo } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useShallow } from 'zustand/react/shallow';
import { Trash2, X, Zap } from 'lucide-react';
export function EdgeInspector() {
  const selectedId = useEditorStore(s => s.selectedEdgeId);
  const edges = useEditorStore(useShallow(s => s.edges));
  const updateEdgeData = useEditorStore(s => s.updateEdgeData);
  const deleteEdge = useEditorStore(s => s.deleteEdge);
  const setSelectedEdgeId = useEditorStore(s => s.setSelectedEdgeId);
  const edge = useMemo(() => edges.find(e => e.id === selectedId), [edges, selectedId]);
  if (!edge) return null;
  const weight = typeof edge.data?.weight === 'number' ? edge.data.weight : 1;
  const edgeLabel = String(edge.data?.label || "");
  return (
    <div className="absolute top-24 right-8 z-20 w-80 bg-white border-2 border-[#2D2D2D] p-6 shadow-[8px_8px_0px_#2D2D2D] rounded-xl animate-in fade-in slide-in-from-right-6 duration-300 font-sans text-[#2D2D2D]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-black tracking-tight text-[#2D2D2D] uppercase italic">Edge Link</h3>
          <p className="text-[10px] text-[#2D2D2D] opacity-60 font-mono font-bold">LNK: {edge.id.slice(0, 12)}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedEdgeId(null)} className="h-8 w-8 rounded-full hover:bg-secondary">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-6">
        <div className="space-y-2.5">
          <Label htmlFor="edge-label" className="text-[10px] uppercase font-black tracking-widest text-[#2D2D2D] opacity-80 px-1">Link Descriptor</Label>
          <Input
            id="edge-label"
            value={edgeLabel}
            onChange={(e) => updateEdgeData(edge.id, { label: e.target.value })}
            className="rounded-md border-2 border-[#2D2D2D] h-10 focus-visible:ring-[#F38020] transition-shadow bg-secondary/20 text-[#2D2D2D] font-bold"
            placeholder="e.g. MPLS Trunk"
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <Label className="text-[10px] uppercase font-black tracking-widest text-[#2D2D2D] opacity-80">Latency Weight</Label>
            <span className="text-xs font-black text-[#F38020]">{weight * 15}ms Added</span>
          </div>
          <Slider
            value={[weight]}
            onValueChange={([val]) => updateEdgeData(edge.id, { weight: val })}
            min={1}
            max={5}
            step={1}
            className="py-4"
          />
          <div className="flex justify-between text-[9px] font-black text-[#2D2D2D] opacity-50 uppercase px-1">
            <span>Direct</span>
            <span>Congested</span>
          </div>
        </div>
        <div className="pt-6 border-t border-[#2D2D2D]/10 flex flex-col gap-3">
          <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200 flex items-start gap-3">
            <Zap className="w-5 h-5 text-[#F38020] mt-0.5 shrink-0" />
            <p className="text-[11px] leading-tight text-[#2D2D2D] font-bold italic">
              Legacy backhaul links are eliminated in Cloudflare mode, collapsing multiple hops into a single high-speed edge entry.
            </p>
          </div>
          <Button
            variant="destructive"
            className="w-full gap-2 h-10 rounded-md font-black shadow-[4px_4px_0px_#7f1d1d] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            onClick={() => deleteEdge(edge.id)}
          >
            <Trash2 className="w-4 h-4" /> REMOVE LINK
          </Button>
        </div>
      </div>
    </div>
  );
}