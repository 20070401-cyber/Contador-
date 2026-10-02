import React, { useState } from 'react';
import { KOTLIN_CODEBASE } from '../data/kotlinCodebase';
import { Copy, Check, Download, FileCode, Sparkles } from 'lucide-react';

export const KotlinCodeViewer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = KOTLIN_CODEBASE[selectedFileIndex] || KOTLIN_CODEBASE[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadActiveFile = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0A0C13] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="p-4 bg-[#101420] border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              KOTLIN + JETPACK COMPOSE
            </span>
            <span className="text-xs text-slate-400">
              Android Studio Ready
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Código Fuente del Proyecto Android
          </h2>
          <p className="text-xs text-slate-400">
            {activeFile.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copiado</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copiar {activeFile.name}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadActiveFile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-bold transition-colors"
          >
            <Download size={14} />
            <span>Descargar archivo</span>
          </button>
        </div>
      </div>

      {/* Tabs for files */}
      <div className="flex items-center gap-1 p-2 bg-[#0C0F18] border-b border-slate-800/80 overflow-x-auto text-xs">
        {KOTLIN_CODEBASE.map((file, idx) => (
          <button
            key={file.name}
            onClick={() => setSelectedFileIndex(idx)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono whitespace-nowrap transition-colors ${
              selectedFileIndex === idx
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode size={13} className={selectedFileIndex === idx ? 'text-emerald-400' : 'text-slate-500'} />
            <span>{file.name}</span>
          </button>
        ))}
      </div>

      {/* Path indicator */}
      <div className="px-4 py-2 bg-[#080A0F] border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="truncate">Ruta: {activeFile.path}</span>
        <span className="text-slate-400 shrink-0">100% Offline · Jetpack Compose Material 3</span>
      </div>

      {/* Code Editor view with line numbers */}
      <div className="flex-1 overflow-auto bg-[#07080D] p-4 text-xs font-mono text-slate-200">
        <pre className="leading-relaxed">
          <code>
            {activeFile.content.split('\n').map((line, lineIdx) => (
              <div key={lineIdx} className="table-row hover:bg-slate-800/20">
                <span className="table-cell pr-4 text-right select-none text-slate-400 text-[11px] w-10">
                  {lineIdx + 1}
                </span>
                <span className="table-cell whitespace-pre text-slate-300">
                  {line}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Footer tips */}
      <div className="p-3 bg-[#0E121C] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-cyan-400" />
          <span>Para usar en Android Studio: creá un proyecto Compose vacío y pegá estos archivos.</span>
        </div>
        <span className="text-emerald-400 font-mono text-[11px]">
          Kotlin 2.0+ · Compose 2024.12+
        </span>
      </div>
    </div>
  );
};
