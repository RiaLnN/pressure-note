export interface UserSettings {
    theme: 'light' | 'dark' | 'green';
    target_pressure: {sys: number, dia: number};
    notification: boolean;
    pressure_reminders: string[];
    language_code: 'en' | 'ru' | 'ua';
    timezone: string;
}