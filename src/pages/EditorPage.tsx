import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, Home, Save, Rewind, Play, FastForward, Zap, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowCanvas } from '@/components/diagram/FlowCanvas';
import { ComponentToolbox } from '@/components/diagram/ComponentToolbox';
import { NodeInspector } from '@/components/diagram/NodeInspector';
import { EdgeInspector } from '@/components/diagram/EdgeInspector';
import { TransformationInsights } from '@/components/diagram/TransformationInsights';
import { useEditorStore } from '@/store/editor-store';
import { useShallow } from 'zustand/react/shallow';
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
  const simulationSpeed = useEditorStore(s => s.simulationSpeed);
  const setSimulationSpeed = useEditorStore(s => s.setSimulationSpeed);
  const saveProject = useEditorStore(s => s.saveProject);
  const loadProject = useEditorStore(s => s.loadProject);
  const isLoading = useEditorStore(s => s.isLoading);
  const selectedNodeId = useEditorStore(s => s.selectedNodeId);
  const selectedEdgeId = useEditorStore(s => s.selectedEdgeId);
  const globalLatency = useEditorStore(s => s.latency);
  const globalHops = useEditorStore(s => s.hops);
  const previewMetrics = useEditorStore(useShallow(s => s.previewMetrics));
  useEffect(() => {
    if (projectIdParam) {
      loadProject(projectIdParam);
    }
  }, [projectIdParam, loadProject]);
  const handleSave = async () => {
    try {
      await saveProject();
      toast.success("Design saved successfully");
    } catch (err) {
      toast.error("Failed to save work");
    }
  };
  const currentLatency = previewMetrics ? previewMetrics.latency : globalLatency;
  const currentHops = previewMetrics ? previewMetrics.hops : globalHops;
  const isPreviewMode = !!previewMetrics;
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden font-sans">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-white z-30 shadow-sm gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-2 text-muted-foreground shrink-0">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="font-bold text-sm tracking-tight text-[#2D2D2D] bg-transparent border-none focus:ring-0 p-0 hover:bg-secondary/50 rounded-md px-2 py-1 transition-colors w-32 md:w-48 overflow-hidden text-ellipsis whitespace-nowrap"
              placeholder="Unnamed Canvas..."
            />
          </div>
          <div className={cn(
            "hidden sm:flex items-center bg-gray-50 border rounded-lg px-3 py-1.5 gap-4 transition-all duration-300",
            isPreviewMode ? "border-[#F38020] bg-orange-50/30 scale-105 shadow-sm" : "border-border"
          )}>
            <div className="flex items-center gap-2">
              <Activity className={cn("w-3.5 h-3.5", mode === 'legacy' ? "text-muted-foreground" : "text-green-500", isPreviewMode && "animate-pulse")} />
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-[#2D2D2D] leading-none opacity-60">
                  {isPreviewMode ? "Path Latency" : "Avg Latency"}
                </span>
                <span className={cn(
                  "text-xs font-black tracking-tighter transition-colors",
                  mode === 'legacy' ? "text-[#2D2D2D]" : "text-green-600",
                  isPreviewMode && "text-[#F38020]"
                )}>
                  {Math.round(currentLatency)}ms
                </span>
              </div>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase text-[#2D2D2D] leading-none opacity-60">
                {isPreviewMode ? "Path Hops" : "Avg Hops"}
              </span>
              <span className={cn("text-xs font-black transition-colors text-[#2D2D2D]", isPreviewMode && "text-[#F38020]")}>
                {currentHops}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center bg-gray-100 p-1 rounded-full border border-border w-[240px] md:w-[300px] relative shadow-inner shrink-0">
          <button
            onClick={() => setMode('legacy')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 md:px-4 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 z-10",
              mode === 'legacy' ? "bg-white text-[#2D2D2D] shadow-sm" : "text-muted-foreground/60 hover:text-[#2D2D2D]"
            )}
          >
            Legacy
          </button>
          <button
            onClick={() => setMode('future')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-1.5 px-3 md:px-4 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 z-10",
              mode === 'future'
                ? "bg-[#F38020] text-white shadow-[0_0_15px_rgba(243,128,32,0.4)]"
                : "text-muted-foreground/60 hover:text-[#2D2D2D]"
            )}
          >
            <Zap className={cn("w-3 h-3", mode === 'future' ? "fill-current" : "")} /> Cloudflare
          </button>
        </div>
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
          <div className="hidden lg:flex items-center bg-secondary/50 rounded-md p-1 gap-1">
             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSimulationSpeed(0.5)}>
               <Rewind className={cn("w-3.5 h-3.5", simulationSpeed === 0.5 && "text-[#F38020]")} />
             </Button>
             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSimulationSpeed(1.0)}>
               <Play className={cn("w-3.5 h-3.5", simulationSpeed === 1.0 && "text-[#F38020]")} />
             </Button>
             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSimulationSpeed(2.0)}>
               <FastForward className={cn("w-3.5 h-3.5", simulationSpeed === 2.0 && "text-[#F38020]")} />
             </Button>
          </div>
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
            disabled={isLoading}
            className="fixed bottom-6 right-6 z-40 bg-[#F38020] hover:bg-[#D14615] text-white font-bold h-14 px-8 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 group"
          >
            <Save className={cn("w-5 h-5 mr-2", isLoading && "animate-spin")} /> 
            <span>{isLoading ? "Saving..." : "Save Canvas"}</span>
          </Button>
        </ReactFlowProvider>
      </main>
    </div>
  );
}