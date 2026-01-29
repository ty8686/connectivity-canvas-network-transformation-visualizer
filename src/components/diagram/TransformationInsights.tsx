import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, Zap, TrendingDown } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
export function TransformationInsights() {
  const mode = useEditorStore(s => s.mode);
  const latencyDelta = useEditorStore(s => s.latencyDelta);
  const hopsDelta = useEditorStore(s => s.hopsDelta);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-md font-bold shadow-sm h-10 border-border bg-white">
          <Info className="w-4 h-4 text-[#F38020]" />
          {mode === 'future' ? 'Performance Benefits' : 'Transformation ROI'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl font-sans rounded-xl p-0 border-none shadow-2xl overflow-hidden">
        <div className="p-8 space-y-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Zap className="text-[#F38020] w-8 h-8" /> Architectural Transformation
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Legacy Architecture</h4>
              <div className="p-5 rounded-lg border border-border bg-secondary/30">
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Avg Latency</span>
                    <span className="font-bold text-red-500">240ms</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Hops to Origin</span>
                    <span className="font-bold text-red-500">8-12</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Security</span>
                    <span className="font-bold">Hardware</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#F38020]">Cloudflare Edge</h4>
              <div className="p-5 rounded-lg border border-orange-100 bg-orange-50/50">
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Avg Latency</span>
                    <span className="font-bold text-green-600">12ms</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Hops to Origin</span>
                    <span className="font-bold text-green-600">1 (Edge)</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Security</span>
                    <span className="font-bold text-[#F38020]">Global Cloud</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" /> Efficiency Gains
            </h4>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-blue-600">{latencyDelta}%</div>
                <div className="text-[10px] uppercase font-bold text-blue-900/60 mt-1">Latency Drop</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-blue-600">{hopsDelta}x</div>
                <div className="text-[10px] uppercase font-bold text-blue-900/60 mt-1">Fewer Hops</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-blue-600">0</div>
                <div className="text-[10px] uppercase font-bold text-blue-900/60 mt-1">Capex Items</div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <DialogClose asChild>
              <Button className="bg-[#F38020] hover:bg-[#D14615] text-white font-bold h-12 px-10 rounded-md">
                Acknowledge Transformation
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}