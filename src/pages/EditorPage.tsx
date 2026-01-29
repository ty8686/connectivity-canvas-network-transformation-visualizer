import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Layers, Save, Play, FastForward, Rewind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlowCanvas } from '@/components/diagram/FlowCanvas';
import { ComponentToolbox } from '@/components/diagram/ComponentToolbox';
import { useEditorStore } from '@/store/editor-store';
import { ReactFlowProvider } from '@xyflow/react';
import { toast } from 'sonner';
import '@/styles/illustrative.css';
export default function EditorPage() {
  const mode = useEditorStore(s => s.mode);
  const setMode = useEditorStore(s => s.setMode);
  const simulationSpeed = useEditorStore(s => s.simulationSpeed);
  const setSimulationSpeed = useEditorStore(s => s.setSimulationSpeed);
  const saveProject = useEditorStore(s => s.saveProject);
  const isLoading = useEditorStore(s => s.isLoading);
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
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h1 className="font-illustrative text-xl leading-none">Network Canvas</h1>
            <span className="text-2xs text-muted-foreground uppercase tracking-widest font-bold">Persistence & Simulation</span>
          </div>
        </div>
        <Tabs
          value={mode}
          onValueChange={(val) => setMode(val as 'legacy' | 'future')}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="legacy" className="flex items-center gap-2">
              <Layers className="w-4 h-4" /> Current State
            </TabsTrigger>
            <TabsTrigger value="future" className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F48120]" /> Cloudflare Future
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-full p-1 gap-1">
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
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="bg-[#F48120] hover:bg-[#D14615] text-white gap-2 sketchy-border border-none h-10 px-6"
          >
            <Save className="w-4 h-4" /> {isLoading ? "Saving..." : "Save Canvas"}
          </Button>
        </div>
      </header>
      <main className="flex-1 relative">
        <ReactFlowProvider>
          <ComponentToolbox />
          <div className="absolute inset-0 z-10">
            <FlowCanvas />
          </div>
        </ReactFlowProvider>
        {/* Floating Metrics Overlay */}
        <div className="absolute bottom-6 right-6 w-72 p-5 sketchy-card z-20 bg-white/95 shadow-xl">
          <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Simulation Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Network Latency</span>
              <span className={cn("text-lg font-bold", mode === 'legacy' ? "text-red-500" : "text-green-600")}>
                {mode === 'legacy' ? '240ms' : '12ms'}
              </span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
               <div 
                 className={cn("h-full transition-all duration-1000", mode === 'legacy' ? "bg-red-500 w-[80%]" : "bg-green-500 w-[5%]")} 
               />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Architectural Hops</span>
              <span className="font-bold">{mode === 'legacy' ? '8 Hops' : '1 Hop (Edge)'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
// Utility to fix cn missing import in EditorPage
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}