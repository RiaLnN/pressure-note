import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { MeasurementsService } from '../../api/services/measurementsService';
import type { PressureGroup, PressureRead } from '../../api/apiTypes';
import type { StatsPeriod } from './types';
import { STATS_TEXT } from './constants';
import { PeriodTabs } from './components/PeriodTabs';
import { KpiCard } from './components/KpiCard';
import { DynamicsChartCard } from './components/DynamicsChartCard';
import { DistributionCard } from './components/DistributionCard';
import { TrendsCard } from './components/TrendsCard';
import { toYyyyMmDd, formatWeekdayShort, formatMonthShort } from '../../utils/date';
import { dailyAveragesFromHistory, flattenHistory, avg, round } from './utils';
import { useUserStore } from '../../store/useUserStore';
import { MAIN_SCREEN_CONFIG } from '../main-screen/config';

export const StatsScreen: React.FC = () => {
  const target = useUserStore((s) => s.settings.target_pressure);

  const [period, setPeriod] = useState<StatsPeriod>('7d');
  const [stats, setStats] = useState<PressureGroup[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => toYyyyMmDd(new Date()), []);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        if (period === '7d') {
          const data = await MeasurementsService.stats({ period: 'week' });
          if (!mounted) return;
          setStats(data);
        } else if (period === '30d') {
          const data = await MeasurementsService.stats({ period: 'month' });
          if (!mounted) return;
          setStats(data);
        } else {
          const data = await MeasurementsService.stats({ period: 'year' });
          if (!mounted) return;
          setStats(data);
        }
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [period, today]);

  const dataset = useMemo(() => {
    if (period === '7d') {
      const points = dailyAveragesFromHistory(stats);
      const labels = points.map((p) => formatWeekdayShort(p.date));
      const measurements = stats.flatMap((d) => d.measurements ?? []);
      return { points, labels, measurements };
    }

    if (period === '30d') {
      const points = dailyAveragesFromHistory(stats);
      const labels = points.slice(-7).map((p) => formatWeekdayShort(p.date));
      const measurements = flattenHistory(stats);
      return { points, labels, measurements };
    }
    if (period === '1y') {
      const points = dailyAveragesFromHistory(stats);
      const labels = points.map((p) => formatMonthShort(p.date));
      const measurements = flattenHistory(stats);
      return { points, labels, measurements };
    }

    return { points: [] as Array<{ date: string; sys: number | null; dia: number | null; count: number }>, labels: [], measurements: [] as PressureRead[] };
  }, [period, stats]);

  const kpi = useMemo(() => {
    const ms = dataset.measurements;
    const sysAvg = avg(ms.map((m) => m.sys));
    const diaAvg = avg(ms.map((m) => m.dia));
    const maxSys = ms.length ? Math.max(...ms.map((m) => m.sys)) : null;
    const count = ms.length;
    return {
      avgLabel: sysAvg != null && diaAvg != null ? `${round(sysAvg)}/${round(diaAvg)}` : '—',
      maxSysLabel: maxSys != null ? String(maxSys) : '—',
      countLabel: String(count),
    };
  }, [dataset.measurements]);

  const chartPointsFor7Labels = useMemo(() => {
    // Для 30 дней показываем только 7 последних лейблов, но точки можно рисовать все (будет плотнее).
    // В макете плотность умеренная, поэтому ограничим:
    const points = dataset.points;
    if (period === '30d') return points.slice(-7).map(({ date, sys, dia }) => ({ date, sys, dia }));
    return points.map(({ date, sys, dia }) => ({ date, sys, dia }));
  }, [dataset.points, period]);

  return (
    <div className="min-h-screen bg-bg-app text-text-primary">
      <div className="max-w-md mx-auto px-4 pt-6 pb-24 space-y-5">
        <header className="space-y-1">
          <div className="text-sm text-text-soft">Аналітика</div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight">{STATS_TEXT.title}</h1>
            <div className="hidden">
              <Chip label="Бер 2026" selected onClick={() => {}} />
            </div>
          </div>
        </header>

        <PeriodTabs value={period} onChange={setPeriod} />

        {error ? (
          <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm text-text-secondary">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-3 gap-3">
          <KpiCard
            title={STATS_TEXT.kpi.average}
            value={kpi.avgLabel}
            subtitle={MAIN_SCREEN_CONFIG.units.pressure}
            accent="green"
          />
          <KpiCard
            title={STATS_TEXT.kpi.maxSys}
            value={kpi.maxSysLabel}
            subtitle={STATS_TEXT.kpi.countSuffix}
            accent="orange"
          />
          <KpiCard
            title={STATS_TEXT.kpi.count}
            value={kpi.countLabel}
            subtitle={STATS_TEXT.kpi.countSuffix}
            accent="neutral"
          />
        </div>

        <DynamicsChartCard points={chartPointsFor7Labels} labels={dataset.labels.length ? dataset.labels : new Array(7).fill('')} />

        <div className="grid grid-cols-1 gap-4">
          <DistributionCard measurements={dataset.measurements} target={target} disabled={isLoading} />
          <TrendsCard disabled={isLoading} />
        </div>

        {isLoading ? (
          <Card className="p-4">
            <div className="text-sm text-text-soft">Завантаження…</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
};