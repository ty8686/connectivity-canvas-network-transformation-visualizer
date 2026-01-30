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
import { Info, Zap, TrendingDown, Target, Sparkles } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { cn } from '@/lib/utils';
export function TransformationInsights() {
  const mode = useEditorStore(s => s.mode);
  const latency = useEditorStore(s => s.latency);
  const hops = useEditorStore(s => s.hops);
  const latencyDelta = useEditorStore(s => s.latencyDelta);
  const hopsDelta = useEditorStore(s => s.hopsDelta);
  const isOptimal = mode === 'future';
  const architectureLabel = mode === 'legacy' ? 'Infrastructure: Legacy Hardware' : 'Infrastructure: Cloudflare Edge';
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-md font-bold shadow-lg h-10 bg-[#F38020] hover:bg-[#D14615] text-white border-none transition-all active:scale-95 group">
          <Info className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          {isOptimal ? 'Transformation ROI' : 'Explore Benefits'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl font-sans rounded-xl p-0 border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 space-y-8 bg-white text-[#2D2D2D]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-[#2D2D2D]">
              <Zap className="text-[#F38020] w-8 h-8" />
              Infrastructure ROI Analysis
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm pt-2 font-medium">
              Real-time comparison between your current architecture and the Cloudflare Connectivity Cloud. Canvas packet speeds are calibrated to represent these latency values.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">{architectureLabel}</h4>
              <div className="p-5 rounded-lg border-2 border-slate-100 bg-slate-50/50 shadow-sm">
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="font-bold text-[#2D2D2D]">Avg. Latency</span>
                    <span className={cn("font-black", mode === 'legacy' ? 'text-rose-500' : 'text-emerald-600')}>
                      {Math.round(latency)}ms
                    </span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="font-bold text-[#2D2D2D]">Total Hops</span>
                    <span className="font-black text-[#2D2D2D]">
                      {hops} Step{hops !== 1 ? 's' : ''}
                    </span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="font-extrabold text-[#2D2D2D]">Management</span>
                    <span className="font-black text-[#2D2D2D] uppercase text-[10px] tracking-tight">{mode === 'legacy' ? 'Hardware-Bound' : 'Cloud Native'}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#F38020] px-1">Cloudflare Connectivity Cloud</h4>
              <div className={cn(
                "p-5 rounded-lg border-2 transition-all shadow-sm",
                isOptimal ? "border-[#F38020] bg-orange-50/50" : "border-slate-100 bg-slate-50/50"
              )}>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="font-bold text-[#2D2D2D] flex items-center gap-1.5">
                      Edge Latency {isOptimal && <Target className="w-3 h-3 text-[#F38020]" />}
                    </span>
                    <span className="font-black text-emerald-600">~12ms</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="font-bold text-[#2D2D2D]">Network Hops</span>
                    <span className="font-black text-emerald-600">1 (Edge Unified)</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="font-extrabold text-[#2D2D2D]">Security</span>
                    <span className="font-black text-[#F38020] uppercase text-[10px] tracking-tight">Edge-Native ZT</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-orange-50/80 border-2 border-orange-100 p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <Sparkles className="w-12 h-12 text-[#F38020]" />
            </div>
            <h4 className="font-black text-[11px] uppercase tracking-tighter text-[#D14615] mb-4 flex items-center gap-2 relative z-10">
              <TrendingDown className="w-4 h-4" /> Transformation Efficiency
            </h4>
            <div className="grid grid-cols-3 gap-6 relative z-10">
              <div className="text-center">
                <div className="text-4xl font-black text-[#F38020] tracking-tighter">
                  {latencyDelta > 0 ? `+${latencyDelta}` : latencyDelta}%
                </div>
                <div className="text-[9px] uppercase font-black text-[#D14615]/70 mt-1">Reduced Latency</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-[#F38020] tracking-tighter">{hopsDelta}x</div>
                <div className="text-[9px] uppercase font-black text-[#D14615]/70 mt-1">Faster Paths</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-[#F38020] tracking-tighter">0</div>
                <div className="text-[9px] uppercase font-black text-[#D14615]/70 mt-1">Silos Remaining</div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 gap-4">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest max-w-[320px] italic leading-tight">
              * Delta metrics are calculated against a standardized 240ms legacy hardware baseline. Canvas flow speed is scaled 1:1 with these latency values.
            </p>
            <DialogClose asChild>
              <Button className="bg-[#F38020] hover:bg-[#D14615] text-white font-black h-12 px-10 rounded-md shadow-lg transition-all active:scale-95 shrink-0">
                Close Report
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}