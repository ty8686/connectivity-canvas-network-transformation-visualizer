import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Zap, Layers, Save, Play, FastForward, Rewind, Info } from 'lucide-react';
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
      toast.success("Project saved successfully!");
    } catch (err) {
      toast.error("Failed to save project.");
    }
  };
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden font-sans">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-white z-30">
        <div className="flex items-center gap-4 flex-1">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <input 
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="font-illustrative text-xl leading-none bg-transparent border-none focus:ring-0 p-0 hover:bg-gray-50 rounded px-1 transition-colors w-64"
              placeholder="Project Name..."
            />
            <span className="text-2xs text-muted-foreground uppercase tracking-widest font-bold">Network Visualizer</span>
          </div>
        </div>
        <Tabs
          value={mode}
          onValueChange={(val) => setMode(val as 'legacy' | 'future')}
          className="w-[320px] md:w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="legacy" className="flex items-center gap-2">
              <Layers className="w-4 h-4" /> Legacy
            </TabsTrigger>
            <TabsTrigger value="future" className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F48120]" /> Future
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full p-1 gap-1">
             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setSimulationSpeed(0.5)}>
               <Rewind className={cn("w-4 h-4", simulationSpeed === 0.5 && "text-[#F48120]")} />
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setSimulationSpeed(1.0)}>
               <Play className={cn("w-4 h-4", simulationSpeed === 1.0 && "text-[#F48120]")} />
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setSimulationSpeed(2.0)}>
               <FastForward className={cn("w-4 h-4", simulationSpeed === 2.0 && "text-[#F48120]")} />
             </Button>
          </div>
          <TransformationInsights />
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-[#F48120] hover:bg-[#D14615] text-white gap-2 h-10 px-4 sketchy-border border-none"
          >
            <Save className="w-4 h-4" /> {isLoading ? "..." : "Save"}
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
        <div className="absolute bottom-6 right-6 w-64 p-4 sketchy-card z-20 bg-white/95 shadow-lg pointer-events-none md:pointer-events-auto">
          <h3 className="text-[10px] font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Stats
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">Latency</span>
              <span className={cn("text-base font-bold", mode === 'legacy' ? "text-red-500" : "text-green-600")}>
                {mode === 'legacy' ? '240ms' : '12ms'}
              </span>
            </div>
            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
               <div
                 className={cn("h-full transition-all duration-1000", mode === 'legacy' ? "bg-red-500 w-[85%]" : "bg-green-500 w-[5%]")}
               />
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-muted-foreground">Architectural Hops</span>
              <span className="font-bold">{mode === 'legacy' ? '8 Hops' : '1 Hop'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}