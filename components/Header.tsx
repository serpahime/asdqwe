"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, User, Sparkles, ChevronRight, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useTranslations } from '@/hooks/useTranslations';
import { useLocale } from '@/hooks/useLocale';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { isAuthenticated } from '@/lib/referral/auth-client';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { itemsCount, items, total, removeItem } = useCart();
  const t = useTranslations();
  const locale = useLocale();

  // Проверяем авторизацию
  useEffect(() => {
    setIsUserLoggedIn(isAuthenticated());
  }, []);

  // Отслеживаем скролл для изменения стиля header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Закрываем корзину при клике вне её
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen]);

  // Проверяем активный путь
  const isActive = (path: string) => {
    if (path === `/${locale}`) {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname?.startsWith(path);
  };

  // Используем общую сумму из контекста
  const cartTotal = total;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-dark-bg/98 backdrop-blur-md border-b border-dark-border shadow-lg shadow-black/20' 
        : 'bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-3 group relative">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink rounded-xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-neon-cyan/30 group-hover:shadow-neon-purple/50 relative overflow-hidden">
                <span className="text-2xl font-bold text-white drop-shadow-lg relative z-10">J</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 via-neon-purple/0 to-neon-pink/0 group-hover:from-neon-cyan/30 group-hover:via-neon-purple/30 group-hover:to-neon-pink/30 transition-all duration-500 animate-pulse"></div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300 -z-10"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent group-hover:from-neon-pink group-hover:via-neon-purple group-hover:to-neon-cyan transition-all duration-300">
                JuiceLab
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                Premium Vape
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href={`/${locale}`}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                isActive(`/${locale}`)
                  ? 'text-neon-cyan'
                  : 'text-gray-300 hover:text-neon-cyan'
              }`}
            >
              <span className="relative z-10">{t.header.home}</span>
              {isActive(`/${locale}`) && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-lg"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"></div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 to-neon-purple/0 rounded-lg group-hover:from-neon-cyan/10 group-hover:to-neon-purple/10 transition-all duration-300"></div>
            </Link>
            
            <Link 
              href={`/${locale}/catalog`}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                isActive(`/${locale}/catalog`)
                  ? 'text-neon-cyan'
                  : 'text-gray-300 hover:text-neon-cyan'
              }`}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>{t.header.catalog}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-neon-purple to-neon-pink text-white rounded-full animate-pulse">
                  {locale === 'uk' ? 'НОВИНКИ' : 'НОВИНКИ'}
                </span>
                {isActive(`/${locale}/catalog`) && (
                  <Sparkles size={14} className="text-neon-purple animate-pulse" />
                )}
              </span>
              {isActive(`/${locale}/catalog`) && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-lg"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"></div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 to-neon-purple/0 rounded-lg group-hover:from-neon-cyan/10 group-hover:to-neon-purple/10 transition-all duration-300"></div>
            </Link>
            
            <Link 
              href={`/${locale}/about`}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                isActive(`/${locale}/about`)
                  ? 'text-neon-cyan'
                  : 'text-gray-300 hover:text-neon-cyan'
              }`}
            >
              <span className="relative z-10">{t.header.about}</span>
              {isActive(`/${locale}/about`) && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-lg"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"></div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 to-neon-purple/0 rounded-lg group-hover:from-neon-cyan/10 group-hover:to-neon-purple/10 transition-all duration-300"></div>
            </Link>
            
            <Link 
              href={`/${locale}/contacts`}
              className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                isActive(`/${locale}/contacts`)
                  ? 'text-neon-cyan'
                  : 'text-gray-300 hover:text-neon-cyan'
              }`}
            >
              <span className="relative z-10">{t.header.contacts}</span>
              {isActive(`/${locale}/contacts`) && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-lg"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"></div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 to-neon-purple/0 rounded-lg group-hover:from-neon-cyan/10 group-hover:to-neon-purple/10 transition-all duration-300"></div>
            </Link>
          </nav>

          {/* Cart & Menu */}
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            
            {isUserLoggedIn ? (
              <Link 
                href={`/${locale}/account`}
                className="relative p-2.5 rounded-lg text-gray-300 hover:text-neon-cyan hover:bg-dark-card transition-all duration-300 group touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                title={locale === 'uk' ? 'Особистий кабінет' : 'Личный кабинет'}
                aria-label={locale === 'uk' ? 'Особистий кабінет' : 'Личный кабинет'}
              >
                <User size={22} className="group-hover:scale-110 transition-transform" suppressHydrationWarning />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-cyan/0 to-neon-purple/0 group-hover:from-neon-cyan/10 group-hover:to-neon-purple/10 transition-all duration-300"></div>
              </Link>
            ) : (
              <Link 
                href={`/${locale}/login`}
                className="px-4 py-2.5 rounded-lg text-gray-300 hover:text-neon-cyan hover:bg-dark-card transition-all duration-300 font-medium text-sm border border-transparent hover:border-neon-cyan/30 touch-manipulation min-h-[44px] flex items-center justify-center"
                aria-label={locale === 'uk' ? 'Вхід' : 'Вход'}
              >
                {locale === 'uk' ? 'Вхід' : 'Вход'}
              </Link>
            )}
            
            {/* Корзина с мини-превью */}
            <div 
              className="relative" 
              ref={cartDropdownRef}
              onMouseEnter={() => itemsCount > 0 && setIsCartOpen(true)}
              onMouseLeave={() => setIsCartOpen(false)}
            >
              <Link
                href={`/${locale}/cart`}
                className={`relative p-2.5 rounded-lg transition-all duration-300 group flex items-center space-x-2 touch-manipulation min-w-[44px] min-h-[44px] ${
                  itemsCount > 0 
                    ? 'text-neon-cyan hover:bg-dark-card bg-gradient-to-r from-neon-cyan/5 to-neon-purple/5' 
                    : 'text-gray-300 hover:text-neon-cyan hover:bg-dark-card'
                }`}
                aria-label={locale === 'uk' ? `Кошик, ${itemsCount} товарів` : `Корзина, ${itemsCount} товаров`}
              >
                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" suppressHydrationWarning />
                {itemsCount > 0 && (
                  <>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-xs font-semibold text-neon-cyan leading-tight">
                        {locale === 'uk' ? 'Кошик' : 'Корзина'}
                      </span>
                      <span className="text-xs font-bold text-neon-purple">
                        {cartTotal.toFixed(0)} ₴
                      </span>
                    </div>
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-neon-cyan to-neon-purple text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-neon-cyan/50 animate-pulse">
                      {itemsCount}
                    </span>
                    <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"></div>
                  </>
                )}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-cyan/0 to-neon-purple/0 group-hover:from-neon-cyan/10 group-hover:to-neon-purple/10 transition-all duration-300"></div>
              </Link>

              {/* Мини-корзина dropdown */}
              {isCartOpen && itemsCount > 0 && (
                <>
                  {/* Невидимий місток для плавного переходу курсора */}
                  <div className="absolute top-full right-0 w-80 h-2 pointer-events-auto"></div>
                  <div
                    className="absolute top-full right-0 pt-2 w-80 z-50"
                  >
                    <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-dark-border">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-neon-cyan">
                            {locale === 'uk' ? 'Кошик' : 'Корзина'}
                          </h3>
                          <span className="text-sm text-gray-400">
                            {itemsCount} {locale === 'uk' ? 'товарів' : 'товаров'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">{locale === 'uk' ? 'Сума' : 'Сумма'}:</span>
                          <span className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                            {cartTotal.toFixed(0)} ₴
                          </span>
                        </div>
                      </div>

                  <div className="max-h-64 overflow-y-auto">
                    {items.slice(0, 3).map((item) => (
                      <div key={item.id} className="p-4 border-b border-dark-border hover:bg-dark-bg/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-dark-bg flex-shrink-0">
                            {item.images && item.images[0] ? (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-300 truncate">{item.name}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-400">
                                {item.quantity} × {item.price} ₴
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItem(item.id);
                                }}
                                className="p-2 text-gray-400 hover:text-red-400 transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                                title={locale === 'uk' ? 'Видалити' : 'Удалить'}
                                aria-label={locale === 'uk' ? `Видалити ${item.name}` : `Удалить ${item.name}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div className="p-4 text-center text-sm text-gray-400">
                        {locale === 'uk' ? 'І ще' : 'И ещё'} {items.length - 3} {locale === 'uk' ? 'товарів' : 'товаров'}...
                      </div>
                    )}
                  </div>

                      <div className="p-4 border-t border-dark-border bg-gradient-to-r from-neon-cyan/5 to-neon-purple/5">
                        <Link
                          href={`/${locale}/cart`}
                          className="w-full btn-primary flex items-center justify-center space-x-2 text-sm py-2.5"
                          onClick={() => setIsCartOpen(false)}
                        >
                          <span>{locale === 'uk' ? 'Перейти до кошика' : 'Перейти в корзину'}</span>
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button - оптимізовано для touch */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 rounded-lg text-gray-300 hover:text-neon-cyan hover:bg-dark-card transition-all duration-300 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={locale === 'uk' ? 'Відкрити меню' : 'Открыть меню'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav 
            id="mobile-menu"
            className="md:hidden py-4 border-t border-dark-border animate-in slide-in-from-top duration-300"
            aria-label={locale === 'uk' ? 'Головна навігація' : 'Главная навигация'}
          >
            <div className="flex flex-col space-y-2">
              <Link 
                href={`/${locale}`}
                className={`px-4 py-3.5 rounded-lg font-medium transition-all duration-300 touch-manipulation min-h-[44px] flex items-center ${
                  isActive(`/${locale}`)
                    ? 'text-neon-cyan bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border-l-2 border-neon-cyan'
                    : 'text-gray-300 hover:text-neon-cyan hover:bg-dark-card active:bg-dark-card/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t.header.home}
              </Link>
              <Link 
                href={`/${locale}/catalog`}
                className={`px-4 py-3.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 touch-manipulation min-h-[44px] ${
                  isActive(`/${locale}/catalog`)
                    ? 'text-neon-cyan bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border-l-2 border-neon-cyan'
                    : 'text-gray-300 hover:text-neon-cyan hover:bg-dark-card active:bg-dark-card/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{t.header.catalog}</span>
                {isActive(`/${locale}/catalog`) && (
                  <Sparkles size={14} className="text-neon-purple" />
                )}
              </Link>
              <Link 
                href={`/${locale}/about`}
                className={`px-4 py-3.5 rounded-lg font-medium transition-all duration-300 touch-manipulation min-h-[44px] flex items-center ${
                  isActive(`/${locale}/about`)
                    ? 'text-neon-cyan bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border-l-2 border-neon-cyan'
                    : 'text-gray-300 hover:text-neon-cyan hover:bg-dark-card active:bg-dark-card/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t.header.about}
              </Link>
              <Link 
                href={`/${locale}/contacts`}
                className={`px-4 py-3.5 rounded-lg font-medium transition-all duration-300 touch-manipulation min-h-[44px] flex items-center ${
                  isActive(`/${locale}/contacts`)
                    ? 'text-neon-cyan bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border-l-2 border-neon-cyan'
                    : 'text-gray-300 hover:text-neon-cyan hover:bg-dark-card active:bg-dark-card/80'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t.header.contacts}
              </Link>
              
              {/* Информация о корзине в мобильном меню */}
              {itemsCount > 0 && (
                <div className="mt-4 pt-4 border-t border-dark-border">
                  <Link
                    href={`/${locale}/cart`}
                    className="flex items-center justify-between px-4 py-3 rounded-lg bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/30 hover:border-neon-cyan transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingCart size={20} className="text-neon-cyan" />
                      <div>
                        <p className="text-sm font-medium text-neon-cyan">
                          {locale === 'uk' ? 'Кошик' : 'Корзина'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {itemsCount} {locale === 'uk' ? 'товарів' : 'товаров'}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-neon-purple">
                      {cartTotal.toFixed(0)} ₴
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
