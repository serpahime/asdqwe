'use client';

import Link from 'next/link';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useLocale } from '@/hooks/useLocale';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Використовуємо дефолтну локаль для SSR
  const displayLocale = mounted ? locale : 'uk';

  return (
    <footer className="bg-dark-card border-t border-dark-border">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink rounded-xl flex items-center justify-center shadow-lg shadow-neon-cyan/30">
                <span className="text-xl font-bold text-white">J</span>
              </div>
              <h3 className="text-xl font-display font-bold bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
                JuiceLab
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {displayLocale === 'uk' 
                ? 'Преміальні рідини для вейпінгу та аксесуари. Якість, яку ви заслуговуєте.'
                : 'Премиальные жидкости для вейпинга и аксессуары. Качество, которое вы заслуживаете.'}
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-neon-cyan transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} suppressHydrationWarning />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-neon-cyan transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} suppressHydrationWarning />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.footer.navigation}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${displayLocale}`} className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">
                  {t.header.home}
                </Link>
              </li>
              <li>
                <Link href={`/${displayLocale}/catalog`} className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">
                  {t.header.catalog}
                </Link>
              </li>
              <li>
                <Link href={`/${displayLocale}/about`} className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">
                  {t.header.about}
                </Link>
              </li>
              <li>
                <Link href={`/${displayLocale}/contacts`} className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">
                  {t.header.contacts}
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.footer.information}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${displayLocale}/delivery`} className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">
                  {displayLocale === 'uk' ? 'Доставка і оплата' : 'Доставка и оплата'}
                </Link>
              </li>
              <li>
                <Link href={`/${displayLocale}/oferta`} className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">
                  {displayLocale === 'uk' ? 'Публічна оферта' : 'Публичная оферта'}
                </Link>
              </li>
              <li>
                <Link href={`/${displayLocale}/privacy`} className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">
                  {displayLocale === 'uk' ? 'Політика конфіденційності' : 'Политика конфиденциальности'}
                </Link>
              </li>
              <li>
                <Link href={`/${displayLocale}/terms`} className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">
                  {displayLocale === 'uk' ? 'Умови використання' : 'Условия использования'}
                </Link>
              </li>
              <li>
                <Link href={`/${displayLocale}/disclaimer`} className="text-gray-400 hover:text-neon-cyan transition-colors text-sm">
                  {displayLocale === 'uk' ? 'Відмова від відповідальності' : 'Отказ от ответственности'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.footer.contacts}</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone size={16} suppressHydrationWarning />
                <a href="tel:+380501234567" className="hover:text-neon-cyan transition-colors">
                  +38 (050) 123-45-67
                </a>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail size={16} suppressHydrationWarning />
                <a href="mailto:info@aromaflavor.com" className="hover:text-neon-cyan transition-colors">
                  info@juicelab.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border pt-8">
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-4">
              <p className="text-yellow-400 font-semibold text-xs text-center">
              ⚠️ {displayLocale === 'uk' 
                ? 'JuiceLab є продавцем, який здійснює роздрібний продаж товарів, виготовлених виробниками (третіми особами). JuiceLab не є виробником товарів.'
                : 'JuiceLab является продавцом, который осуществляет розничную продажу товаров, изготовленных производителями (третьими лицами). JuiceLab не является производителем товаров.'}
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2024 JuiceLab. {t.footer.rights}
            </p>
            <p className="text-gray-500 text-sm text-center md:text-right">
              {t.footer.ageWarning}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}



