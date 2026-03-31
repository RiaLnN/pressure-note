export const MAIN_SCREEN_TEXT = {
  header: {
    morning: 'Доброго ранку',
    day: 'Добрий день',
    evening: 'Добрий вечір',
    unknownUser: '—',
  },
  lastMeasurement: {
    title: 'Останній вимір',
    targetPrefix: 'Ціль',
  },
  cta: {
    addMeasurement: 'Записати новий вимір',
  },
  addMeasurementModal: {
    title: 'Новий вимір',
    pressureLabel: 'Артеріальний тиск',
    handLabel: 'Рука',
    stateLabel: 'Стан',
    commentLabel: 'Коментар',
    commentPlaceholder: 'Введіть коментар',
  },
  week: {
    title: 'Тиск за 7 днів',
    details: 'Детальніше',
    legend: 'Систолічний тиск (мм рт.ст.)',
    empty: 'Немає даних за цей період',
  },
  recent: {
    title: 'Останні записи',
    all: 'Всі записи',
    empty: 'Записів ще немає',
  },
} as const;

