'use client';

import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-primary-800/30 bg-slate-900/50 backdrop-blur-lg mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Hecho con</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>para comparar AWS Local Zones</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>© 2025 AWS Speed Test</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
