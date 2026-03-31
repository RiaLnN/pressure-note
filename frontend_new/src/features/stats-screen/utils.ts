import type { PressureGroup, PressureGroupWeekly, PressureRead } from '../../api/apiTypes';

export function round(n: number) {
  return Math.round(n);
}

export function avg(values: number[]) {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function flattenHistory(history: PressureGroup[]): PressureRead[] {
  return history.flatMap((g) => g.measurements ?? []);
}

export function dailyAveragesFromHistory(history: PressureGroup[]) {
  // Возвращаем точки в хронологическом порядке (старые -> новые)
  const days = [...history].reverse();
  return days.map((g) => {
    const ms = g.measurements ?? [];
    const sysAvg = avg(ms.map((m) => m.sys));
    const diaAvg = avg(ms.map((m) => m.dia));
    return {
      date: g.date,
      sys: sysAvg != null ? round(sysAvg) : null,
      dia: diaAvg != null ? round(diaAvg) : null,
      count: ms.length,
    };
  });
}

export function dailyAveragesFromWeek(week: PressureGroupWeekly | null) {
  const days = week?.days ?? [];
  return days.map((d) => ({
    date: d.date,
    sys: d.average?.sys ?? null,
    dia: d.average?.dia ?? null,
    count: d.measurements?.length ?? 0,
  }));
}

