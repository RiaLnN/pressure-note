import { create } from 'zustand';

interface UserSettings {
  theme: 'light' | 'dark' | 'green';
  target_pressure: { sys: number; dia: number };
  notification: boolean;
  pressure_reminders: string[];
  language_code: 'en' | 'ru' | 'ua';
  timezone: string;
}

interface UserStore {
  username: string | null;
  settings: UserSettings;

  updateSettings: (items: Partial<UserSettings>) => void;
  updateUsername: (item: string | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  username: null,
  settings: {
    theme: 'dark',
    target_pressure: { sys: 120, dia: 80 },
    notification: true,
    pressure_reminders: ['09:00', '21:00'],
    language_code: 'en',
    timezone: 'Europe/Kyiv',
  },

  updateSettings: (items) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...items,
      },
    })),

  updateUsername: (item) => set({ username: item }),
}));
