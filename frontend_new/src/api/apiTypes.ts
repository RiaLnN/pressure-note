import type { Measurement } from '../types/measurements';
import type { UserSettings } from '../types/user';
import type { Medication } from '../types/medications';

export type PressureRead = Measurement;
export type MedicationRead = Medication;

export interface PressureCreate {
    sys: number;
    dia: number;
    created_at: string; // ISO 8601
    description?: string | null;
}

export interface PressureGroup {
    date: string;
    measurements: PressureRead[];
}

export interface PressureAverage {
    sys: number;
    dia: number;
}

export interface DayStats {
    date: string;
    measurements: PressureRead[];
    average?: PressureAverage | null;
    is_current_month?: boolean;
}

export interface PressureGroupWeekly {
    year: number;
    month: number;
    week_average?: PressureAverage | null;
    days: DayStats[];
}

export interface User {
    username: string | null;
    settings: UserSettings;
    measurements: Measurement[];
    medications: Medication[];
}

export interface UpdateUser{
    username?: string | null;
    settings?: UserSettings;
}

export interface MedicationCreate {
    item_name: string;
    reminders: string[];
}
