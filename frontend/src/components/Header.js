'use client';

import { Activity, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-primary-800/30 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Zap className="w-8 h-8 text-primary-400" />
              <div className="absolute inset-0 blur-xl bg-primary-400/20 animate-pulse-slow" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500 bg-clip-text text-transparent">
                AWS Speed Test
              </h1>
              <p className="text-xs text-slate-400">Local Zone vs Regional Comparison</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-success animate-pulse" />
            <span className="text-sm text-slate-300">Sistema Activo</span>
          </div>
        </div>
      </div>
    </header>
  );
}
