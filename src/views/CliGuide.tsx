// src/views/CliGuide.tsx
import React, { useState, useMemo } from 'react';
import { Terminal, Code, Copy, Check, Search, HelpCircle, CommandLineIcon } from 'lucide-react';

interface CliCommand {
  cmd: string;
  desc: string;
  category: 'ingest' | 'statistics' | 'ml' | 'system';
  syntax: string;
  exampleOutput: string;
}

export const CliGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const cliCommands: CliCommand[] = [
    { 
      cmd: "stattoolkit ingest --file dataset.csv", 
      desc: "Uploads and structures a local data matrix stream into the active application engine state.", 
      category: "ingest",
      syntax: "stattoolkit ingest --file <filename.csv|xlsx> [--delimiter ,] [--header true]",
      exampleOutput: "[SUCCESS] Parsed file: dataset.csv\nObservations detected: 14,250 Rows\nFeatures identified: 8 Dimensions (5 Numeric, 3 Categorical)"
    },
    { 
      cmd: "stattoolkit analyze descriptive --col target_variable", 
      desc: "Compiles complete descriptive statistics (Mean, Median, Variance, Skewness) for a target feature vector.", 
      category: "statistics",
      syntax: "stattoolkit analyze descriptive --col <column_name>",
      exampleOutput: "--- DESCRIPTIVE METRIC TARGET: target_variable ---\nMean: 42.185\nMedian: 39.000\nStd Deviation: 14.221\nVariance: 202.236\nSkewness: 0.412 (Right-Tailed)"
    },
    { 
      cmd: "stattoolkit test t-test --col1 group_a --col2 group_b", 
      desc: "Computes an independent two-sample T-test verification over separate continuous variables.", 
      category: "statistics",
      syntax: "stattoolkit test t-test --col1 <numeric_vector_1> --col2 <numeric_vector_2> [--alpha 0.05]",
      exampleOutput: "--- INDEPENDENT TWO-SAMPLE T-TEST ---\nt-Statistic Coordinate: 2.4156\nDegrees of Freedom (df): 198\np-Value: 0.0166\nConclusion: Reject Null Hypothesis at Alpha=0.05. Statistical mean separation verified."
    },
    { 
      cmd: "stattoolkit train kmeans --k 3 --features age,income", 
      desc: "Fits an unsupervised K-Means partitioning model over custom spatial coordinate variables.", 
      category: "ml",
      syntax: "stattoolkit train kmeans --k <clusters_count> --features <comma_separated_columns>",
      exampleOutput: "[ALGORITHM ENGINE - K-MEANS]\nConvergence Optimized in 6 iterations.\nCluster Weights: C0 (n=450), C1 (n=320), C2 (n=230)\nWCSS (Within-Cluster Sum of Squares): 124.85"
    },
    { 
      cmd: "stattoolkit transform pca --components 2", 
      desc: "Applies a covariance matrix calculation for dimensionality reduction and extracts principal component axes.", 
      category: "ml",
      syntax: "stattoolkit transform pca --components <integer_axes_count>",
      exampleOutput: "[PRINCIPAL COMPONENT ANALYSIS]\nPC1 Eigenvalue: 4.125 (Explained Variance: 54.2%)\nPC2 Eigenvalue: 1.892 (Explained Variance: 24.8%)\nTotal Retained Cumulative Variance Matrix: 79.0%"
    },
    { 
      cmd: "stattoolkit system status", 
      desc: "Queries core buffer allocation status parameters and localized RAM telemetry configurations.", 
      category: "system",
      syntax: "stattoolkit system status",
      exampleOutput: "Host Status: Online [Healthy]\nEngine Frame: v1.0.0-Alpha Core\nActive Data Matrix Stack: 1 Allocated Buffer Base\nSandbox Execution Latency: 0.002ms"
    }
  ];

  const filteredCommands = useMemo(() => {
    return cliCommands.filter(c => {
      const matchesSearch = c.cmd.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.syntax.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Title block */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Core Sandbox Command Line Shell Interface</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Programmatic workspace interface interaction vectors. Use these hooks to query system states directly from internal console environments.
        </p>
      </div>

      {/* Control Utility bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text"
            placeholder="Search syntax maps (e.g. kmeans, ingest)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#1f2937] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['all', 'ingest', 'statistics', 'ml', 'system'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-violet-600 text-white shadow-sm' 
                  : 'bg-slate-100 dark:bg-[#1f2937] text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'ml' ? 'Machine Learning' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Commands Render Loop */}
      <div className="grid grid-cols-1 gap-5">
        {filteredCommands.length > 0 ? (
          filteredCommands.map((command, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Header block with Copy option */}
              <div className="bg-slate-50 dark:bg-[#0f1624] px-5 py-3 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-violet-600 dark:text-indigo-400">
                  <Code className="w-4 h-4 text-slate-400" />
                  <span>{command.cmd}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md">
                    {command.category}
                  </span>
                  <button
                    onClick={() => copyToClipboard(command.cmd, idx)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors"
                    title="Copy command input syntax parameters"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Functional description bodies */}
              <div className="p-5 space-y-4 flex-1">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Functional Operation Parameter</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {command.desc}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Formal API Blueprint Flag Map</h4>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 select-all overflow-x-auto">
                    {command.syntax}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Simulated Pipeline Core Trace Return</h4>
                  <pre className="p-3.5 bg-slate-900 dark:bg-slate-950 border border-slate-950 text-[11px] font-mono text-emerald-400 rounded-lg overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                    {command.exampleOutput}
                  </pre>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500 font-mono">No matching console signature sequences matched your query arguments.</p>
          </div>
        )}
      </div>
    </div>
  );
};