'use client';

import { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BarChart3 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function ComparisonChart({ results }) {
  if (!results) return null;

  const { server1, server2 } = results;

  // Comparison data
  const comparisonData = {
    labels: ['Promedio', 'Mínimo', 'Máximo', 'P50', 'P95', 'P99'],
    datasets: [
      {
        label: '🇨🇱 Chile Local Zone',
        data: [
          server1.metrics.average,
          server1.metrics.min,
          server1.metrics.max,
          server1.metrics.p50,
          server1.metrics.p95,
          server1.metrics.p99,
        ],
        backgroundColor: 'rgba(56, 189, 248, 0.5)',
        borderColor: 'rgba(56, 189, 248, 1)',
        borderWidth: 2,
      },
      {
        label: '🇧🇷 São Paulo (sa-east-1)',
        data: [
          server2.metrics.average,
          server2.metrics.min,
          server2.metrics.max,
          server2.metrics.p50,
          server2.metrics.p95,
          server2.metrics.p99,
        ],
        backgroundColor: 'rgba(217, 70, 239, 0.5)',
        borderColor: 'rgba(217, 70, 239, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(203, 213, 225)',
          font: {
            size: 14,
            weight: 'bold',
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Comparación de Métricas de Rendimiento',
        color: 'rgb(248, 250, 252)',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgb(248, 250, 252)',
        bodyColor: 'rgb(203, 213, 225)',
        borderColor: 'rgba(56, 189, 248, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ms`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: 'rgb(148, 163, 184)',
          callback: function(value) {
            return value + ' ms';
          },
        },
        title: {
          display: true,
          text: 'Tiempo de Respuesta (ms)',
          color: 'rgb(203, 213, 225)',
          font: {
            size: 13,
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: 'rgb(148, 163, 184)',
        },
      },
    },
  };

  // Time series data (individual requests)
  const timeSeriesData = {
    labels: server1.times.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: '🇨🇱 Chile',
        data: server1.times,
        borderColor: 'rgba(56, 189, 248, 1)',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        tension: 0.4,
      },
      {
        label: '🇧🇷 São Paulo',
        data: server2.times,
        borderColor: 'rgba(217, 70, 239, 1)',
        backgroundColor: 'rgba(217, 70, 239, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const timeSeriesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(203, 213, 225)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: 'Tiempos de Respuesta por Request',
        color: 'rgb(248, 250, 252)',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: 'rgb(248, 250, 252)',
        bodyColor: 'rgb(203, 213, 225)',
        borderColor: 'rgba(56, 189, 248, 0.5)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ms`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: 'rgb(148, 163, 184)',
          callback: function(value) {
            return value + ' ms';
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: 'rgb(148, 163, 184)',
          maxTicksLimit: 20,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Metrics Comparison Chart */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-primary-500/20">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-6 h-6 text-primary-400" />
          <h3 className="text-xl font-bold text-white">Comparación de Métricas</h3>
        </div>
        <div className="h-96">
          <Bar data={comparisonData} options={options} />
        </div>
      </div>

      {/* Time Series Chart */}
      {server1.times.length > 1 && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-accent-500/20">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-accent-400" />
            <h3 className="text-xl font-bold text-white">Evolución de Tiempos</h3>
          </div>
          <div className="h-96">
            <Bar data={timeSeriesData} options={timeSeriesOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
