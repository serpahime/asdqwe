'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import { locales, localeNames, type Locale } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = (params?.locale as Locale) || 'uk';
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (locale: Locale) => {
    // Удаляем текущую локаль из пути
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    // Добавляем новую локаль
    const newPath = `/${locale}${pathWithoutLocale}`;
    router.push(newPath);
    setIsOpen(false);
    
    // Сохраняем выбор в cookie
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-neon-cyan transition-colors rounded-lg hover:bg-dark-border"
        aria-label="Переключить язык"
      >
        <Globe size={18} />
        <span className="text-sm font-medium uppercase">{currentLocale}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 bg-dark-card border border-dark-border rounded-lg shadow-lg z-20 min-w-[150px]">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => switchLocale(locale)}
                className={`
                  w-full text-left px-4 py-2 text-sm transition-colors
                  ${currentLocale === locale
                    ? 'bg-dark-border text-neon-cyan'
                    : 'text-gray-300 hover:bg-dark-border hover:text-white'
                  }
                  ${locale === locales[0] ? 'rounded-t-lg' : ''}
                  ${locale === locales[locales.length - 1] ? 'rounded-b-lg' : ''}
                `}
              >
                {localeNames[locale]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


