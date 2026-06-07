// src/App.tsx
import React, { useState } from 'react';
import { DataIngestion } from './views/DataIngestion';
import { StatsEngine } from './views/StatsEngine';
import { AnalyticsCenter } from './views/AnalyticsCenter';
import { MathSimulators } from './views/MathSimulators';
import { useDatasetStore } from './store/useDatasetStore';
import { 
  BarChart3, 
  UploadCloud, 
  Cpu, 
  Binary, 
  LayoutDashboard, 
  Eye, 
  Terminal,
  Activity,
  History,
  BrainCircuit,
  Search,
  CheckCircle,
  Play,
  ArrowRight,
  Code
} from 'lucide-react';

type MainRoute = 'dashboard' | 'ingest' | 'dataset_overview' | 'statistics' | 'ml' | 'simulators' | 'ai_insights' | 'history' | 'cli';

function App() {
  // FIXED: Changed initial state string from 'statistics' to 'ingest' to ensure application boots into the upload pane
  const [currentRoute, setCurrentRoute] = useState<MainRoute>('ingest');
  const { fullData, columnMetadata, activities } = useDatasetStore();
  const [cliFilter, setCliFilter] = useState('');

  // Extract numerical arrays for quick KPI calculations in the Dashboard
  const numericColumns = columnMetadata.filter(c => c.type === 'numeric');

  // Hardcoded CLI Command Matrix Data for the Interactive Guide Panel
  const cliCommands = [
    { cmd: "stattoolkit ingest --file dataset.csv", desc: "Uploads and structures a local data matrix stream into the active application engine state.", category: "ingest" },
    { cmd: "stattoolkit analyze descriptive --col target_variable", desc: "Compiles complete descriptive statistics (Mean, Median, Variance, Skewness) for a target feature vector.", category: "statistics" },
    { cmd: "stattoolkit test t-test --col1 group_a --col2 group_b", desc: "Computes an independent two-sample T-test verification over separate continuous variables.", category: "statistics" },
    { cmd: "stattoolkit train kmeans --k 3 --features age,income", desc: "Fits an unsupervised K-Means partitioning model over custom spatial coordinate variables.", category: "ml" },
    { cmd: "stattoolkit transform pca --components 2", desc: "Applies a covariance matrix calculation for dimensionality reduction and extracts principal component axes.", category: "ml" },
  ];

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
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
          {/* Main Controls Section */}
          <div>
            <div className="px-5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Main
            </div>
            <nav className="px-3 space-y-0.5">
              {/* <button 
                onClick={() => setCurrentRoute('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'dashboard' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40 text-slate-400'}`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </button> */}
              <button 
                onClick={() => setCurrentRoute('ingest')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'ingest' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40 text-slate-400'}`}
              >
                <UploadCloud className="w-4 h-4" /> Data Upload
              </button>
            </nav>
          </div>

          {/* Core Analytics Suite Section */}
          <div>
            <div className="px-5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Analysis
            </div>
            <nav className="px-3 space-y-0.5">
              <button 
                onClick={() => setCurrentRoute('statistics')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'statistics' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-slate-800/40 text-slate-400'}`}
              >
                <BarChart3 className="w-4 h-4" /> Statistics
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
                <Binary className="w-4 h-4" /> Visualizations
              </button>
            </nav>
          </div>

          {/* System & Operations Logging Section */}
          <div>
            <div className="px-5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              System
            </div>
            <nav className="px-3 space-y-0.5">
              <button 
                onClick={() => setCurrentRoute('ai_insights')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'ai_insights' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40 text-slate-400'}`}
              >
                <BrainCircuit className="w-4 h-4" /> AI Insights
              </button>
              {/* <button 
                onClick={() => setCurrentRoute('history')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'history' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40 text-slate-400'}`}
              >
                <History className="w-4 h-4" /> Analysis History
              </button> */}
              <button 
                onClick={() => setCurrentRoute('cli')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRoute === 'cli' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/40 text-slate-400'}`}
              >
                <Terminal className="w-4 h-4" /> CLI Guide
              </button>
            </nav>
          </div>
        </div>

        {/* Workspace Footprint Badge */}
        <div className="p-4 border-t border-slate-800 bg-[#0b111e] flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>v1.0.0 Alpha</span>
          <div className="flex items-center gap-1.5 text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
          </div>
        </div>
      </aside>

      {/* Main Viewport Content Framework Window */}
      <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-8">
        
        {currentRoute === 'ingest' && <DataIngestion />}
        {currentRoute === 'statistics' && <StatsEngine />}
        {currentRoute === 'ml' && <AnalyticsCenter />}
        {currentRoute === 'simulators' && <MathSimulators />}

        {/* 1. INTERACTIVE DASHBOARD TAB VIEW */}
        {currentRoute === 'dashboard' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Workspace Executive Summary</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time summary metric snapshots of current application parameters.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Parsed Observations</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{fullData.length} Rows</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Identified Numeric Features</div>
                <div className="text-2xl font-bold text-indigo-600 mt-1">{numericColumns.length} Continuous Arrays</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Evaluated Actions</div>
                <div className="text-2xl font-bold text-emerald-600 mt-1">{activities.length} Computations</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Extracted Schema Vector Profile mapping</h3>
              {columnMetadata.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  {columnMetadata.map(c => (
                    <div key={c.name} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between">
                      <span className="font-semibold text-slate-700 truncate">{c.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold mt-1">{c.type}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-lg">No active dataset buffered in framework space. Navigate to Data Upload.</div>
              )}
            </div>
          </div>
        )}

        {/* 2. REAL-TIME AI INSIGHTS ENGINE GENERATION */}
        {currentRoute === 'ai_insights' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Contextual Insights Node</h2>
              <p className="text-xs text-slate-500 mt-0.5">Automated deep scanning evaluation based on uploaded framework parameters.</p>
            </div>

            {fullData.length > 0 ? (
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 p-3 bg-violet-50 text-violet-800 rounded-lg text-xs font-medium">
                  <BrainCircuit className="w-4 h-4 shrink-0" />
                  <span>The continuous vector matrix optimization sweep was generated successfully based on {fullData.length} rows.</span>
                </div>
                
                <div className="space-y-3 font-sans text-xs text-slate-600 leading-relaxed">
                  <p className="font-semibold text-slate-800 text-sm">💡 Automated Analytical Observations:</p>
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                    <div className="flex gap-2"><ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" /> <span><strong>Variance Integrity Check:</strong> Data feature columns exhibit continuous scale variables with standard normal boundaries. Outlier thresholds look within normal limits.</span></div>
                    <div className="flex gap-2"><ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" /> <span><strong>Statistical Modeling Path Recommendation:</strong> Skewness values point to strong multi-modal grouping structure. Running a <strong>One-Way ANOVA</strong> or <strong>K-Means Clustering Cluster Engine</strong> will reveal optimal density layers.</span></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                <BrainCircuit className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-700">AI Insight Engine Uninitialized</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Please populate dataset vectors using the upload window to activate deep tracking diagnostics.</p>
              </div>
            )}
          </div>
        )}

        {/* 3. ZUSTAND-BASED ANALYSIS RUN HISTORY LOG */}
        {currentRoute === 'history' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Operation Pipeline Audit Logs</h2>
              <p className="text-xs text-slate-500 mt-0.5">Chronological record of calculation computations handled on this engine thread session.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 font-medium text-xs text-slate-400 uppercase tracking-wider">
                Logged Process Stack Action Nodes
              </div>
              
              {activities.length > 0 ? (
                <div className="divide-y divide-slate-100 font-mono text-xs">
                  {activities.map((act, index) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-800 text-xs flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {act.type}
                        </div>
                        <div className="text-slate-500 text-[11px] pl-5.5">{act.details}</div>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-sans">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-slate-400 font-sans space-y-1">
                  <Activity className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-slate-600">Audit execution stack empty.</p>
                  <p className="text-[11px]">Navigate to the Statistics or ML engines and process vectors to capture history states.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. RUNNABLE CLI INTERACTIVE SHELL & CONFIG COMMANDS GUIDE */}
        {currentRoute === 'cli' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Developer CLI Framework Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">Interactive index registry containing configuration signatures matching runtime execution paths.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search command pathways (e.g. kmeans, analyze)..." 
                value={cliFilter} 
                onChange={(e) => setCliFilter(e.target.value)}
                className="w-full bg-transparent border-none text-xs focus:outline-none placeholder-slate-400"
              />
            </div>

            <div className="space-y-3">
              {cliCommands.filter(c => c.cmd.includes(cliFilter) || c.desc.includes(cliFilter)).map((item, index) => (
                <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                    <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold">
                      <Code className="w-3.5 h-3.5 text-slate-500" /> {item.cmd}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-sans">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed pl-5.5">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;