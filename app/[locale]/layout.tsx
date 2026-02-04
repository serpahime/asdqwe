import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import dynamic from 'next/dynamic';
import '../globals.css';
import LocaleHtml from '@/components/LocaleHtml';
import { locales, type Locale } from '@/lib/i18n';

// ⚡ ПРОИЗВОДИТЕЛЬНОСТЬ: Динамически загружаем провайдеры магазина только когда нужно
// Они будут загружены только для магазинных страниц, не для админки
const ShopProviders = dynamic(() => import('./ShopProviders'), {
  ssr: false,
  loading: () => null,
});

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap', // Оптимізація для продуктивності
  preload: true,
});

const poppins = Poppins({ 
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap', // Оптимізація для продуктивності
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'JuiceLab - Преміальні рідини та аксесуари для вейпінгу',
    template: '%s | JuiceLab',
  },
  description: 'CHASER 30 ml | 65 мг набори та Vaporesso XROS 2ML COREX 2.0 картриджі. Високоякісні рідини для вейпінгу. Швидка доставка. Тільки для осіб старше 18 років.',
  keywords: ['juicelab', 'chaser', 'vaporesso xros', 'вейп', 'рідини для вейпа', 'картриджі', 'e-liquid', 'vape', 'vaping', 'e-cigarette'],
  authors: [{ name: 'JuiceLab' }],
  creator: 'JuiceLab',
  publisher: 'JuiceLab',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://juicelub.store'),
  alternates: {
    canonical: '/',
    languages: {
      'uk-UA': '/uk',
      'ru-RU': '/ru',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    alternateLocale: 'ru_RU',
    siteName: 'JuiceLab',
    title: 'JuiceLab - Преміальні рідини для вейпінгу',
    description: 'CHASER набори та Vaporesso XROS картриджі високої якості',
    images: [
      {
        url: '/chaser.png',
        width: 1200,
        height: 630,
        alt: 'JuiceLab - Преміальні рідини для вейпінгу',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JuiceLab - Преміальні рідини для вейпінгу',
    description: 'CHASER набори та Vaporesso XROS картриджі високої якості',
    images: ['/chaser.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Додайте ваші коди верифікації
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  // ⚡ ПРОИЗВОДИТЕЛЬНОСТЬ: Минимальный layout для всех страниц
  // Провайдеры магазина загружаются условно только для магазинных страниц
  return (
    <>
      <LocaleHtml />
      <ShopProviders>
        {children}
      </ShopProviders>
    </>
  );
}

