export type PressureStatus = 'High' | 'Elevated' | 'Normal' | 'Low';

export interface Measurement {
    id: number;
    sys: number;
    dia: number;
    status: PressureStatus;
    created_at: string;
}