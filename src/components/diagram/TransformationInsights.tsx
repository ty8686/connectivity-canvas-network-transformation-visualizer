import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, Zap, Shield, Globe, TrendingDown, CheckCircle2 } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { cn } from '@/lib/utils';
export function TransformationInsights() {
  const mode = useEditorStore(s => s.mode);
  const comparisonStats = useEditorStore(s => s.comparisonStats);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 sketchy-border">
          <Info className="w-4 h-4" /> {mode === 'future' ? 'View Benefits' : 'Transformation ROI'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl font-sans rounded-none sketchy-card p-0 border-none">
        <div className="p-8 space-y-8">
          <DialogHeader>
            <DialogTitle className="font-illustrative text-3xl flex items-center gap-3">
              <Zap className="text-[#F48120] w-8 h-8" /> Architectural Transformation
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Legacy Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                Legacy Stack
              </h4>
              <div className="p-4 bg-gray-50 sketchy-border border-gray-200">
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Average Latency</span>
                    <span className="font-bold text-red-500">240ms</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Network Hops</span>
                    <span className="font-bold text-red-500">8-12</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Security Layer</span>
                    <span className="font-bold">Hardware-Bound</span>
                  </li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Complexity increases with every new appliance added. High OPEX and maintenance overhead.
              </p>
            </div>
            {/* Cloudflare Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-[#F48120] flex items-center gap-2">
                Cloudflare Cloud
              </h4>
              <div className="p-4 bg-orange-50 sketchy-border border-[#F48120]/30">
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Average Latency</span>
                    <span className="font-bold text-green-600">12ms</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Network Hops</span>
                    <span className="font-bold text-green-600">1 (Edge)</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Security Layer</span>
                    <span className="font-bold text-[#F48120]">Software-Defined</span>
                  </li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground italic">
                Collapsed architecture reduces attack surface and eliminates hair-pinning.
              </p>
            </div>
          </div>
          <div className="bg-blue-50/50 p-6 sketchy-border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" /> Key Efficiency Gains
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">95%</div>
                <div className="text-[10px] uppercase font-bold text-blue-900/60">Latency Drop</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">8x</div>
                <div className="text-[10px] uppercase font-bold text-blue-900/60">Fewer Hops</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-[10px] uppercase font-bold text-blue-900/60">Appliance Costs</div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button className="bg-[#F48120] hover:bg-[#D14615] text-white rounded-none h-12 px-8" asChild>
              <DialogTrigger>Got it, Transform!</DialogTrigger>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}