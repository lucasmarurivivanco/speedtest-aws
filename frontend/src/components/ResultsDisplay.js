'use client';

import { Award, Clock, TrendingDown, TrendingUp, Zap } from 'lucide-react';

export default function ResultsDisplay({ results }) {
  if (!results) return null;

  const { server1, server2 } = results;
  
  // Determine winner
  const winner = server1.metrics.average < server2.metrics.average ? 'server1' : 'server2';
  const improvement =
    winner === 'server1'
      ? ((server2.metrics.average - server1.metrics.average) / server2.metrics.average) * 100
      : ((server1.metrics.average - server2.metrics.average) / server1.metrics.average) * 100;

  const MetricCard = ({ title, value, unit, icon: Icon, highlight }) => (
    <div className={`p-4 rounded-xl border ${
      highlight 
        ? 'border-success/30 bg-success/10' 
        : 'border-slate-700 bg-slate-800/30'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${highlight ? 'text-success' : 'text-slate-400'}`} />
        <span className="text-xs text-slate-400">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white">
        {value.toFixed(2)}
        <span className="text-sm text-slate-400 ml-1">{unit}</span>
      </div>
    </div>
  );

  const ServerResults = ({ data, name, isWinner, flag }) => (
    <div className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border ${
      isWinner ? 'border-success/50 shadow-xl shadow-success/20' : 'border-slate-700'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{flag}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{name}</h3>
            <p className="text-sm text-slate-400">{data.times.length} requests completados</p>
          </div>
        </div>
        {isWinner && (
          <div className="flex items-center gap-2 px-4 py-2 bg-success/20 rounded-full border border-success/30">
            <Award className="w-5 h-5 text-success" />
            <span className="text-sm font-semibold text-success">Ganador</span>
          </div>
        )}
      </div>

      {data.error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-sm text-red-400">❌ Error: {data.error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Promedio"
          value={data.metrics.average}
          unit="ms"
          icon={Clock}
          highlight={isWinner}
        />
        <MetricCard
          title="Mínimo"
          value={data.metrics.min}
          unit="ms"
          icon={TrendingDown}
        />
        <MetricCard
          title="Máximo"
          value={data.metrics.max}
          unit="ms"
          icon={TrendingUp}
        />
        <MetricCard
          title="P50 (Mediana)"
          value={data.metrics.p50}
          unit="ms"
          icon={Zap}
        />
        <MetricCard
          title="P95"
          value={data.metrics.p95}
          unit="ms"
          icon={Zap}
        />
        <MetricCard
          title="P99"
          value={data.metrics.p99}
          unit="ms"
          icon={Zap}
        />
      </div>

      {/* Response times list (collapsed) */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm text-slate-400 hover:text-slate-300 transition-colors">
          Ver todos los tiempos de respuesta
        </summary>
        <div className="mt-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700 max-h-40 overflow-y-auto">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {data.times.map((time, index) => (
              <div key={index} className="text-xs text-slate-300">
                #{index + 1}: <span className="font-mono text-primary-400">{time.toFixed(1)}ms</span>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Winner Announcement */}
      <div className="bg-gradient-to-r from-success/20 via-success/10 to-success/20 backdrop-blur-xl rounded-2xl p-6 border border-success/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center border border-success/30">
              <Award className="w-8 h-8 text-success" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {winner === 'server1' ? '🇨🇱 Chile Local Zone' : '🇧🇷 São Paulo'} es más rápido
              </h3>
              <p className="text-slate-300">
                Con una mejora del <span className="font-bold text-success">{improvement.toFixed(1)}%</span> en tiempo de respuesta promedio
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-4xl font-bold text-success">
              {improvement.toFixed(1)}%
            </div>
            <div className="text-sm text-slate-400">más rápido</div>
          </div>
        </div>
      </div>

      {/* Individual Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ServerResults
          data={server1}
          name="Chile Local Zone"
          isWinner={winner === 'server1'}
          flag="🇨🇱"
        />
        <ServerResults
          data={server2}
          name="São Paulo (sa-east-1)"
          isWinner={winner === 'server2'}
          flag="🇧🇷"
        />
      </div>

      {/* Test Info */}
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
        <h4 className="text-lg font-bold text-white mb-4">Información de la Prueba</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Tipo de Test:</span>
            <div className="font-semibold text-white mt-1">{results.config.testType.toUpperCase()}</div>
          </div>
          <div>
            <span className="text-slate-400">Requests:</span>
            <div className="font-semibold text-white mt-1">{results.config.requestCount}</div>
          </div>
          <div>
            <span className="text-slate-400">Fecha:</span>
            <div className="font-semibold text-white mt-1">
              {new Date(results.timestamp).toLocaleDateString('es-CL')}
            </div>
          </div>
          <div>
            <span className="text-slate-400">Hora:</span>
            <div className="font-semibold text-white mt-1">
              {new Date(results.timestamp).toLocaleTimeString('es-CL')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
