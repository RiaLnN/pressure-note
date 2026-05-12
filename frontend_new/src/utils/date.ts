export function toYyyyMmDd(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function formatTimeHHmm(isoString: string, locale = 'uk-UA'): string {
  const d = new Date(isoString);
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatWeekdayShort(isoString: string, locale = 'uk-UA'): string {
  const d = new Date(isoString);
  return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
}

export function formatMonthShort(isoString: string, locale = 'uk-UA'): string {
  const d = new Date(isoString);
  return new Intl.DateTimeFormat(locale, { month: 'short' }).format(d);
}

export function formatRelativeDayLabel(isoString: string, locale = 'uk-UA'): string {
  const d = new Date(isoString);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfThatDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfThatDay.getTime()) / 86400000,
  );

  if (diffDays === 0) return locale.startsWith('ru') ? 'Сегодня' : 'Сьогодні';
  if (diffDays === 1) return locale.startsWith('ru') ? 'Вчера' : 'Вчора';

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
  }).format(d);
}

