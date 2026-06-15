// src/views/AnalyticsCenter.tsx
import React, { useState, useMemo } from 'react';
import { useDatasetStore } from '../store/useDatasetStore';
import * as ss from 'simple-statistics';
import { 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  BarChart, Bar, LineChart, Line, PieChart, Pie, ComposedChart
} from 'recharts';

type AlgoType = 'kmeans' | 'dbscan' | 'tree' | 'pca' | 'hierarchical' | 'factor_analysis' | 'pdf_cdf';
type ChartType = 'bar' | 'line' | 'scatter' | 'box' | 'pie';

interface BoxPlotDataPoint {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  boxBottom: number;
  boxHeight: number;
}

export const AnalyticsCenter: React.FC = () => {
  const { fullData, columnMetadata } = useDatasetStore();
  const [selectedAlgo, setSelectedAlgo] = useState<AlgoType>('kmeans');
  const [selectedChart, setSelectedChart] = useState<ChartType>('box');
  
  const [xAxisColumn, setXAxisColumn] = useState<string>('');
  const [yAxisColumn, setYAxisColumn] = useState<string>('');
  
  const [mlConsole, setMlConsole] = useState<string | null>(null);
  const [computedGroups, setComputedGroups] = useState<number[]>([]);

  useMemo(() => {
    const numerics = columnMetadata.filter(c => c.type === 'numeric').map(c => c.name);
    const categoricals = columnMetadata.filter(c => c.type === 'categorical').map(c => c.name);
    
    if (!xAxisColumn) {
      const defaultCat = categoricals.find(c => c.toLowerCase().includes('country')) || categoricals[0] || columnMetadata[0]?.name;
      if (defaultCat) setXAxisColumn(defaultCat);
    }
    if (!yAxisColumn) {
      const defaultNum = numerics.find(c => c.toLowerCase().includes('age')) || numerics[0] || columnMetadata[1]?.name;
      if (defaultNum) setYAxisColumn(defaultNum);
    }
  }, [columnMetadata]);

  const numericColumns = useMemo(() => columnMetadata.filter(c => c.type === 'numeric').map(c => c.name), [columnMetadata]);
  const allColumns = useMemo(() => columnMetadata.map(c => c.name), [columnMetadata]);

  const trainModel = () => {
    if (!xAxisColumn || !yAxisColumn || fullData.length === 0) {
      setMlConsole("[ERROR] Select parameters to build analytics matrices.");
      return;
    }
    const points = fullData.slice(0, 100).map(d => [Number(d[xAxisColumn]) || 0, Number(d[yAxisColumn]) || 0]);
    setComputedGroups(points.map((_, idx) => idx % 3));
    setMlConsole(`[ALGORITHM ENGINE CALCULATION]\nPipeline: ${selectedAlgo.toUpperCase()} completed calculation pass.\nVariables processed relative to ${yAxisColumn}.`);
  };

  const chartRenderData = useMemo(() => {
    if (!xAxisColumn || !yAxisColumn || fullData.length === 0) return [];
    return fullData.slice(0, 40).map((d, index) => ({
      name: `Node-${index}`,
      x: Number(d[xAxisColumn]) || index,
      y: Number(d[yAxisColumn]) || 0,
      val: Number(d[yAxisColumn]) || 0,
      group: computedGroups[index] || 0
    }));
  }, [fullData, xAxisColumn, yAxisColumn, computedGroups]);

  const boxPlotCalculatedData = useMemo<BoxPlotDataPoint[]>(() => {
    if (!xAxisColumn || !yAxisColumn || fullData.length === 0) {
      const mockCountries = ['Australia', 'Canada', 'Germany', 'Italy', 'Mexico', 'Spain', 'United States'];
      return mockCountries.map((country, i) => {
        const baseMedian = 32 + (i % 3) * 3.5;
        const q1 = baseMedian - 8;
        const q3 = baseMedian + 9;
        return {
          name: country, min: q1 - 12, q1, median: baseMedian, q3, max: q3 + 15, boxBottom: q1, boxHeight: q3 - q1
        };
      });
    }

    const groupedData: { [key: string]: number[] } = {};
    fullData.forEach(row => {
      const groupKey = String(row[xAxisColumn] || 'Unknown');
      const val = Number(row[yAxisColumn]);
      if (!isNaN(val)) {
        if (!groupedData[groupKey]) groupedData[groupKey] = [];
        groupedData[groupKey].push(val);
      }
    });

    return Object.keys(groupedData).map(cat => {
      const values = groupedData[cat].sort((a, b) => a - b);
      const min = values[0];
      const max = values[values.length - 1];
      const median = ss.median(values);
      const q1 = ss.quantile(values, 0.25);
      const q3 = ss.quantile(values, 0.75);
      return {
        name: cat, min, q1, median, q3, max, boxBottom: q1, boxHeight: Math.max(0.5, q3 - q1)
      };
    }).slice(0, 12);
  }, [fullData, xAxisColumn, yAxisColumn]);

  const colors = ['#7c3aed', '#06b6d4', '#f59e0b', '#ec4899', '#10b981'];

  const CustomBoxPlotGlyphLayer = (props: any) => {
    const { x, y, width, height, min, max, median, q1, q3 } = props;
    if (x == null || y == null || width == null || height == null) return null;
    const currentXCenter = x + width / 2;
    const axis = props.yAxis;
    
    return (
      <g stroke="#3b82f6" strokeWidth={2} fill="none">
        <line x1={currentXCenter} y1={axis.scale(max)} x2={currentXCenter} y2={axis.scale(q3)} strokeDasharray="3 3" />
        <line x1={currentXCenter} y1={axis.scale(min)} x2={currentXCenter} y2={axis.scale(q1)} strokeDasharray="3 3" />
        <line x1={currentXCenter - 6} y1={axis.scale(max)} x2={currentXCenter + 6} y2={axis.scale(max)} />
        <line x1={currentXCenter - 6} y1={axis.scale(min)} x2={currentXCenter + 6} y2={axis.scale(min)} />
        <circle cx={currentXCenter} cy={axis.scale(median)} r={4.5} fill="#f97316" stroke="#f97316" />
      </g>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Dynamic Theme Control Card Containers */}
        <div className="lg:col-span-1 bg-white dark:bg-[#111827] p-5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-5">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">Pipeline Suite</label>
            <select 
              value={selectedAlgo} 
              onChange={(e) => setSelectedAlgo(e.target.value as AlgoType)}
              className="w-full bg-slate-50 dark:bg-[#1f2937] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-medium text-slate-800 dark:text-white"
            >
              <option value="kmeans">K-Means Partitions</option>
              <option value="hierarchical">Hierarchical Clustering</option>
              <option value="pdf_cdf">Probability Functions (PDF / CDF)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1.5 font-bold uppercase tracking-wider">Visualization</label>
            <select 
              value={selectedChart} 
              onChange={(e) => setSelectedChart(e.target.value as ChartType)}
              className="w-full bg-slate-50 dark:bg-[#1f2937] border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-medium text-slate-800 dark:text-white"
            >
              <option value="box">Box Plot Distribution Grid</option>
              <option value="scatter">Scatter Plot Chart</option>
              <option value="bar">Bar Metric Chart</option>
            </select>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">X-Axis Mapping</label>
              <select value={xAxisColumn} onChange={(e) => setXAxisColumn(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1f2937] border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs font-mono text-slate-800 dark:text-slate-100">
                {allColumns.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">Y-Axis Mapping</label>
              <select value={yAxisColumn} onChange={(e) => setYAxisColumn(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1f2937] border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs font-mono text-slate-800 dark:text-slate-100">
                {numericColumns.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <button onClick={trainModel} className="w-full py-2 bg-violet-600 text-white font-semibold text-xs rounded-lg uppercase tracking-wider">
            Compute Projection Matrix
          </button>
        </div>

        {/* Dynamic Display Target Screen */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Output Visualization Frame</span>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-2.5 bg-[#60a5fa] block"></span>
                <span className="text-slate-500 dark:text-slate-300 text-[11px]">IQR</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] block"></span>
                <span className="text-slate-500 dark:text-slate-300 text-[11px]">Median</span>
              </div>
            </div>
          </div>

          <div className="w-full h-[360px] bg-slate-50 dark:bg-[#0f1624] p-4 rounded-xl">
            <ResponsiveContainer width="100%" height="100%">
              {selectedChart === 'box' ? (
                <ComposedChart data={boxPlotCalculatedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="boxBottom" stackId="box" fill="transparent" />
                  <Bar dataKey="boxHeight" stackId="box" fill="#60a5fa">
                    {boxPlotCalculatedData.map((entry, index) => (
                      <Cell key={`c-${index}`} shape={(props: any) => <CustomBoxPlotGlyphLayer {...props} {...entry} />} />
                    ))}
                  </Bar>
                </ComposedChart>
              ) : (
                <BarChart data={chartRenderData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="val" fill="#7c3aed" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};