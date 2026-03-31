import { useEffect, useState } from 'react';
import { api } from '../api/instance';
import { UserService } from '../api/services/userService';
import { useUserStore } from '../store/useUserStore';
import type { User } from '../api/apiTypes';


export function useAppInit() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const updateSettings = useUserStore((s) => s.updateSettings);
  const updateUsername = useUserStore((s) => s.updateUsername);

  useEffect(() => {
    async function init() {
      try {
        const tg = Telegram.WebApp;

        if (tg) {
          tg.ready();

          if (tg.initData) {
            api.defaults.headers.common['X-Telegram-Init-Data'] = tg.initData;
          }
        }

        const tgUser = tg?.initDataUnsafe?.user;
        if (tgUser) {
          updateUsername(tgUser.username ?? tgUser.first_name);
        }

        const user: User = await UserService.get();
        updateSettings(user.settings);

        if (tg) {
          tg.expand();
          tg.enableClosingConfirmation();
          tg.setHeaderColor('#1a2738');
          tg.setBackgroundColor('#1a1b23');

          document.body.classList.add('tg-viewport');
          document.body.style.overscrollBehavior = 'none';

          if (tg.themeParams) {
            const root = document.documentElement;
            Object.entries(tg.themeParams).forEach(([key, value]) => {
              root.style.setProperty(
                `--tg-theme-${key.replace(/_/g, '-')}`,
                String(value),
              );
            });
          }
        }
      } catch (e) {
        console.error('App init error', e);
        setError(e instanceof Error ? e : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    void init();
  }, [updateSettings, updateUsername]);

  return { isLoading, error };
}
