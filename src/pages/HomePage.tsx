import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, ArrowRight, Shield, Zap, Globe, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
export function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <ThemeToggle className="fixed top-6 right-6" />
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24 lg:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Zap className="w-4 h-4 text-[#F38020]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F38020]">Connectivity Cloud Visualization</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground mb-8">
            Network <span className="text-[#F38020]">Transformation</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12">
            Model your legacy infrastructure and visualize the power of Cloudflare's consolidated edge architecture. Reduce latency, eliminate hops, and secure your global perimeter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="h-14 px-10 text-lg bg-[#F38020] hover:bg-[#D14615] text-white gap-3 rounded-md shadow-xl transition-all hover:scale-105 active:scale-95">
                Go to Dashboard <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/editor">
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-md border-2 hover:bg-secondary transition-all">
                New Visualization
              </Button>
            </Link>
          </div>
        </div>
        {/* Value Props Section */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border">
          {[
            { 
              icon: Shield, 
              label: 'Global Security', 
              desc: 'Collapse physical appliances into a unified software-defined security perimeter at the edge.' 
            },
            { 
              icon: Zap, 
              label: 'Performance First', 
              desc: 'Leverage Cloudflare’s global network to minimize latency and optimize traffic routing automatically.' 
            },
            { 
              icon: Globe, 
              label: 'Consolidated Stack', 
              desc: 'Remove complexity by replacing fragmented vendors with a single, resilient connectivity cloud.' 
            },
          ].map((item, idx) => (
            <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow bg-secondary/30">
              <CardContent className="pt-8 px-8 pb-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#F38020] mb-6">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Bottom Banner */}
        <div className="mt-12 mb-24 p-8 rounded-2xl bg-[#F38020] text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Ready to transform?</h2>
            <p className="text-orange-100 opacity-90 max-w-md">Start visualizing your journey from legacy hardware to edge-native connectivity today.</p>
          </div>
          <Link to="/dashboard" className="relative z-10">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-[#F38020] font-bold rounded-md hover:bg-white">
              Launch Console
            </Button>
          </Link>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 opacity-10">
            <Cloud size={300} strokeWidth={1} />
          </div>
        </div>
      </div>
    </div>
  );
}