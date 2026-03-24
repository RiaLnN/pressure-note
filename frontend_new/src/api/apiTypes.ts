import type { Measurement } from '../types/measurements';
import type { UserSettings } from '../types/user';
import type { Medication } from '../types/medications';

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