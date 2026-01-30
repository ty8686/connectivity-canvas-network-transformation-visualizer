import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
        <Button variant="outline" className="gap-2 rounded-md font-bold shadow-sm h-10 border-border bg-white hover:bg-orange-50 hover:border-orange-200 transition-all text-[#F38020]">
          <Info className="w-4 h-4 text-[#F38020]" />
          {mode === 'future' ? 'Transformation ROI' : 'Explore Benefits'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl font-sans rounded-xl p-0 border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 space-y-8 bg-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Zap className="text-[#F38020] w-8 h-8" />
              Connectivity Transformation
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm pt-2">
              Analysis of performance improvements when transitioning from legacy hardware to Cloudflare edge nodes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 group">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Legacy Stack</h4>
              <div className="p-5 rounded-lg border border-border bg-secondary/30 group-hover:bg-secondary/50 transition-colors">
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Avg Latency</span>
                    <span className="font-bold text-red-500">240ms</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Network Hops</span>
                    <span className="font-bold text-red-500">8+ Steps</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Security</span>
                    <span className="font-bold">Hardware</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="space-y-4 group">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#F38020] px-1">Cloudflare Edge</h4>
              <div className="p-5 rounded-lg border border-orange-100 bg-orange-50/50 group-hover:bg-orange-50 transition-colors">
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Edge Latency</span>
                    <span className="font-bold text-green-600">~12ms</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Traversal Hops</span>
                    <span className="font-bold text-green-600">1 (Direct)</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">Security</span>
                    <span className="font-bold text-[#F38020]">Global Cloud</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl relative overflow-hidden">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2 relative z-10">
              <TrendingDown className="w-5 h-5" /> Infrastructure Optimization
            </h4>
            <div className="grid grid-cols-3 gap-6 relative z-10">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-blue-600">{latencyDelta}%</div>
                <div className="text-[10px] uppercase font-bold text-blue-900/60 mt-1">Latency Drop</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-blue-600">{hopsDelta}x</div>
                <div className="text-[10px] uppercase font-bold text-blue-900/60 mt-1">Path Speedup</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-blue-600">0</div>
                <div className="text-[10px] uppercase font-bold text-blue-900/60 mt-1">Hardware Required</div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <TrendingDown size={80} />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <DialogClose asChild>
              <Button className="bg-[#F38020] hover:bg-[#D14615] text-white font-bold h-12 px-10 rounded-md shadow-lg hover:shadow-orange-200 transition-all">
                Close Analysis
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}