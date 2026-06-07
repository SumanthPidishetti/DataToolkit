// src/views/MathSimulators.tsx
import React, { useState } from 'react';
import * as ss from 'simple-statistics';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const MathSimulators: React.FC = () => {
  const [sampleSize, setSampleSize] = useState<number>(30);
  const [simulatedMeans, setSimulatedMeans] = useState<any[]>([]);

  const runCLTSimulation = () => {
    const iterations = 500;
    const trackingMeans: { [key: string]: number } = {};

    for (let i = 0; i < iterations; i++) {
      const samples = [];
      for (let j = 0; j < sampleSize; j++) {
        // Sample from an exponential distribution profile
        samples.push(-Math.log(1 - Math.random()) / 2);
      }
      const mean = ss.mean(samples);
      const bucket = (Math.round(mean * 10) / 10).toFixed(1);
      trackingMeans[bucket] = (trackingMeans[bucket] || 0) + 1;
    }

    const chartData = Object.keys(trackingMeans).map(key => ({
      Mean: parseFloat(key),
      Frequency: trackingMeans[key]
    })).sort((a, b) => a.Mean - b.Mean);

    setSimulatedMeans(chartData);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Central Limit Theorem Simulator</h2>
        <p className="text-sm text-slate-500">Watch non-normal distributions converge toward normal symmetry over repeated iterations.</p>
      </div>

      <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold block text-slate-600 mb-2">Sample Size ($n$): {sampleSize}</label>
          <input 
            type="range" min="5" max="100" value={sampleSize} 
            onChange={(e) => setSampleSize(parseInt(e.target.value))}
            className="w-full accent-indigo-600 bg-slate-100 h-2 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <button 
          onClick={runCLTSimulation}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors font-medium shadow-sm"
        >
          Generate Sampling Distribution
        </button>

        {simulatedMeans.length > 0 && (
          <div className="h-64 pt-4 border-t border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={simulatedMeans}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="Mean" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="Frequency" fill="#4f46e5" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};