'use client';

import { useState } from 'react';
import SpeedTestDashboard from '@/components/SpeedTestDashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <SpeedTestDashboard />
      <Footer />
    </main>
  );
}
