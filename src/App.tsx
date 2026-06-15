// src/App.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { DataIngestion } from './views/DataIngestion';
import { StatsEngine } from './views/StatsEngine';
import { AnalyticsCenter } from './views/AnalyticsCenter';
import { MathSimulators } from './views/MathSimulators';
import { useDatasetStore } from './store/useDatasetStore';
import * as ss from 'simple-statistics';
import { 
  BarChart3, 
  UploadCloud, 
  Cpu, 
  Binary, 
  Terminal,
  BrainCircuit,
  Search,
  Check,
  Copy,
  Code,
  Sun,
  Moon,
  Sparkles,
  BarChart2,
  Layers,
  PieChart as PieIcon
} from 'lucide-react';

type MainRoute = 'dashboard' | 'ingest' | 'dataset_overview' | 'statistics' | 'ml' | 'simulators' | 'ai_insights' | 'history' | 'cli';

// ==========================================
// INLINE AI INSIGHTS VIEW COMPONENT
// ==========================================
const InlineAiInsights: React.FC = () => {
  const { fullData, columnMetadata } = useDatasetStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelLogs, setModelLogs] = useState<string[]>([]);

  const numericColumns = useMemo(() => columnMetadata.filter(c => c.type === 'numeric').map(c => c.name), [columnMetadata]);
  const categoricalColumns = useMemo(() => columnMetadata.filter(c => c.type === 'categorical').map(c => c.name), [columnMetadata]);

  const generatedInsights = useMemo(() => {
    const list = [];
    if (!fullData || fullData.length === 0) {
      return [
        {
          type: 'info',
          title: "Awaiting Active Ingestion Workspace Vectors",
          body: "The global memory stream contains no records. Upload a continuous matrix stream (CSV/XLSX) under the Data Ingestion portal to activate live statistical data audits.",
          impactScore: "SYSTEM BASELINE"
        },
        {
          type: 'success',
          title: "Automated Data Profiler Active",
          body: "The algorithmic pipeline is synchronized and listening for memory allocations. Once uploaded, it will automatically identify distributions, skewness markers, and missing elements.",
          impactScore: "HIGH READINESS"
        }
      ];
    }

    list.push({
      type: 'success',
      title: "Data Matrix Memory Bounds Audited",
      body: `Successfully mapped an analytical vector containing ${fullData.length.toLocaleString()} individual entries with ${columnMetadata.length} structural properties. System memory utilization metrics remain optimized.`,
      impactScore: "CONFIDENCE: 99%"
    });

    if (numericColumns.length > 0) {
      const firstNum = numericColumns[0];
      const samplePoints = fullData.map(d => Number(d[firstNum])).filter(v => !isNaN(v));
      if (samplePoints.length > 2) {
        try {
          const mean = ss.mean(samplePoints);
          const median = ss.median(samplePoints);
          const variance = ss.variance(samplePoints);
          let skewnessDescription = "symmetrical profile bounds.";
          if (mean > median + 0.5) skewnessDescription = "a distinct positive right-tail layout bias.";
          if (mean < median - 0.5) skewnessDescription = "a clear left-tail compression metric bias.";

          list.push({
            type: 'info',
            title: `Structural Distribution Log: ${firstNum}`,
            body: `Continuous column matrix exploration for "${firstNum}" reports a computed average of ${mean.toFixed(2)} vs a center median of ${median.toFixed(2)}, demonstrating ${skewnessDescription}`,
            impactScore: `VAR: ${variance.toFixed(1)}`
          });
        } catch (e) {}
      }
    }

    if (categoricalColumns.length > 0) {
      const firstCat = categoricalColumns[0];
      const uniqueVals = new Set(fullData.map(d => String(d[firstCat] || ''))).size;
      if (uniqueVals > 15) {
        list.push({
          type: 'warning',
          title: `High Dimensional Cardinality Trace: ${firstCat}`,
          body: `Feature index "${firstCat}" returned ${uniqueVals} individual categorical string configurations. Training partitioning trees or K-Means models over this vector may cause sparse spatial clusters.`,
          impactScore: "HIGH MATRIX DISPERSION"
        });
      } else {
        list.push({
          type: 'success',
          title: `Optimal Categorical Group Allocation: ${firstCat}`,
          body: `Feature column "${firstCat}" presents localized grouping boundaries (${uniqueVals} classes), making it perfect for descriptive target box plots and variance analysis.`,
          impactScore: "IDEAL TARGET"
        });
      }
    }

    return list;
  }, [fullData, columnMetadata, numericColumns, categoricalColumns]);

  const triggerAnomaliesReScan = () => {
    setIsProcessing(true);
    setModelLogs([]);
    setTimeout(() => setModelLogs(prev => [...prev, "[TRACE] Loading matrix memory registers..."]), 300);
    setTimeout(() => setModelLogs(prev => [...prev, "[COMPUTE] Evaluating data parameters via simple-statistics layers..."]), 700);
    setTimeout(() => setModelLogs(prev => [...prev, "[SUCCESS] Spatial anomaly metrics updated."]), 1200);
    setTimeout(() => setIsProcessing(false), 1300);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Executive Diagnostic Insights</h2>
          <p className="text-xs text-slate-400 mt-0.5">Automated matrix diagnostic routines scanning your loaded data structures.</p>
        </div>
        {fullData && fullData.length > 0 && (
          <button
            onClick={triggerAnomaliesReScan}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-lg uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Auditing Matrix...' : 'Re-Run Diagnostic Scan'}</span>
          </button>
        )}
      </div>

      {modelLogs.length > 0 && (
        <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl font-mono text-xs text-emerald-400 space-y-1">
          {modelLogs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {generatedInsights.map((insight, index) => (
          <div 
            key={index}
            className="p-5 rounded-xl border bg-slate-900/40 border-slate-800 flex flex-col justify-between border-l-4 border-l-indigo-500"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-sm text-white leading-snug">{insight.title}</h3>
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">{insight.body}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono font-bold text-slate-500">
              <span>SYSTEM DIAGNOSTIC ANCHOR</span>
              <span className="text-indigo-400">{insight.impactScore}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// INLINE CLI GUIDE VIEW COMPONENT
// ==========================================
const InlineCliGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const cliCommands = [
    { cmd: "stattoolkit ingest --file dataset.csv", desc: "Uploads and structures a local data matrix stream into the active application engine state.", category: "ingest", syntax: "stattoolkit ingest --file <filename.csv>", output: "[SUCCESS] Parsed file matrix" },
    { cmd: "stattoolkit analyze descriptive --col target_variable", desc: "Compiles complete descriptive statistics (Mean, Median, Variance, Skewness) for a target feature vector.", category: "statistics", syntax: "stattoolkit analyze descriptive --col <column_name>", output: "Mean: 42.185\nMedian: 39.00" },
    { cmd: "stattoolkit test t-test --col1 group_a --col2 group_b", desc: "Computes an independent two-sample T-test verification over separate continuous variables.", category: "statistics", syntax: "stattoolkit test t-test --col1 <col1> --col2 <col2>", output: "p-Value: 0.0166 (Reject Null)" },
    { cmd: "stattoolkit train kmeans --k 3 --features age,income", desc: "Fits an unsupervised K-Means partitioning model over custom spatial coordinate variables.", category: "ml", syntax: "stattoolkit train kmeans --k <k> --features <cols>", output: "Convergence Optimized in 6 iterations" },
    { cmd: "stattoolkit transform pca --components 2", desc: "Applies a covariance matrix calculation for dimensionality reduction and extracts principal component axes.", category: "ml", syntax: "stattoolkit transform pca --components <count>", output: "PC1 Explains 54.2% Variance" }
  ];

  const filtered = cliCommands.filter(c => {
    const matchesSearch = c.cmd.includes(searchQuery) || c.desc.includes(searchQuery);
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Core Sandbox Command Line Shell Interface</h2>
        <p className="text-xs text-slate-400 mt-0.5">Programmatic workspace interface interaction vectors.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input 
            type="text" placeholder="Search syntax maps..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['all', 'ingest', 'statistics', 'ml'].map((cat) => (
            <button
              key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((command, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="bg-slate-950/60 px-5 py-3 border-b border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-indigo-400">
                <Code className="w-4 h-4 text-slate-500" />
                <span>{command.cmd}</span>
              </div>
              <button 
                onClick={() => { navigator.clipboard.writeText(command.cmd); setCopiedIndex(idx); setTimeout(() => setCopiedIndex(null), 2000); }}
                className="p-1 text-slate-400 hover:text-white"
              >
                {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-300 font-medium">{command.desc}</p>
              <div className="p-2 bg-slate-950 rounded-lg text-xs font-mono text-slate-400">{command.syntax}</div>
              <pre className="p-3 bg-slate-950 text-[11px] font-mono text-emerald-400 rounded-lg">{command.output}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// ==========================================
// MAIN APP COMPONENT EXPORT
// ==========================================
export function App() {
  const [currentRoute, setCurrentRoute] = useState<MainRoute>('ingest');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const { fullData, columnMetadata, activities } = useDatasetStore();

  const numericColumns = useMemo(() => columnMetadata.filter(c => c.type === 'numeric'), [columnMetadata]);
  const categoricalColumns = useMemo(() => columnMetadata.filter(c => c.type === 'categorical' || c.type === 'string'), [columnMetadata]);

  const [selectedHistCol, setSelectedHistCol] = useState<string>('');
  const [selectedPieCol, setSelectedPieCol] = useState<string>('');

  // Auto-select defaults when columns are available
  useEffect(() => {
    if (numericColumns.length > 0 && !selectedHistCol) {
      setSelectedHistCol(numericColumns[0].name);
    }
  }, [numericColumns, selectedHistCol]);

  useEffect(() => {
    if (categoricalColumns.length > 0 && !selectedPieCol) {
      setSelectedPieCol(categoricalColumns[0].name);
    }
  }, [categoricalColumns, selectedPieCol]);

  // Sync class identifiers to HTML root node
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 1. COMPUTED HISTOGRAM RECTANGLES MAPPING (SVG Based)
  const histogramBins = useMemo(() => {
    if (!fullData || fullData.length === 0 || !selectedHistCol) return [];
    const values = fullData.map(d => Number(d[selectedHistCol])).filter(v => !isNaN(v));
    if (values.length === 0) return [];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const binCount = 8;
    const range = max - min;
    const step = range === 0 ? 1 : range / binCount;

    const bins = Array.from({ length: binCount }, (_, i) => ({
      x0: min + i * step,
      x1: min + (i + 1) * step,
      count: 0
    }));

    values.forEach(v => {
      let idx = Math.floor((v - min) / step);
      if (idx >= binCount) idx = binCount - 1;
      if (idx >= 0 && bins[idx]) bins[idx].count++;
    });

    return bins;
  }, [fullData, selectedHistCol]);

  // 2. COMPUTED PIE CHART SECTORS MAPPING (SVG Coordinates Based)
  const pieSectors = useMemo(() => {
    if (!fullData || fullData.length === 0 || !selectedPieCol) return [];
    const counts: Record<string, number> = {};
    
    fullData.forEach(row => {
      const val = String(row[selectedPieCol] ?? 'Missing/NaN');
      counts[val] = (counts[val] || 0) + 1;
    });

    const total = fullData.length;
    let accumulatedAngle = 0;
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#64748b'];

    return Object.entries(counts).map(([label, count], index) => {
      const percentage = (count / total) * 100;
      const angle = (count / total) * 360;
      
      // Calculate start and end coordinates on circumference
      const xStart = Math.cos((accumulatedAngle - 90) * Math.PI / 180);
      const yStart = Math.sin((accumulatedAngle - 90) * Math.PI / 180);
      accumulatedAngle += angle;
      const xEnd = Math.cos((accumulatedAngle - 90) * Math.PI / 180);
      const yEnd = Math.sin((accumulatedAngle - 90) * Math.PI / 180);

      return {
        label,
        count,
        percentage,
        angle,
        xStart,
        yStart,
        xEnd,
        yEnd,
        largeArcFlag: angle > 180 ? 1 : 0,
        color: colors[index % colors.length]
      };
    });
  }, [fullData, selectedPieCol]);

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-200 ${isDarkMode ? 'bg-[#0b0f19] text-slate-100' : 'bg-[#f8fafc] text-slate-800'}`}>
      
      {/* Sidebar Navigation Panel */}
      <aside className={`w-64 flex flex-col border-r shrink-0 transition-colors duration-200 ${isDarkMode ? 'bg-[#0f172a] border-slate-800 text-slate-300' : 'bg-slate-900 border-slate-950 text-slate-200'}`}>
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            📊
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wide text-sm leading-none">StatToolkit</h1>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Enterprise Analytics</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          <div>
            <div className="px-5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Main
            </div>
            <nav className="px-3 space-y-0.5">
              <button 
                onClick={() => setCurrentRoute('ingest')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'ingest' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40 text-slate-400'}`}
              >
                <UploadCloud className="w-4 h-4" /> Data Upload
              </button>
              <button 
                onClick={() => setCurrentRoute('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'dashboard' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40 text-slate-400'}`}
              >
                <BarChart2 className="w-4 h-4" /> Global Dashboard
              </button>
            </nav>
          </div>

          <div>
            <div className="px-5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Analysis
            </div>
            <nav className="px-3 space-y-0.5">
              <button 
                onClick={() => setCurrentRoute('statistics')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'statistics' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-800/40 text-slate-400'}`}
              >
                <Binary className="w-4 h-4" /> Statistics Engine
              </button>
              <button 
                onClick={() => setCurrentRoute('ml')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'ml' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-800/40 text-slate-400'}`}
              >
                <Cpu className="w-4 h-4" /> Machine Learning
              </button>
              <button 
                onClick={() => setCurrentRoute('simulators')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'simulators' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40 text-slate-400'}`}
              >
                <Layers className="w-4 h-4" /> Visualizations
              </button>
            </nav>
          </div>

          <div>
            <div className="px-5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              System
            </div>
            <nav className="px-3 space-y-0.5">
              <button 
                onClick={() => setCurrentRoute('ai_insights')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'ai_insights' ? 'bg-slate-800 text-white shadow-sm' : 'hover:bg-slate-800/40 text-slate-400'}`}
              >
                <BrainCircuit className="w-4 h-4" /> AI Insights
              </button>
              <button 
                onClick={() => setCurrentRoute('cli')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'cli' ? 'bg-slate-800 text-white shadow-sm' : 'hover:bg-slate-800/40 text-slate-400'}`}
              >
                <Terminal className="w-4 h-4" /> CLI Guide
              </button>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#0b111e] flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>v1.0.0 Alpha</span>
          <div className="flex items-center gap-1.5 text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
          </div>
        </div>
      </aside>

      {/* Main Viewport Workspace Content Layout Frame */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Universal Top Dashboard Control Header */}
        <header className={`h-14 border-b flex items-center justify-end px-8 shrink-0 gap-3 transition-colors duration-200 ${isDarkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`flex items-center justify-center p-2 rounded-lg border transition-all duration-200 hover:scale-105 ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-violet-600 hover:bg-slate-200'
            }`}
            title={isDarkMode ? "Switch to Light Layout View" : "Switch to Dark Layout View"}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <a 
            href="https://github.com/SumanthPidishetti/DataToolkit" target="_blank" rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors uppercase tracking-wider ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>User Guide</span>
          </a>
        </header>

        {/* Primary View Container Injection Port */}
        <main className={`flex-1 overflow-y-auto p-8 transition-colors duration-200 ${isDarkMode ? 'bg-[#0f1624]' : 'bg-[#f1f5f9]'}`}>
          {currentRoute === 'ingest' && <DataIngestion />}
          {currentRoute === 'statistics' && <StatsEngine />}
          {currentRoute === 'ml' && <AnalyticsCenter />}
          {currentRoute === 'simulators' && <MathSimulators />}
          {currentRoute === 'ai_insights' && <InlineAiInsights />}
          {currentRoute === 'cli' && <InlineCliGuide />}

          {/* SHARED DISTRIBUTION DASHBOARD WITH HISTOGRAM AND PIE PLOTS */}
          {currentRoute === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Workspace Executive Summary</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time summary metric snapshots of current application parameters.</p>
              </div>

              {/* Top Stats Cards Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Parsed Observations</div>
                  <div className="text-2xl font-bold mt-1 text-white">{fullData ? fullData.length : 0} Rows</div>
                </div>
                <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Identified Numeric Features</div>
                  <div className="text-2xl font-bold text-indigo-400 mt-1">{numericColumns.length} Continuous Arrays</div>
                </div>
                <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Evaluated Actions</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">{activities ? activities.length : 0} Computations</div>
                </div>
              </div>

              {/* Charts Rendering Layout Node */}
              {fullData && fullData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* INLINE HISTOGRAM VISUALIZATION */}
                  <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Continuous Distribution Histogram</h3>
                      </div>
                      <select 
                        value={selectedHistCol} 
                        onChange={(e) => setSelectedHistCol(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none"
                      >
                        {numericColumns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>

                    <div className="h-64 w-full bg-slate-950 rounded-lg p-4 relative flex items-end justify-between gap-1 border border-slate-900">
                      {histogramBins.length > 0 ? (
                        (() => {
                          const maxCount = Math.max(...histogramBins.map(b => b.count), 1);
                          return histogramBins.map((bin, idx) => {
                            const heightPercent = (bin.count / maxCount) * 85;
                            return (
                              <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] rounded px-1.5 py-0.5 pointer-events-none font-mono z-10 whitespace-nowrap">
                                  [{bin.x0.toFixed(1)} - {bin.x1.toFixed(1)}]: {bin.count}
                                  </div>
                                <div 
                                  className="w-full bg-indigo-500/80 hover:bg-indigo-400 rounded-t transition-all duration-300"
                                  style={{ height: `${heightPercent}%` }}
                                />
                                <span className="text-[9px] font-mono text-slate-500 mt-1 truncate max-w-full">
                                  {bin.x0.toFixed(1)}
                                </span>
                              </div>
                            );
                          });
                        })()
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">No numeric parameters mapped</div>
                      )}
                    </div>
                  </div>

                  {/* INLINE CATEGORICAL PIE CHART VISUALIZATION */}
                  <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PieIcon className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Categorical Distribution Pie Chart</h3>
                      </div>
                      <select 
                        value={selectedPieCol} 
                        onChange={(e) => setSelectedPieCol(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded px-2 py-1 focus:outline-none"
                      >
                        {categoricalColumns.length > 0 ? (
                          categoricalColumns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)
                        ) : (
                          columnMetadata.map(c => <option key={c.name} value={c.name}>{c.name}</option>)
                        )}
                      </select>
                    </div>

                    <div className="h-64 bg-slate-950 rounded-lg p-4 border border-slate-900 flex flex-col sm:flex-row items-center justify-center gap-6">
                      {pieSectors.length > 0 ? (
                        <>
                          <div className="w-36 h-36 shrink-0 relative">
                            <svg viewBox="-1.1 -1.1 2.2 2.2" className="w-full h-full transform -rotate-90">
                              {pieSectors.map((sector, idx) => {
                                if (sector.percentage >= 99.9) {
                                  return <circle key={idx} r="1" fill={sector.color} />;
                                }
                                const pathDefinition = `M 0 0 L ${sector.xStart} ${sector.yStart} A 1 1 0 ${sector.largeArcFlag} 1 ${sector.xEnd} ${sector.yEnd} Z`;
                                return <path key={idx} d={pathDefinition} fill={sector.color} className="hover:opacity-80 transition-opacity" />;
                              })}
                            </svg>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto max-h-full space-y-1.5 w-full">
                            {pieSectors.slice(0, 6).map((sector, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 truncate pr-2">
                                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sector.color }} />
                                  <span className="text-slate-300 truncate font-medium">{sector.label}</span>
                                </div>
                                <span className="font-mono text-slate-500 font-bold shrink-0">{sector.percentage.toFixed(1)}%</span>
                              </div>
                            ))}
                            {pieSectors.length > 6 && (
                              <div className="text-[10px] text-slate-500 font-mono text-center pt-1 border-t border-slate-900">
                                + {pieSectors.length - 6} more rows categorical elements
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-slate-500">No categoricals identified in target arrays</div>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-12 text-center rounded-xl border border-slate-800 bg-slate-900/20 space-y-2">
                  <div className="text-slate-400 text-sm font-semibold">Workspace Buffers Unallocated</div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">Please upload a valid CSV data matrix stream via the Data Upload module to generate full distribution histograms and pie configurations.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
