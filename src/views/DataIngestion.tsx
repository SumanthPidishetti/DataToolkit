// src/views/DataIngestion.tsx
import React, { useState, useCallback } from 'react';
import { useDatasetStore } from '../store/useDatasetStore';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, FileText, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

export const DataIngestion: React.FC = () => {
  const { setDataset, fullData, columnMetadata, clearDataset } = useDatasetStore();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setError(null);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setDataset(results.data as Record<string, any>[]);
          } else {
            setError('The CSV file appears to be empty.');
          }
        },
        error: (err) => setError(`CSV Parsing Error: ${err.message}`),
      });
    } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });

          if (jsonData.length > 0) {
            setDataset(jsonData as Record<string, any>[]);
          } else {
            setError('The Excel sheet appears to be empty.');
          }
        } catch (err) {
          setError('Failed to parse Excel file. Ensure it is not corrupted.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError('Unsupported file format. Please upload a .csv, .xlsx, or .xls file.');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-black">Data Ingestion Hub</h2>
        <p className="text-slate-400 mt-1">Upload and schema-parse your datasets locally in browser memory.</p>
      </div>

      {fullData.length === 0 ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all min-h-[350px] glass-panel ${
            isDragging ? 'border-violet-500 bg-violet-500/5' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 mb-4 shadow-xl">
            <Upload className="w-8 h-8 text-violet-400 animate-pulse" />
          </div>
          <p className="text-lg font-medium text-slate-200">Drag and drop your dataset here</p>
          <p className="text-sm text-slate-500 mt-1 mb-6">Supports .csv, .xlsx, .xls up to 50MB</p>
          
          <label className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-xl text-sm shadow-lg shadow-indigo-600/20 cursor-pointer transition-all">
            Browse System Files
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processFile(file);
              }}
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Status & Metadata Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between h-fit">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200">Dataset Active</h3>
                    <p className="text-xs text-slate-400">{fullData.length.toLocaleString()} rows mapped</p>
                  </div>
                </div>
                <button 
                  onClick={clearDataset}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-950 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Column Schema Analyzer */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 max-h-[400px] overflow-y-auto">
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Inferred Column Typings</h4>
              <div className="space-y-2">
                {columnMetadata.map((col) => (
                  <div key={col.name} className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl text-sm">
                    <span className="font-medium text-slate-300 truncate max-w-[160px]">{col.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-md font-mono ${
                        col.type === 'numeric' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        {col.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inline Data Table Preview */}
          <div className="lg:col-span-2 glass-panel rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/50">
                    {columnMetadata.map((col) => (
                      <th key={col.name} className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{col.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {fullData.slice(0, 6).map((row, index) => (
                    <tr key={index} className="hover:bg-slate-900/20 transition-colors">
                      {columnMetadata.map((col) => (
                        <td key={col.name} className="p-4 text-sm text-slate-300 max-w-[180px] truncate">
                          {row[col.name]?.toString() ?? <span className="text-slate-600 font-mono">NaN</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-800/60 bg-slate-950/30 text-xs text-slate-500 font-medium">
              Showing top 6 preview samples of total data arrays evaluated.
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};