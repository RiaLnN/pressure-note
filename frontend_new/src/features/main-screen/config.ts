import type { PressureStatus } from '../../types/measurements';

export const MAIN_SCREEN_CONFIG = {
  history: {
    limit: 5,
  },
  week: {
    pointsCount: 7,
  },
  units: {
    pressure: 'мм рт. ст.',
  },
} as const;

export const ADD_MEASUREMENT_CONFIG = {
  stepper: {
    sys: { min: 60, max: 220, step: 1, label: 'Систолічний' },
    dia: { min: 30, max: 140, step: 1, label: 'Діастолічний' },
  },
  handOptions: [
    { id: 'left', label: 'Ліва' },
    { id: 'right', label: 'Права' },
  ] as const,
  stateOptions: [
    { id: 'calm', label: 'Спокій' },
    { id: 'afterCoffee', label: 'Після кави' },
    { id: 'afterExercise', label: 'Після фізичного' },
    { id: 'afterStress', label: 'Після стресу' },
  ] as const,
  pressureStatusLabels: {
    High: 'Високий',
    Elevated: 'Підвищений',
    Normal: 'Норма',
    Low: 'Низький',
  } satisfies Record<PressureStatus, string>,
} as const;

