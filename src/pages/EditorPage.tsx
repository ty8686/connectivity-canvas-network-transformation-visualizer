import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Zap, Layers, Save, Play, FastForward, Rewind, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlowCanvas } from '@/components/diagram/FlowCanvas';
import { ComponentToolbox } from '@/components/diagram/ComponentToolbox';
import { NodeInspector } from '@/components/diagram/NodeInspector';
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
        <Tabs
          value={mode}
          onValueChange={(val) => setMode(val as 'legacy' | 'future')}
          className="w-[320px]"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-lg h-10 p-1">
            <TabsTrigger value="legacy" className="flex items-center gap-2 text-xs font-bold">
              Legacy
            </TabsTrigger>
            <TabsTrigger value="future" className="flex items-center gap-2 text-xs font-bold data-[state=active]:text-[#F38020]">
              <Zap className="w-3 h-3" /> Cloudflare
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
          <ComponentToolbox />
          {selectedNodeId && <NodeInspector />}
          <div className="absolute inset-0 z-10">
            <FlowCanvas />
          </div>
        </ReactFlowProvider>
        {/* Real-time stats HUD */}
        <div className="absolute bottom-8 right-8 w-60 p-5 rounded-xl border border-border z-20 bg-white/95 shadow-xl pointer-events-none md:pointer-events-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Live Edge Telemetry</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold">Latency (ms)</span>
                <span className={cn("text-lg font-black tracking-tighter", mode === 'legacy' ? "text-red-500" : "text-green-600")}>
                  {mode === 'legacy' ? '240' : '12'}
                </span>
              </div>
              <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                 <div
                   className={cn("h-full transition-all duration-1000", mode === 'legacy' ? "bg-red-500 w-[85%]" : "bg-green-500 w-[5%]")}
                 />
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Hops</span>
              <span className="text-xs font-black">{mode === 'legacy' ? '12 Hops' : '1 (Direct)'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}