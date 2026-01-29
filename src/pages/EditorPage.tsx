import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlowCanvas } from '@/components/diagram/FlowCanvas';
import { useEditorStore } from '@/store/editor-store';
import '@/styles/illustrative.css';
export default function EditorPage() {
  const mode = useEditorStore(s => s.mode);
  const setMode = useEditorStore(s => s.setMode);
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-white z-10">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h1 className="font-illustrative text-xl leading-none">Network Canvas</h1>
            <span className="text-2xs text-muted-foreground uppercase tracking-widest font-bold">Connectivity Transformation</span>
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="sketchy-border">Export Diagram</Button>
          <Button size="sm" className="bg-[#F48120] hover:bg-[#D14615] text-white">Save Project</Button>
        </div>
      </header>
      {/* Main Area */}
      <main className="flex-1 relative">
        <div className="absolute inset-0">
          <FlowCanvas />
        </div>
        {/* Floating Metrics Overlay */}
        <div className="absolute bottom-6 right-6 w-64 p-4 sketchy-card z-20 pointer-events-none">
          <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Network Health</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Estimated Latency</span>
              <span className={mode === 'legacy' ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
                {mode === 'legacy' ? '240ms' : '12ms'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Complexity</span>
              <span className="text-sm">{mode === 'legacy' ? 'High (8 Hops)' : 'Minimal (Edge)'}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}