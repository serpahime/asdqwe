import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

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
  description: 'CHASER 30 ml | 65 мг набори та Vaporesso XROS 2ML COREX 2.0 картриджі. Високоякісні рідини для вейпінгу.',
  metadataBase: new URL('https://juicelub.store'),
};

// Корневой layout - базовый HTML wrapper
// Middleware перенаправляет все запросы на app/[locale]/
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}


