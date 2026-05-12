import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { NumberStepper } from '../../../components/ui/NumberStepper';
import { MeasurementsService } from '../../../api/services/measurementsService';
import { useUserStore } from '../../../store/useUserStore';
import { getPressureStatus } from '../../../utils/pressure';
import { PRESSURE_STATUS_STYLES } from '../../../utils/pressureStatus';
import { formatRelativeDayLabel, formatTimeHHmm } from '../../../utils/date';
import { MAIN_SCREEN_TEXT } from '../constants';
import { ADD_MEASUREMENT_CONFIG } from '../config';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

type HandId = (typeof ADD_MEASUREMENT_CONFIG.handOptions)[number]['id'];
type StateId = (typeof ADD_MEASUREMENT_CONFIG.stateOptions)[number]['id'];

export const AddModal = ({ isOpen, onClose, onSaved }: AddModalProps) => {
  const target = useUserStore((s) => s.settings.target_pressure);

  const [sys, setSys] = useState(target.sys);
  const [dia, setDia] = useState(target.dia);

  const [hand, setHand] = useState<HandId>(ADD_MEASUREMENT_CONFIG.handOptions[0].id);
  const [state, setState] = useState<StateId>(ADD_MEASUREMENT_CONFIG.stateOptions[0].id);
  const [comment, setComment] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Дата/время “снимка” для заголовка и создаваемого измерения.
  const createdAt = useMemo(() => {
    if (!isOpen) return null;
    return new Date();
  }, [isOpen]);

  const createdAtIso = createdAt ? createdAt.toISOString() : new Date().toISOString();

  const subtitle = useMemo(() => {
    const iso = createdAtIso;
    return `${formatRelativeDayLabel(iso)}, ${formatTimeHHmm(iso, 'uk-UA')}`;
  }, [createdAtIso]);

  const pressureStatus = useMemo(() => {
    return getPressureStatus({ sys, dia, target });
  }, [sys, dia, target]);

  const statusLabel = ADD_MEASUREMENT_CONFIG.pressureStatusLabels[pressureStatus];
  const statusStyle = PRESSURE_STATUS_STYLES[pressureStatus];

  useEffect(() => {
    if (!isOpen) return;

    setSys(target.sys);
    setDia(target.dia);
    setHand(ADD_MEASUREMENT_CONFIG.handOptions[0].id);
    setState(ADD_MEASUREMENT_CONFIG.stateOptions[0].id);
    setComment('');
    setError(null);
    setIsSubmitting(false);
  }, [isOpen, target.sys, target.dia]);

  const description = useMemo(() => {
    const handLabel = ADD_MEASUREMENT_CONFIG.handOptions.find((h) => h.id === hand)?.label;
    const stateLabel = ADD_MEASUREMENT_CONFIG.stateOptions.find((s) => s.id === state)?.label;

    const parts = [handLabel, stateLabel].filter(Boolean) as string[];
    const trimmed = comment.trim();
    if (trimmed) parts.push(trimmed);

    return parts.length ? parts.join(' / ') : undefined;
  }, [comment, hand, state]);

  const safeClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: { sys: number; dia: number; created_at: string; description?: string | null } = {
        sys,
        dia,
        created_at: createdAtIso,
      };

      if (description) {
        payload.description = description;
      }

      await MeasurementsService.create(payload);
      onSaved?.();
      setIsSubmitting(false);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={safeClose}
      title={MAIN_SCREEN_TEXT.addMeasurementModal.title}
      subtitle={subtitle}
    >
      <div className="space-y-5">
        <section className="space-y-4">
          <div className="text-xs font-semibold tracking-[0.18em] uppercase text-text-soft">
            {MAIN_SCREEN_TEXT.addMeasurementModal.pressureLabel}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberStepper
              label={ADD_MEASUREMENT_CONFIG.stepper.sys.label}
              value={sys}
              min={ADD_MEASUREMENT_CONFIG.stepper.sys.min}
              max={ADD_MEASUREMENT_CONFIG.stepper.sys.max}
              step={ADD_MEASUREMENT_CONFIG.stepper.sys.step}
              onChange={setSys}
            />

            <NumberStepper
              label={ADD_MEASUREMENT_CONFIG.stepper.dia.label}
              value={dia}
              min={ADD_MEASUREMENT_CONFIG.stepper.dia.min}
              max={ADD_MEASUREMENT_CONFIG.stepper.dia.max}
              step={ADD_MEASUREMENT_CONFIG.stepper.dia.step}
              onChange={setDia}
            />
          </div>

          <div className="flex items-center justify-start">
            <span
              className={[
                'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold',
                statusStyle.bg,
                statusStyle.text,
                statusStyle.border,
              ].join(' ')}
            >
              {statusLabel}
            </span>
          </div>
        </section>

        {/* <section className="space-y-3">
          <div className="text-xs font-semibold tracking-[0.18em] uppercase text-text-soft">
            {MAIN_SCREEN_TEXT.addMeasurementModal.stateLabel}
          </div>

          <div className="flex flex-wrap gap-2">
            {ADD_MEASUREMENT_CONFIG.stateOptions.map((opt) => (
              <Chip
                key={opt.id}
                label={opt.label}
                selected={state === opt.id}
                onClick={() => setState(opt.id)}
              />
            ))}
          </div>
        </section> */}

        {error ? (
          <div className="rounded-2xl border border-danger/30 bg-danger/10 p-3 text-sm text-text-secondary">
            {error}
          </div>
        ) : null}

        <Button
          label={MAIN_SCREEN_TEXT.cta.addMeasurement}
          onClick={handleSubmit}
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        />
      </div>
    </Modal>
  );
};