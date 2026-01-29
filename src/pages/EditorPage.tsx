import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, Home, Save, Rewind, Play, FastForward, Zap, ShieldAlert, Globe } from 'lucide-react';
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
  const simulationSpeed = useEditorStore(s => s.simulationSpeed);
  const setSimulationSpeed = useEditorStore(s => s.setSimulationSpeed);
  const saveProject = useEditorStore(s => s.saveProject);
  const loadProject = useEditorStore(s => s.loadProject);
  const isLoading = useEditorStore(s => s.isLoading);
  const selectedNodeId = useEditorStore(s => s.selectedNodeId);
  const selectedEdgeId = useEditorStore(s => s.selectedEdgeId);
  const latency = useEditorStore(s => s.latency);
  const hops = useEditorStore(s => s.hops);
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
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden font-sans">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-white z-30 shadow-sm">
        <div className="flex items-center gap-6 flex-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-3 h-3 opacity-30" />
            <input
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="font-bold text-sm tracking-tight text-foreground bg-transparent border-none focus:ring-0 p-0 hover:bg-secondary/50 rounded-md px-2 py-1 transition-colors w-48"
              placeholder="Unnamed Canvas..."
            />
          </div>
        </div>
        <div className="flex items-center bg-gray-100 p-1 rounded-full border border-border w-[280px] relative shadow-inner">
          <button
            onClick={() => setMode('legacy')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-1.5 px-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 z-10",
              mode === 'legacy' ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Legacy
          </button>
          <button
            onClick={() => setMode('future')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-1.5 px-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 z-10",
              mode === 'future'
                ? "bg-[#F38020] text-white shadow-[0_0_15px_rgba(243,128,32,0.4)]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Zap className={cn("w-3 h-3", mode === 'future' ? "fill-current" : "")} /> Cloudflare
          </button>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-end">
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
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#F38020] hover:bg-[#D14615] text-white font-bold h-10 px-6 rounded-md shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4 mr-2" /> {isLoading ? "..." : "Save"}
          </Button>
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
        </ReactFlowProvider>
        <div className="absolute bottom-8 right-8 w-72 p-6 rounded-2xl border border-border z-20 bg-white/95 shadow-2xl pointer-events-none md:pointer-events-auto backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", mode === 'legacy' ? "bg-red-500" : "bg-green-500")} />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Network Telemetry</span>
            </div>
            {mode === 'future' ? <Globe className="w-4 h-4 text-[#F38020]" /> : <ShieldAlert className="w-4 h-4 text-red-500" />}
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-xs font-bold uppercase tracking-tighter opacity-70 text-foreground">Global Latency</span>
                <span className={cn("text-2xl font-black tracking-tighter transition-colors duration-500", mode === 'legacy' ? "text-red-500" : "text-green-600")}>
                  {Math.round(latency)}<span className="text-xs font-medium ml-0.5">ms</span>
                </span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                 <div
                   className={cn("h-full transition-all duration-1000 ease-out", mode === 'legacy' ? "bg-red-500" : "bg-green-500")}
                   style={{ width: `${Math.min(100, (latency / 600) * 100)}%` }}
                 />
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Topology Hops</span>
              <span className="text-sm font-black text-foreground">{hops} {hops === 1 ? 'Hop' : 'Hops'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}