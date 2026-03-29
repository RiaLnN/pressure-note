import { useEffect, useMemo, useState } from 'react';
import { MeasurementsService } from '../../../api/services/measurementsService';
import { MAIN_SCREEN_CONFIG } from '../config';
import { toYyyyMmDd } from '../../../utils/date';
import { getPressureStatus } from '../../../utils/pressure';
import { useUserStore } from '../../../store/useUserStore';
import type { Measurement } from '../../../types/measurements';
import type { PressureGroupWeekly, PressureRead } from '../../../api/apiTypes';

export interface MainScreenData {
  lastMeasurement: Measurement | null;
  week: PressureGroupWeekly | null;
  recent: Array<Measurement & { description?: string | null }>;
}

function mapPressureToMeasurement(p: PressureRead, target: { sys: number; dia: number }): Measurement & { description?: string | null } {
  return {
    id: p.id,
    sys: p.sys,
    dia: p.dia,
    created_at: p.created_at,
    status: getPressureStatus({ sys: p.sys, dia: p.dia, target }),
    description: p.description ?? null,
  };
}

export function useMainScreenData() {
  const target = useUserStore((s) => s.settings.target_pressure);

  const [data, setData] = useState<MainScreenData>({
    lastMeasurement: null,
    week: null,
    recent: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const today = useMemo(() => toYyyyMmDd(new Date()), []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const [measurements, week, history] = await Promise.all([
          MeasurementsService.list(),
          MeasurementsService.week({ date: today }),
          MeasurementsService.history({ limit: MAIN_SCREEN_CONFIG.history.limit }),
        ]);

        if (!isMounted) return;

        const last = measurements[0] ? mapPressureToMeasurement(measurements[0], target) : null;

        const recentFlat = history
          .flatMap((g) => g.measurements)
          .slice(0, MAIN_SCREEN_CONFIG.history.limit)
          .map((m) => mapPressureToMeasurement(m, target));

        setData({
          lastMeasurement: last,
          week,
          recent: recentFlat,
        });
      } catch (e) {
        if (!isMounted) return;
        setError(e instanceof Error ? e : new Error('Unknown error'));
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [target, today]);

  return { data, isLoading, error };
}

