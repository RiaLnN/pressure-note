import React from 'react';
import { Card } from '../../../components/ui/Card';
import type { Measurement } from '../../../types/measurements';
import { StatusBadge } from './StatusBadge';
import { MAIN_SCREEN_TEXT } from '../constants';
import { formatRelativeDayLabel, formatTimeHHmm } from '../../../utils/date';
import { Droplet } from 'lucide-react';
import { getPressureStatus } from '../../../utils/pressure';
import { useUserStore } from '../../../store/useUserStore';
import { PRESSURE_STATUS_STYLES } from '../../../utils/pressureStatus';
export const RecentRecordsCard: React.FC<{
  items: Array<Measurement & { description?: string | null }>;
  onAll?: () => void;
}> = ({ items, onAll }) => {
  const targetPressure = useUserStore((state) => state.settings.target_pressure);
  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-text-primary">{MAIN_SCREEN_TEXT.recent.title}</h2>
        <button
          type="button"
          onClick={onAll}
          className="text-sm font-medium text-accent hover:text-accent-strong transition-colors"
        >
          {MAIN_SCREEN_TEXT.recent.all}
        </button>
      </header>

      {items.length === 0 ? (
        <Card className="p-5">
          <p className="text-sm text-text-soft">{MAIN_SCREEN_TEXT.recent.empty}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((m) => {
            const day = formatRelativeDayLabel(m.created_at);
            const time = formatTimeHHmm(m.created_at);
            const status = getPressureStatus({ sys: m.sys, dia: m.dia, target: targetPressure });
            const statusStyles = PRESSURE_STATUS_STYLES[status];
            return (
              <Card key={m.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-2xl border border-border-subtle/60 flex items-center justify-center ${statusStyles.bg}`}>
                    <Droplet className="size-6 text-accent" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-text-primary tabular-nums">
                        {m.sys} / {m.dia}
                      </div>
                      <StatusBadge status={m.status} />
                    </div>
                    <div className="mt-1 text-xs text-text-soft">
                      {day} · {time}
                    </div>
                    {m.description ? (
                      <div className="mt-2 text-xs text-text-muted line-clamp-2">{m.description}</div>
                    ) : null}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};

