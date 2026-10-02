import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Check, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  WifiOff, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  RotateCcw,
  Zap
} from 'lucide-react';
import { 
  formatDateToIso, 
  getLast7Days, 
  calculateConsecutiveStreak, 
  formatFriendlyDate, 
  parseIsoDate,
  getYesterdayIso
} from '../utils/dateUtils';
import { MOTIVATIONAL_QUOTES, getRandomQuoteIndex } from '../utils/quotes';
import { soundManager } from '../utils/sound';
import { NeonParticles } from './NeonParticles';

const STORAGE_KEY = 'racha_android_storage_v1';

export const AndroidRachaScreen: React.FC = () => {
  // Current active date in the app (defaults to real today, can be shifted in simulation mode)
  const [currentDateIso, setCurrentDateIso] = useState<string>(() => formatDateToIso(new Date()));
  
  // History of studied dates (YYYY-MM-DD)
  const [studiedDates, setStudiedDates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.studiedDates)) {
          return parsed.studiedDates;
        }
      }
    } catch {
      // fallback
    }
    // Default initial seed: yesterday was studied to showcase an active streak!
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

    return [formatDateToIso(dayBeforeYesterday), formatDateToIso(yesterday)];
  });

  // Current quote index
  const [quoteIndex, setQuoteIndex] = useState<number>(() => getRandomQuoteIndex());
  
  // Sound enabled
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Particles trigger
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  
  // Simulator drawer open/closed
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);

  // Synchronize sound state
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  // Save to local storage whenever studiedDates change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        studiedDates,
        lastUpdated: new Date().toISOString()
      }));
    } catch {
      // ignore
    }
  }, [studiedDates]);

  // Streak calculations
  const streak = useMemo(() => {
    return calculateConsecutiveStreak(studiedDates, currentDateIso);
  }, [studiedDates, currentDateIso]);

  const hasStudiedToday = useMemo(() => {
    return studiedDates.includes(currentDateIso);
  }, [studiedDates, currentDateIso]);

  const last7Days = useMemo(() => {
    return getLast7Days(currentDateIso, studiedDates);
  }, [currentDateIso, studiedDates]);

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex] || MOTIVATIONAL_QUOTES[0];

  // Handler for primary button «Hoy sí estudié»
  const handleStudyToday = () => {
    if (hasStudiedToday) {
      soundManager.playTap();
      return;
    }

    soundManager.playStreakSuccess();
    setShowCelebration(true);

    // Add today to studied dates
    setStudiedDates(prev => {
      if (prev.includes(currentDateIso)) return prev;
      return [...prev, currentDateIso];
    });

    // Advance to a new distinct quote
    setQuoteIndex(prev => getRandomQuoteIndex(prev));
  };

  // Switch to another quote
  const handleNextQuote = () => {
    soundManager.playTap();
    setQuoteIndex(prev => getRandomQuoteIndex(prev));
  };

  // Toggle a specific day in the 7-day row
  const toggleDayStatus = (dateStr: string) => {
    soundManager.playTap();
    setStudiedDates(prev => {
      if (prev.includes(dateStr)) {
        return prev.filter(d => d !== dateStr);
      } else {
        return [...prev, dateStr];
      }
    });
  };

  // Simulator actions
  const simulateAdvanceOneDay = () => {
    soundManager.playTap();
    const curr = parseIsoDate(currentDateIso);
    curr.setDate(curr.getDate() + 1);
    setCurrentDateIso(formatDateToIso(curr));
  };

  const simulateFastForwardTwoDays = () => {
    soundManager.playTap();
    const curr = parseIsoDate(currentDateIso);
    curr.setDate(curr.getDate() + 2);
    setCurrentDateIso(formatDateToIso(curr));
  };

  const simulateResetToRealToday = () => {
    soundManager.playTap();
    setCurrentDateIso(formatDateToIso(new Date()));
  };

  const simulateClearData = () => {
    soundManager.playTap();
    setStudiedDates([]);
  };

  const simulateFill7DayStreak = () => {
    soundManager.playTap();
    const curr = parseIsoDate(currentDateIso);
    const newDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(curr);
      d.setDate(curr.getDate() - i);
      newDates.push(formatDateToIso(d));
    }
    setStudiedDates(newDates);
  };

  return (
    <div className="relative w-full min-h-full flex flex-col justify-between bg-[#08090E] text-slate-100 p-5 select-none overflow-x-hidden">
      {/* Canvas celebration particles */}
      <NeonParticles active={showCelebration} onComplete={() => setShowCelebration(false)} />

      {/* Top Section: App Bar & Badges */}
      <header className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-wider text-[#00E676] text-glow-neon">
              RACHA
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              OFFLINE
            </span>
          </div>
          <p className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase mt-0.5">
            Hábitos de Estudio Imparables
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
            title={soundEnabled ? "Silenciar efectos hápticos" : "Activar sonido háptico"}
            aria-label="Alternar sonido"
          >
            {soundEnabled ? <Volume2 size={16} className="text-emerald-400" /> : <VolumeX size={16} />}
          </button>

          {/* Simulator button */}
          <button
            onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-300 transition-colors"
            title="Herramientas de simulación de fecha"
            aria-label="Abrir simulador"
          >
            <Calendar size={16} className={isSimulatorOpen ? "text-cyan-400" : ""} />
          </button>
        </div>
      </header>

      {/* Simulator Sheet (if toggled) */}
      <AnimatePresence>
        {isSimulatorOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles size={14} /> Simulador de Fechas (Para pruebas)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentDateIso}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2.5">
              Probá cómo responde la racha al cambiar de día sin esperar 24 horas:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={simulateAdvanceOneDay}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-center font-medium transition-colors"
              >
                +1 Día (Mañana)
              </button>
              <button
                onClick={simulateFastForwardTwoDays}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-amber-500/30 text-center font-medium transition-colors"
              >
                +2 Días (Saltar día)
              </button>
              <button
                onClick={simulateFill7DayStreak}
                className="py-1.5 px-2 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 rounded border border-emerald-500/40 text-center font-medium transition-colors"
              >
                Llenar racha 7 días
              </button>
              <button
                onClick={simulateResetToRealToday}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-center font-medium transition-colors"
              >
                Volver a Hoy Real
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="my-auto py-4 flex flex-col items-center gap-5 w-full">
        
        {/* 1. Giant Streak Counter (Hero Display) */}
        <div className="relative w-full rounded-3xl p-6 bg-gradient-to-b from-[#121623] to-[#0A0D14] border border-emerald-500/30 shadow-[0_0_40px_rgba(0,230,118,0.12)] flex flex-col items-center justify-center text-center">
          
          {/* Subtle neon glow backplate */}
          <div className="absolute inset-0 rounded-3xl bg-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

          {/* Flame Icon with Pulse */}
          <motion.div 
            animate={{ 
              scale: streak > 0 ? [1, 1.12, 1] : 1,
              rotate: streak > 0 ? [0, -3, 3, 0] : 0
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-1 ${
              streak > 0 
                ? 'bg-emerald-500/20 text-[#00E676] border border-emerald-500/40 shadow-[0_0_20px_rgba(0,230,118,0.3)]' 
                : 'bg-slate-800/60 text-slate-500 border border-slate-700'
            }`}
          >
            <Flame size={32} className={streak > 0 ? "fill-emerald-400" : ""} />
          </motion.div>

          {/* Big Neon Number */}
          <div className="relative">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={streak}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.9 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="text-7xl sm:text-8xl font-black font-mono tracking-tighter text-[#00E676] text-glow-neon leading-none"
              >
                {streak}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          <span className="text-sm font-extrabold tracking-[0.2em] text-slate-300 uppercase mt-2">
            {streak === 1 ? 'Día Consecutivo' : 'Días Consecutivos'}
          </span>

          {/* Status Kicker */}
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
            {hasStudiedToday ? (
              <span className="flex items-center gap-1 text-[#00E5FF] text-glow-cyan">
                <Check size={14} className="stroke-[3]" /> ¡Racha asegurada hoy!
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400">
                <Zap size={14} className="fill-amber-400" /> Falta registrar el estudio de hoy
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400 mt-1">
            {formatFriendlyDate(currentDateIso)}
          </div>
        </div>

        {/* 2. Big Action Button «Hoy sí estudié» */}
        <div className="w-full">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleStudyToday}
            className={`w-full py-4 px-6 rounded-2xl font-black text-lg tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden ${
              hasStudiedToday
                ? 'bg-slate-900 border-2 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(0,230,118,0.2)]'
                : 'bg-gradient-to-r from-[#00E676] via-[#10B981] to-[#00E5FF] text-[#06170F] shadow-[0_0_35px_rgba(0,230,118,0.45)] hover:shadow-[0_0_45px_rgba(0,230,118,0.6)] cursor-pointer'
            }`}
          >
            {hasStudiedToday ? (
              <>
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check size={18} className="text-[#00E676] stroke-[3]" />
                </div>
                <span>¡Hoy sí estudiaste!</span>
              </>
            ) : (
              <>
                <Zap size={22} className="fill-[#06170F] text-[#06170F]" />
                <span className="tracking-wider">Hoy sí estudié</span>
              </>
            )}
          </motion.button>

          {hasStudiedToday && (
            <div className="text-center mt-2">
              <button
                onClick={() => toggleDayStatus(currentDateIso)}
                className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors underline decoration-slate-700 underline-offset-4"
              >
                (Hacer clic para deshacer el registro de hoy)
              </button>
            </div>
          )}
        </div>

        {/* 3. Últimos 7 Días */}
        <div className="w-full rounded-2xl bg-[#111520] border border-slate-800/80 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black tracking-wider text-slate-300 uppercase">
              Últimos 7 Días
            </span>
            <span className="text-[11px] text-slate-400">
              {studiedDates.length} días totales estudiados
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {last7Days.map(day => {
              const isDone = day.status === 'completed' || day.status === 'today-completed';
              return (
                <button
                  key={day.dateStr}
                  onClick={() => toggleDayStatus(day.dateStr)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                    day.isToday
                      ? 'border-cyan-400/80 bg-cyan-950/20'
                      : isDone
                      ? 'border-emerald-500/40 bg-emerald-950/20'
                      : 'border-slate-800/90 bg-slate-900/60'
                  }`}
                  title={`${day.dateStr}: ${isDone ? 'Estudiado' : 'No registrado'}. Clic para alternar.`}
                >
                  <span className={`text-[10px] font-bold ${
                    day.isToday ? 'text-cyan-400 font-extrabold' : 'text-slate-400'
                  }`}>
                    {day.dayName}
                  </span>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center my-1 font-bold text-xs ${
                    isDone
                      ? 'bg-[#00E676]/20 text-[#00E676] border border-emerald-400 shadow-[0_0_12px_rgba(0,230,118,0.35)]'
                      : day.isToday
                      ? 'bg-slate-800 text-slate-200 border border-cyan-500/40'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-800'
                  }`}>
                    {isDone ? (
                      <Check size={15} className="stroke-[3]" />
                    ) : (
                      day.dayNumber
                    )}
                  </div>

                  <span className="text-[9px] text-slate-400 font-medium">
                    {day.isToday ? 'Hoy' : day.monthName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Mensaje Motivador Distinto Cada Vez */}
        <div className="w-full rounded-2xl bg-gradient-to-br from-[#121624] to-[#0D101A] border border-amber-500/25 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              Mensaje Motivador
            </span>
            <button
              onClick={handleNextQuote}
              className="text-[11px] font-semibold text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-800/60 border border-slate-750"
              title="Obtener otro mensaje motivador"
            >
              <RefreshCw size={12} />
              <span>Cambiar</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote.quote}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-medium text-slate-200 italic leading-relaxed">
                «{currentQuote.quote}»
              </p>
              <p className="text-xs font-semibold text-[#00E676] mt-2">
                — {currentQuote.author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Bottom Reassurance Footer: Sin anuncios, sin conexión */}
      <footer className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-400">
          <WifiOff size={13} className="text-cyan-400" />
          <span>Sin internet</span>
          <span className="text-slate-600">·</span>
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>Cero publicidad</span>
        </div>
        <div className="text-slate-400 font-mono text-[10px]">
          v1.0.0
        </div>
      </footer>
    </div>
  );
};
