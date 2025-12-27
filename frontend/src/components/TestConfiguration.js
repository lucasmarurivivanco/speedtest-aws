'use client';

import { Globe, Hash } from 'lucide-react';

export default function TestConfiguration({ config, setConfig }) {
  const testTypes = [
    { value: 'ping', label: 'Latencia Simple', description: 'Tiempo de respuesta básico' },
    { value: 'io', label: 'I/O de Archivos', description: 'Lectura/escritura de disco' },
    { value: 'processing', label: 'Procesamiento', description: 'Procesa datos con I/O' },
    { value: 'database', label: 'Base de Datos', description: 'Operaciones de BD simuladas' },
  ];

  const requestCounts = [1, 10, 25, 50, 100];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-primary-500/20">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Globe className="w-6 h-6 text-primary-400" />
        Configuración de Prueba
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Server 1 */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            🇨🇱 Servidor Chile (Local Zone)
          </label>
          <input
            type="text"
            value={config.server1.url}
            onChange={(e) =>
              setConfig({
                ...config,
                server1: { ...config.server1, url: e.target.value },
              })
            }
            placeholder="http://your-chile-ec2-ip"
            className="w-full px-4 py-3 bg-slate-900/50 border border-primary-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 transition-all"
          />
        </div>

        {/* Server 2 */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            🇧🇷 Servidor São Paulo (sa-east-1)
          </label>
          <input
            type="text"
            value={config.server2.url}
            onChange={(e) =>
              setConfig({
                ...config,
                server2: { ...config.server2, url: e.target.value },
              })
            }
            placeholder="http://your-saopaulo-ec2-ip"
            className="w-full px-4 py-3 bg-slate-900/50 border border-accent-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20 transition-all"
          />
        </div>
      </div>

      {/* Test Type */}
      <div className="mt-8">
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Tipo de Prueba
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setConfig({ ...config, testType: type.value })}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                config.testType === type.value
                  ? 'border-primary-400 bg-primary-500/20 shadow-lg shadow-primary-500/20'
                  : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'
              }`}
            >
              <div className="font-semibold text-white mb-1">{type.label}</div>
              <div className="text-xs text-slate-400">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Request Count */}
      <div className="mt-8">
        <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
          <Hash className="w-4 h-4" />
          Número de Requests
        </label>
        <div className="flex flex-wrap gap-3">
          {requestCounts.map((count) => (
            <button
              key={count}
              onClick={() => setConfig({ ...config, requestCount: count })}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                config.requestCount === count
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Más requests = resultados más precisos, pero toma más tiempo
        </p>
      </div>
    </div>
  );
}
