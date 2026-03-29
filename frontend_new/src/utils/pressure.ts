import type { PressureStatus } from '../types/measurements';

export interface TargetPressure {
  sys: number;
  dia: number;
}

export function getPressureStatus(params: {
  sys: number;
  dia: number;
  target: TargetPressure;
}): PressureStatus {
  const { sys, dia, target } = params;

  const highSys = target.sys + 20;
  const highDia = target.dia + 15;

  const elevatedSys = target.sys + 10;
  const elevatedDia = target.dia + 7;

  const normalSys = target.sys - 10;
  const normalDia = target.dia - 10;

  if (sys >= highSys || dia >= highDia) return 'High';
  if (sys >= elevatedSys || dia >= elevatedDia) return 'Elevated';
  if (sys >= normalSys && dia >= normalDia) return 'Normal';
  return 'Low';
}

