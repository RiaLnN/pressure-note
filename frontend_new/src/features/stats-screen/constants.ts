export const STATS_TEXT = {
  title: 'Статистика',
  period: {
    sevenDays: '7\ndнів',
    thirtyDays: '30\nднів',
    year: 'Рік',
  },
  kpi: {
    average: 'Середній',
    maxSys: 'Макс. систол.',
    count: 'Вимірів',
    countSuffix: 'за період',
  },
  dynamics: {
    title: 'Динаміка тиску',
    sys: 'Сист.',
    dia: 'Діаст.',
    empty: 'Немає даних за цей період',
  },
  distribution: {
    title: 'Розподіл',
    placeholder: 'Заглушка для періоду "Рік".',
  },
  trends: {
    title: 'Тижневий тренд',
    placeholder: 'Тренди потребують додаткової логіки — поки заглушка.',
  },
} as const;

