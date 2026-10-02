import React, { useState } from 'react';
import { AndroidRachaScreen } from './components/AndroidRachaScreen';
import { KotlinCodeViewer } from './components/KotlinCodeViewer';
import { AndroidPhoneFrame } from './components/AndroidPhoneFrame';
import { Smartphone, Code, Maximize2, Minimize2, Download, Zap, Shield, WifiOff, Flame } from 'lucide-react';
import { KOTLIN_CODEBASE } from './data/kotlinCodebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'app' | 'code'>('app');
  const [useDeviceFrame, setUseDeviceFrame] = useState<boolean>(true);

  const handleDownloadAllZipNotice = () => {
    // Downloads all Kotlin files as text files or combined bundle
    const bundleText = KOTLIN_CODEBASE.map(file => {
      return `=========================================\nARCHIVO: ${file.name}\nRUTA: ${file.path}\nDESCRIPCIÓN: ${file.description}\n=========================================\n\n${file.content}\n\n`;
    }).join('\n');

    const blob = new Blob([bundleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'RACHA_Android_Jetpack_Compose_Project.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 flex flex-col font-sans">
      {/* 
        Top Navigation Bar following Frontend Design Constitution:
        Zone 1: Brand title
        Zone 2: Tab navigation links
        Zone 3: Actions
      */}
      <header className="sticky top-0 z-40 bg-[#090B12]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Zone 1: Single text element brand wordmark */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-widest text-[#00E676] text-glow-neon">
            RACHA
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 border-l border-slate-800 pl-2">
            Android · Jetpack Compose
          </span>
        </div>

        {/* Zone 2: Navigation Links / Segmented Switcher */}
        <nav className="flex items-center gap-1 bg-[#101422] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('app')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'app'
                ? 'bg-[#00E676] text-[#06170F] shadow-[0_0_15px_rgba(0,230,118,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone size={14} />
            <span>App Android</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'code'
                ? 'bg-[#00E676] text-[#06170F] shadow-[0_0_15px_rgba(0,230,118,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code size={14} />
            <span>Código Kotlin</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          {activeTab === 'app' && (
            <button
              onClick={() => setUseDeviceFrame(!useDeviceFrame)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
              title={useDeviceFrame ? "Ver sin marco de teléfono" : "Ver con marco de teléfono Android"}
            >
              {useDeviceFrame ? (
                <>
                  <Maximize2 size={13} />
                  <span>Sin Marco</span>
                </>
              ) : (
                <>
                  <Minimize2 size={13} />
                  <span>Con Marco</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleDownloadAllZipNotice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-bold transition-colors whitespace-nowrap"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Exportar Código</span>
            <span className="sm:hidden">Exportar</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'app' ? (
          <div className="w-full flex flex-col items-center">
            {/* Context callout bar */}
            <div className="w-full max-w-md mb-2 flex items-center justify-between text-xs text-slate-400 px-2">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Flame size={14} className="fill-emerald-400" /> Modo Oscuro Neón
              </span>
              <span className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-slate-400">
                  <WifiOff size={12} className="text-cyan-400" /> Sin internet
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Shield size={12} className="text-emerald-400" /> Cero anuncios
                </span>
              </span>
            </div>

            {/* Android Device Presentation */}
            <AndroidPhoneFrame isFramed={useDeviceFrame}>
              <AndroidRachaScreen />
            </AndroidPhoneFrame>
          </div>
        ) : (
          <div className="w-full h-[780px]">
            <KotlinCodeViewer />
          </div>
        )}
      </main>

      {/* Bottom informational summary */}
      <footer className="border-t border-slate-900 bg-[#06070B] py-3 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400">RACHA</span>
          <span>·</span>
          <span>App Android en Kotlin con Jetpack Compose</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Contador consecutivo</span>
          <span>·</span>
          <span>Botón «Hoy sí estudié»</span>
          <span>·</span>
          <span>Últimos 7 días</span>
          <span>·</span>
          <span>Mensajes motivadores</span>
        </div>
      </footer>
    </div>
  );
}
