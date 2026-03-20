export interface Measurement {
    id?: number;
    sys: number;
    dia: number;
    created_at?: Date;
}

export interface Settings {
    theme: string;
    target_pressure: {sys: number, dia: number};
    notifications: boolean;
    pressure_reminders: Array<string>;
    language_code: string;
    timezone: string;
}

export interface User {
    username: string | null;
    settings: Settings;
}