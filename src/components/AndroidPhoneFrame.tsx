import React from 'react';
import { WifiOff, BatteryMedium } from 'lucide-react';

interface AndroidPhoneFrameProps {
  children: React.ReactNode;
  isFramed: boolean;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({ children, isFramed }) => {
  if (!isFramed) {
    return (
      <div className="w-full max-w-md mx-auto min-h-[720px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        {children}
      </div>
    );
  }

  return (
    <div className="relative mx-auto my-4 w-[380px] sm:w-[410px] min-h-[820px] bg-[#07080c] rounded-[50px] p-3 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,230,118,0.1)] border-[6px] border-[#1C202F] flex flex-col justify-between">
      {/* Smartphone Outer Side Buttons (Visual polish) */}
      <div className="absolute -left-[9px] top-28 w-[3px] h-12 bg-slate-700 rounded-l" />
      <div className="absolute -left-[9px] top-44 w-[3px] h-12 bg-slate-700 rounded-l" />
      <div className="absolute -right-[9px] top-32 w-[3px] h-16 bg-slate-700 rounded-r" />

      {/* Screen container */}
      <div className="relative w-full flex-1 bg-[#08090E] rounded-[42px] overflow-hidden flex flex-col border border-slate-800/80">
        
        {/* Android Status Bar */}
        <div className="h-8 w-full px-6 flex items-center justify-between text-xs text-slate-400 select-none bg-[#08090E] shrink-0 z-30">
          {/* Clock */}
          <span className="font-semibold text-slate-300 text-[11px] font-mono">
            09:41
          </span>

          {/* Camera Punch Hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-[#050608] border border-slate-800/80 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-950" />
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-2 text-slate-400">
            <span title="Modo sin conexión">
              <WifiOff size={12} className="text-cyan-400" />
            </span>
            <BatteryMedium size={14} className="text-emerald-400" />
            <span className="text-[10px] font-mono text-slate-400">92%</span>
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>

        {/* Android Gesture Navigation Pill */}
        <div className="h-5 w-full bg-[#08090E] flex items-center justify-center shrink-0">
          <div className="w-28 h-1 rounded-full bg-slate-700" />
        </div>
      </div>
    </div>
  );
};
