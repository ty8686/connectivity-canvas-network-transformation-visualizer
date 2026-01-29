import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, ArrowRight, MousePointer2, Sparkles, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import '@/styles/illustrative.css';
export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ThemeToggle />
      <div className="py-12 md:py-20 lg:py-32 flex flex-col items-center text-center">
        {/* Hero Sketch */}
        <div className="relative mb-12 animate-in fade-in zoom-in duration-700">
          <div className="absolute -top-12 -left-12 w-24 h-24 text-blue-400 opacity-40 floating">
            <Cloud size={96} strokeWidth={1} />
          </div>
          <div className="absolute -bottom-8 -right-12 w-20 h-20 text-orange-400 opacity-40 rotating">
            <Sparkles size={80} strokeWidth={1} />
          </div>
          <div className="w-32 h-32 md:w-48 md:h-48 bg-orange-50 sketchy-border flex items-center justify-center relative shadow-xl">
            <Cloud className="w-20 h-20 md:w-32 md:h-32 text-[#F48120]" strokeWidth={1.5} />
            <div className="absolute -bottom-4 -right-4 bg-white p-2 sketchy-border shadow-md">
              <MousePointer2 className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="space-y-6 max-w-3xl">
          <h1 className="font-illustrative text-5xl md:text-7xl lg:text-8xl text-foreground">
            Connectivity <span className="text-[#F48120]">Canvas</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-sans">
            Visualize your network transformation. Drag, drop, and collapse legacy complexity into the Cloudflare connectivity cloud.
          </p>
        </div>
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link to="/dashboard">
            <Button size="lg" className="h-14 px-8 text-lg bg-[#F48120] hover:bg-[#D14615] text-white gap-3 rounded-none sketchy-border border-none shadow-lg hover:translate-y-[-2px] transition-transform">
              Explore Dashboard <LayoutDashboard size={20} />
            </Button>
          </Link>
          <Link to="/editor">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-none sketchy-border gap-3 hover:bg-gray-50">
              New Visualization <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
        {/* Features Section */}
        <div className="mt-24 py-8 md:py-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {[
            { label: 'Cloud-Native', desc: 'Map legacy appliances to global edge services in seconds.' },
            { label: 'Real-time Simulation', desc: 'Watch animated packets traverse your architecture with live latency stats.' },
            { label: 'Durable Canvas', desc: 'Save and share complex transformation roadmaps with your team.' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 sketchy-card bg-white hover:border-[#F48120] transition-colors group">
              <h3 className="font-illustrative text-2xl mb-2 group-hover:text-[#F48120] transition-colors">{item.label}</h3>
              <p className="text-muted-foreground text-sm font-sans leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}