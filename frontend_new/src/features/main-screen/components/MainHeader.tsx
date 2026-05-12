import React, { useMemo } from 'react';
import { useUserStore } from '../../../store/useUserStore';
import { MAIN_SCREEN_TEXT } from '../constants';

function getGreeting(hour: number) {
  if (hour < 12) return MAIN_SCREEN_TEXT.header.morning;
  if (hour < 18) return MAIN_SCREEN_TEXT.header.day;
  return MAIN_SCREEN_TEXT.header.evening;
}

export const MainHeader: React.FC = () => {
  const username = useUserStore((s) => s.username);
  const greeting = useMemo(() => getGreeting(new Date().getHours()), []);

  return (
    <header className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-sm text-text-soft">{greeting}</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {username ?? MAIN_SCREEN_TEXT.header.unknownUser}
        </h1>
      </div>

      <div className="flex items-center justify-center size-12 rounded-full bg-bg-avatar border-2 border-border-avatar/80 shadow-sm">
        <div className="size-5 rounded-full border-2 border-border-avatar/60" />
      </div>
    </header>
  );
};

