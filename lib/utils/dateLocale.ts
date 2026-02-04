// Оптимизированная функция форматирования даты через Intl.DateTimeFormat
// Это заменяет date-fns форматирование и не требует загрузки локалей
export function formatDate(
  date: Date | string | number,
  pattern: string, // 'dd.MM.yyyy HH:mm' и т.д.
  locale: 'uk' | 'ru' = 'uk'
): string {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;

    if (isNaN(dateObj.getTime())) {
      return String(date);
    }

    const localeTag = locale === 'uk' ? 'uk-UA' : 'ru-RU';

    // Конвертация паттернов date-fns в Intl.DateTimeFormat
    if (pattern === 'dd.MM.yyyy HH:mm:ss') {
      return new Intl.DateTimeFormat(localeTag, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(dateObj);
    } else if (pattern === 'dd.MM.yyyy HH:mm') {
      return new Intl.DateTimeFormat(localeTag, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(dateObj);
    } else if (pattern === 'dd.MM.yyyy') {
      return new Intl.DateTimeFormat(localeTag, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(dateObj);
    } else if (pattern === 'dd.MM') {
      return new Intl.DateTimeFormat(localeTag, {
        day: '2-digit',
        month: '2-digit',
      }).format(dateObj);
    }
    
    // По умолчанию используем полный формат дата-время
    return new Intl.DateTimeFormat(localeTag, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch (error) {
    return String(date);
  }
}

// Обратная совместимость для getDateLocale (если где-то еще используется)
export function getDateLocale(locale: 'uk' | 'ru') {
  // Возвращаем пустой объект для обратной совместимости
  // Реальное форматирование теперь через formatDate
  return {};
}
