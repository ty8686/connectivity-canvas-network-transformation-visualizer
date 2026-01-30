import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, Home, Save, Play, Pause, Zap, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowCanvas } from '@/components/diagram/FlowCanvas';
import { ComponentToolbox } from '@/components/diagram/ComponentToolbox';
import { NodeInspector } from '@/components/diagram/NodeInspector';
import { EdgeInspector } from '@/components/diagram/EdgeInspector';
import { TransformationInsights } from '@/components/diagram/TransformationInsights';
import { useEditorStore } from '@/store/editor-store';
import { ReactFlowProvider } from '@xyflow/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import '@/styles/illustrative.css';
export default function EditorPage() {
  const [searchParams] = useSearchParams();
  const projectIdParam = searchParams.get('id');
  const mode = useEditorStore(s => s.mode);
  const setMode = useEditorStore(s => s.setMode);
  const projectTitle = useEditorStore(s => s.projectTitle);
  const setProjectTitle = useEditorStore(s => s.setProjectTitle);
  const isAnimating = useEditorStore(s => s.isAnimating);
  const toggleAnimation = useEditorStore(s => s.toggleAnimation);
  const saveProject = useEditorStore(s => s.saveProject);
  const loadProject = useEditorStore(s => s.loadProject);
  const isLoading = useEditorStore(s => s.isLoading);
  const selectedNodeId = useEditorStore(s => s.selectedNodeId);
  const selectedEdgeId = useEditorStore(s => s.selectedEdgeId);
  const globalLatency = useEditorStore(s => s.latency);
  const globalHops = useEditorStore(s => s.hops);
  const nodes = useEditorStore(s => s.nodes);
  useEffect(() => {
    if (projectIdParam) {
      loadProject(projectIdParam);
    }
  }, [projectIdParam, loadProject]);
  const handleSave = async () => {
    if (nodes.length === 0) {
      toast.error("Cannot save an empty canvas");
      return;
    }
    try {
      await saveProject();
      toast.success("Architecture design saved");
    } catch (err) {
      toast.error("Failed to sync project state");
    }
  };
  const displayLatency = nodes.length > 0 && globalLatency > 0 ? `${Math.round(globalLatency)}ms` : "--";
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden font-sans">
      <header className="h-16 border-b border-[#2D2D2D]/10 flex items-center justify-between px-6 bg-white z-30 shadow-sm gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-2 text-muted-foreground shrink-0">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="font-black text-xs uppercase tracking-widest text-[#2D2D2D] bg-transparent border-none focus:ring-0 p-0 hover:bg-slate-100 rounded px-2 py-1 transition-colors w-32 md:w-56 overflow-hidden text-ellipsis whitespace-nowrap italic"
              placeholder="Design Title..."
            />
          </div>
          <div className="hidden sm:flex items-center bg-slate-50 border-2 border-slate-100 rounded-lg px-3 py-1 gap-4">
            <div className="flex flex-col">
              <span className="text-[7px] font-black uppercase text-muted-foreground leading-none">Latency Baseline</span>
              <span className={cn("text-xs font-black tracking-tight", mode === 'future' ? "text-green-600" : "text-[#2D2D2D]")}>
                {displayLatency}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex flex-col">
              <span className="text-[7px] font-black uppercase text-muted-foreground leading-none">Total Hops</span>
              <span className="text-xs font-black text-[#2D2D2D]">{globalHops || "--"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center bg-slate-100 p-1 rounded-full border-2 border-slate-200 w-[240px] md:w-[320px] relative shadow-inner shrink-0">
          <button
            onClick={() => setMode('legacy')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 z-10",
              mode === 'legacy' ? "bg-white text-[#2D2D2D] shadow-md border border-slate-200" : "text-slate-400 hover:text-slate-600"
            )}
          >
            Infrastructure
          </button>
          <button
            onClick={() => setMode('future')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 z-10",
              mode === 'future'
                ? "bg-[#F38020] text-white shadow-[0_0_15px_rgba(243,128,32,0.3)]"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Zap className={cn("w-3 h-3", mode === 'future' ? "fill-current" : "")} /> Cloudflare
          </button>
        </div>
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAnimation}
            className={cn(
              "rounded-full font-black text-[9px] uppercase gap-2 border-2 px-4 transition-all h-9 active:scale-95",
              isAnimating ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm" : "bg-slate-50 text-slate-500 border-slate-200"
            )}
          >
            {isAnimating ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            {isAnimating ? "Active Flow" : "Flow Paused"}
          </Button>
          <TransformationInsights />
        </div>
      </header>
      <main className="flex-1 relative">
        <ReactFlowProvider>
          <div className="absolute inset-0 z-10">
            <FlowCanvas />
          </div>
          <ComponentToolbox />
          {selectedNodeId && <NodeInspector />}
          {selectedEdgeId && <EdgeInspector />}
          <Button
            onClick={handleSave}
            disabled={isLoading || nodes.length === 0}
            className="fixed bottom-8 right-8 z-40 bg-[#F38020] hover:bg-[#D14615] text-white font-black h-14 px-10 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border-4 border-white"
          >
            <Save className={cn("w-5 h-5 mr-3", isLoading && "animate-spin")} />
            <span>{isLoading ? "SAVING WORK..." : "SYNC TO CLOUD"}</span>
          </Button>
        </ReactFlowProvider>
      </main>
    </div>
  );
}