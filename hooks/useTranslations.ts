'use client';

import { useParams } from 'next/navigation';
import { translations, type Locale, type Translations } from '@/lib/i18n';

export function useTranslations(): Translations {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'uk';
  
  return translations[locale] || translations.uk;
}

export function useLocale(): Locale {
  const params = useParams();
  return (params?.locale as Locale) || 'uk';
}


