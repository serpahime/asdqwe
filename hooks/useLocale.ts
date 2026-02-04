'use client';

import { useParams } from 'next/navigation';
import { type Locale } from '@/lib/i18n';

export function useLocale(): Locale {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'uk';
  return locale;
}

