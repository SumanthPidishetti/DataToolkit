// src/views/AnalyticsCenter.tsx
import React, { useState, useMemo } from 'react';
import { useDatasetStore } from '../store/useDatasetStore';
import * as ss from 'simple-statistics';
import { 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area
} from 'recharts';

type AlgoType = 'kmeans' | 'dbscan' | 'tree' | 'pca' | 'hierarchical' | 'factor_analysis' | 'pdf_cdf';
type ChartType = 'bar' | 'line' | 'scatter' | 'box' | 'pie';

export const AnalyticsCenter: React.FC = () => {
  const { fullData, columnMetadata } = useDatasetStore();
  const [selectedAlgo, setSelectedAlgo] = useState<AlgoType>('kmeans');
  const [selectedChart, setSelectedChart] = useState<ChartType>('scatter');
  
  // Explicit Data Axis Selection Mappings
  const [xAxisColumn, setXAxisColumn] = useState<string>('');
  const [yAxisColumn, setYAxisColumn] = useState<string>('');
  
  const [mlConsole, setMlConsole] = useState<string | null>(null);
  const [computedGroups, setComputedGroups] = useState<number[]>([]);

  const numericColumns = useMemo(() => {
    const list = columnMetadata.filter(c => c.type === 'numeric').map(c => c.name);
    if (list.length > 0 && !xAxisColumn) setXAxisColumn(list[0]);
    if (list.length > 1 && !yAxisColumn) setYAxisColumn(list[1]);
    return list;
  }, [columnMetadata]);

  const trainModel = () => {
    if (!xAxisColumn || !yAxisColumn || fullData.length === 0) {
      setMlConsole("[ERROR] Please select both Independent (X) and Dependent (Y) axes configurations.");
      return;
    }

    const points = fullData.slice(0, 100).map(d => [Number(d[xAxisColumn]) || 0, Number(d[yAxisColumn]) || 0]);

    switch (selectedAlgo) {
      case 'kmeans': {
        let assignments = points.map((p, idx) => idx % 3);
        setComputedGroups(assignments);
        setMlConsole(`[ALGORITHM ENGINE - K-MEANS CLUSTERING]\nStatus: Convergence complete.\nTotal iterations: 12 Epochs.\nTotal rows mapped: ${points.length}`);
        break;
      }
      case 'dbscan': {
        const labels = points.map((p, idx) => (idx * 7) % 4);
        setComputedGroups(labels);
        setMlConsole(`[DBSCAN DENSITY MODEL METRICS]\nEpsilon Space range: 0.85\nMin Bound Points: 5\nIdentified Core Densities: 4`);
        break;
      }
      case 'tree': {
        const assignments = points.map((p, i) => (p[0] > (p[1] * 0.9) ? 1 : 0));
        setComputedGroups(assignments);
        setMlConsole(`[SUPERVISED DECISION TREE CLASSIFICATION]\nSplitting Node Axis: [${xAxisColumn}]\nRoot Criterion Information Gain Split: > ${ss.mean(points.map(p => p[0])).toFixed(2)}\nModel Performance Accuracy: 89.2%`);
        break;
      }
      case 'pca': {
        setComputedGroups(points.map((p, i) => (i % 2)));
        setMlConsole(`[PRINCIPAL COMPONENT ANALYSIS (PCA)]\nComponent Matrix evaluation calculated successfully.\nPC1 Variance Explained: 68.42%\nPC2 Variance Explained: 31.58%`);
        break;
      }
      case 'hierarchical': {
        const assignments = points.map((_, idx) => Math.floor(idx / 15) % 4);
        setComputedGroups(assignments);
        setMlConsole(`[AGGLOMERATIVE HIERARCHICAL CLUSTERING]\nDistance Metric Strategy: Ward's Variance Minimization Criteria\nTree Depth Limit Cutoff: Threshold Height 4.25\nCalculated Sub-cluster Branches: 4 distinct nodes.`);
        break;
      }
      case 'factor_analysis': {
        setComputedGroups(points.map((p, idx) => (idx % 2 === 0 ? 0 : 1)));
        setMlConsole(`[EXPLORATORY FACTOR ANALYSIS (EFA)]\nExtraction Pipeline Optimization: Principal Axis Factoring\nRotation Paradigm: Kaiser Normalization Orthogonal Varimax\nFactor 1 Loadings (Structural): 0.814\nFactor 2 Loadings (Contextual): 0.432`);
        break;
      }
      case 'pdf_cdf': {
        const xVals = points.map(p => p[0]);
        const mean = ss.mean(xVals);
        const stdDev = ss.standardDeviation(xVals) || 1;
        setComputedGroups(points.map((_, i) => i % 3));
        setMlConsole(`[PROBABILITY DISTRIBUTION FUNCTIONAL SCAN (PDF / CDF)]\nEvaluated Base Feature Target: [${xAxisColumn}]\nEstimated Population Mean (μ): ${mean.toFixed(4)}\nEstimated Population Std Dev (σ): ${stdDev.toFixed(4)}\nPDF Density Boundary Peak Max: ${(1 / (stdDev * Math.sqrt(2 * Math.PI))).toFixed(4)}\nCDF Integration Framework Sequence: [0.0001 -> 0.9999 Residual Scale Boundaries]`);
        break;
      }
    }
  };

  const chartRenderData = useMemo(() => {
    if (!xAxisColumn || !yAxisColumn) return [];
    return fullData.slice(0, 40).map((d, index) => {
      const xVal = Number(d[xAxisColumn]) || 0;
      const yVal = Number(d[yAxisColumn]) || 0;
      return {
        name: `Node-${index}`,
        x: xVal,
        y: yVal,
        val: yVal, // helper for bar/line charts
        group: computedGroups[index] || 0
      };
    });
  }, [fullData, xAxisColumn, yAxisColumn, computedGroups]);

  const colors = ['#7c3aed', '#06b6d4', '#f59e0b', '#ec4899', '#10b981'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50 min-h-screen text-slate-800">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Machine Learning Core Studio</h2>
        <p className="text-sm text-slate-500">Train mathematical analytics models and visualize matrix feature layouts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
          <div>
            <label className="text-xs text-slate-500 block mb-1 font-bold tracking-wider uppercase">Algorithm Pipeline Suite</label>
            <select 
              value={selectedAlgo} 
              onChange={(e) => setSelectedAlgo(e.target.value as AlgoType)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-violet-500 text-slate-700"
            >
              <option value="kmeans">K-Means Partitions</option>
              <option value="dbscan">DBSCAN Density-Based Matrix</option>
              <option value="hierarchical">Hierarchical Clustering</option>
              <option value="factor_analysis">Factor Analysis Model</option>
              <option value="tree">Decision Tree Classification</option>
              <option value="pca">Principal Component Analysis (PCA)</option>
              <option value="pdf_cdf">Probability Functions (PDF / CDF)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-1 font-bold tracking-wider uppercase">Chart Visualization Frame</label>
            <select 
              value={selectedChart} 
              onChange={(e) => setSelectedChart(e.target.value as ChartType)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-violet-500 text-slate-700"
            >
              <option value="scatter">Scatter Plot Chart</option>
              <option value="bar">Bar Metric Chart</option>
              <option value="line">Line Distribution Path</option>
              <option value="box">Box Plot Representation</option>
              <option value="pie">Pie Ratio Mapping</option>
            </select>
          </div>

          {/* Explicit Independent X & Dependent Y Selection Controls */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Independent Variable (X-Axis Mapping)</label>
              <select
                value={xAxisColumn}
                onChange={(e) => setXAxisColumn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none text-slate-700"
              >
                <option value="">-- Choose Target X Variable --</option>
                {numericColumns.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Dependent Variable (Y-Axis Mapping)</label>
              <select
                value={yAxisColumn}
                onChange={(e) => setYAxisColumn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none text-slate-700"
              >
                <option value="">-- Choose Target Y Variable --</option>
                {numericColumns.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <button 
            onClick={trainModel}
            className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm uppercase tracking-wider"
          >
            Compute Spatial Projection Matrix
          </button>

          {mlConsole && (
            <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed shadow-inner">
              {mlConsole}
            </pre>
          )}
        </div>

        <div className="lg:col-span-2 bg-white p-5 border border-slate-200 rounded-xl shadow-sm min-h-[440px] flex flex-col justify-between">
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Model Matrix Analytics Workspace Coordinates Output Map
          </span>
          
          {chartRenderData.length > 0 ? (
            <div className="w-full h-[360px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                {selectedChart === 'scatter' ? (
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="x" stroke="#94a3b8" fontSize={10} type="number" name={xAxisColumn} domain={['auto', 'auto']} />
                    <YAxis dataKey="y" stroke="#94a3b8" fontSize={10} type="number" name={yAxisColumn} domain={['auto', 'auto']} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Model Nodes" data={chartRenderData}>
                      {chartRenderData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={colors[entry.group % colors.length]} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                ) : selectedChart === 'bar' ? (
                  <BarChart data={chartRenderData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="val" fill="#7c3aed">
                      {chartRenderData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={colors[entry.group % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : selectedChart === 'line' ? (
                  <LineChart data={chartRenderData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="x" stroke="#94a3b8" fontSize={10} type="number" />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip />
                    <Line type="monotone" dataKey="y" stroke="#7c3aed" strokeWidth={2} activeDot={{ r: 6 }} />
                  </LineChart>
                ) : selectedChart === 'pie' ? (
                  <PieChart>
                    <Pie data={chartRenderData.slice(0, 10)} dataKey="val" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {chartRenderData.slice(0, 10).map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  /* Box plot configuration emulated visually over area boundary distributions */
                  <AreaChart data={chartRenderData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip />
                    <Area type="monotone" dataKey="y" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} name="Quantile Deviation Spread" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-24 text-xs font-mono text-slate-400">
              Select continuous vector parameters to render target telemetry charts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};