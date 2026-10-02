import { DayRecord, DayStatus } from '../types';

export function formatDateToIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(isoStr: string): Date {
  const [y, m, d] = isoStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getYesterdayIso(todayIso: string): string {
  const date = parseIsoDate(todayIso);
  date.setDate(date.getDate() - 1);
  return formatDateToIso(date);
}

const DAY_NAMES = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
const MONTH_NAMES = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
];

export function getLast7Days(todayIso: string, history: string[]): DayRecord[] {
  const result: DayRecord[] = [];
  const baseDate = parseIsoDate(todayIso);
  const historySet = new Set(history);

  // 6 days before today up to today (total 7 days)
  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);
    const dateStr = formatDateToIso(d);
    const isToday = i === 0;
    const hasStudied = historySet.has(dateStr);

    let status: DayStatus = 'missed';
    if (isToday) {
      status = hasStudied ? 'today-completed' : 'today-pending';
    } else {
      status = hasStudied ? 'completed' : 'missed';
    }

    result.push({
      dateStr,
      dayName: DAY_NAMES[d.getDay()],
      dayNumber: d.getDate(),
      monthName: MONTH_NAMES[d.getMonth()],
      status,
      isToday
    });
  }

  return result;
}

export function calculateConsecutiveStreak(history: string[], todayIso: string): number {
  if (!history || history.length === 0) return 0;
  
  const historySet = new Set(history);
  const hasStudiedToday = historySet.has(todayIso);
  const yesterdayIso = getYesterdayIso(todayIso);
  const hasStudiedYesterday = historySet.has(yesterdayIso);

  // If neither today nor yesterday has study records, the streak is 0
  if (!hasStudiedToday && !hasStudiedYesterday) {
    return 0;
  }

  // Count backwards starting from today (if studied today) or from yesterday (if waiting for today)
  let count = 0;
  let cursor = parseIsoDate(hasStudiedToday ? todayIso : yesterdayIso);

  while (true) {
    const cursorStr = formatDateToIso(cursor);
    if (historySet.has(cursorStr)) {
      count++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return count;
}

export function formatFriendlyDate(isoStr: string): string {
  const date = parseIsoDate(isoStr);
  const dayNameFull = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][date.getDay()];
  const monthNameFull = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ][date.getMonth()];
  return `${dayNameFull} ${date.getDate()} de ${monthNameFull}`;
}
