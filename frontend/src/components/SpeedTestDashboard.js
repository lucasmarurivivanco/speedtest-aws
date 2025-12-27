'use client';

import { useState, useEffect } from 'react';
import { Play, Loader2, Settings, TrendingUp, Server } from 'lucide-react';
import TestConfiguration from './TestConfiguration';
import ResultsDisplay from './ResultsDisplay';
import ComparisonChart from './ComparisonChart';
import { runTest, calculateMetrics } from '@/lib/testRunner';

export default function SpeedTestDashboard() {
  const [config, setConfig] = useState({
    server1: {
      name: 'Chile Local Zone',
      url: '',
      enabled: true,
    },
    server2: {
      name: 'São Paulo (sa-east-1)',
      url: '',
      enabled: true,
    },
    testType: 'ping',
    requestCount: 10,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showConfig, setShowConfig] = useState(true);

  const handleStartTest = async () => {
    if (!config.server1.url || !config.server2.url) {
      alert('Por favor configura las URLs de ambos servidores');
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setResults(null);

    try {
      const testResults = await runTest(config, (progressValue) => {
        setProgress(progressValue);
      });

      const metricsServer1 = calculateMetrics(testResults.server1.times);
      const metricsServer2 = calculateMetrics(testResults.server2.times);

      setResults({
        server1: {
          ...testResults.server1,
          metrics: metricsServer1,
        },
        server2: {
          ...testResults.server2,
          metrics: metricsServer2,
        },
        config: config,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error running test:', error);
      alert(`Error al ejecutar la prueba: ${error.message}`);
    } finally {
      setIsRunning(false);
      setProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-300 via-accent-300 to-primary-400 bg-clip-text text-transparent">
          Benchmark de Rendimiento
        </h2>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          Compara el rendimiento real entre una Local Zone en Chile y la región de São Paulo.
          Mide latencia, I/O, procesamiento y operaciones de base de datos.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-primary-500/20">
          <div className="flex items-center gap-3 mb-2">
            <Server className="w-6 h-6 text-primary-400" />
            <h3 className="text-slate-300 font-medium">Servidores</h3>
          </div>
          <p className="text-3xl font-bold text-white">2</p>
          <p className="text-xs text-slate-400 mt-1">Instancias EC2 activas</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-accent-500/20">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-accent-400" />
            <h3 className="text-slate-300 font-medium">Tipos de Test</h3>
          </div>
          <p className="text-3xl font-bold text-white">4</p>
          <p className="text-xs text-slate-400 mt-1">Pruebas disponibles</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-success/20">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-success" />
            <h3 className="text-slate-300 font-medium">Configuración</h3>
          </div>
          <p className="text-3xl font-bold text-white">{config.requestCount}</p>
          <p className="text-xs text-slate-400 mt-1">Requests por test</p>
        </div>
      </div>

      {/* Configuration */}
      {showConfig && (
        <div className="mb-8">
          <TestConfiguration config={config} setConfig={setConfig} />
        </div>
      )}

      {/* Start Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleStartTest}
          disabled={isRunning}
          className="group relative px-12 py-5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl font-bold text-lg text-white shadow-2xl shadow-primary-500/50 hover:shadow-primary-500/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100"
        >
          <div className="flex items-center gap-3">
            {isRunning ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Ejecutando Prueba... {progress}%</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                <span>Iniciar Prueba</span>
              </>
            )}
          </div>
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400 to-accent-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity -z-10" />
        </button>
      </div>

      {/* Progress Bar */}
      {isRunning && (
        <div className="mb-8">
          <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden border border-primary-500/30">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 animate-shimmer" />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-8">
          <ComparisonChart results={results} />
          <ResultsDisplay results={results} />
        </div>
      )}

      {/* Info Cards */}
      {!results && !isRunning && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            {
              title: 'Latencia Simple',
              description: 'Mide el tiempo de respuesta básico de red',
              icon: '⚡',
              color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
            },
            {
              title: 'I/O de Archivos',
              description: 'Operaciones de lectura y escritura en disco',
              icon: '💾',
              color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
            },
            {
              title: 'Procesamiento',
              description: 'Simula procesamiento de imágenes con I/O',
              icon: '🔄',
              color: 'from-green-500/20 to-green-600/20 border-green-500/30'
            },
            {
              title: 'Base de Datos',
              description: 'Operaciones de consulta y escritura en BD',
              icon: '🗄️',
              color: 'from-orange-500/20 to-orange-600/20 border-orange-500/30'
            },
          ].map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.color} backdrop-blur-xl rounded-2xl p-6 border hover:scale-105 transition-transform duration-300`}
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-slate-300">{card.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
