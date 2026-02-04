'use client';

import Link from 'next/link';
import { Star, Truck, Shield, Award, ArrowRight } from 'lucide-react';
import { products } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { useTranslations, useLocale } from '@/hooks/useTranslations';

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const featuredProducts = products.filter(p => p.isHit || p.isNew).slice(0, 4);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Premium Background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-bg to-dark-bg"></div>
        
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-cyan/20 via-transparent to-neon-purple/20"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-neon-pink/15 via-transparent to-neon-cyan/15"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Animated floating orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-neon-cyan/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-neon-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-neon-pink/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-56 h-56 bg-neon-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        
        <div className="container-custom relative z-10 text-center px-4">
          {/* Decorative elements around text */}
          <div className="absolute -top-20 -left-20 w-40 h-40 border border-neon-cyan/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 border border-neon-purple/20 rounded-full blur-xl"></div>
          
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-4 animate-fade-in relative">
            <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent drop-shadow-2xl">
              {t.home.heroTitle}
            </span>
            <br />
            <span className="text-white text-5xl md:text-7xl mt-2 block drop-shadow-lg">
              {t.home.heroSubtitle}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            {locale === 'uk' ? (
              <>
                CHASER набори. Vaporesso XROS картриджі.
                <br className="hidden md:block" />
                Неперевершена якість.
              </>
            ) : (
              <>
                CHASER наборы. Vaporesso XROS картриджи.
                <br className="hidden md:block" />
                Непревзойдённое качество.
              </>
            )}
          </p>
          <Link 
            href={`/${locale}/catalog`} 
            className="group inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-semibold py-4 px-6 md:px-10 rounded-lg text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-neon-purple/50 active:scale-95 relative overflow-hidden touch-manipulation min-h-[48px] w-full sm:w-auto"
            aria-label={t.home.heroButton}
          >
            <span className="relative z-10">{t.home.heroButton}</span>
            <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/90 to-neon-pink/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
              <span>{locale === 'uk' ? 'Швидка доставка' : 'Быстрая доставка'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span>{locale === 'uk' ? 'Преміум якість' : 'Премиум качество'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span>{locale === 'uk' ? 'Гарантія якості' : 'Гарантия качества'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-dark-card">
        <div className="container-custom">
          <h2 className="text-4xl font-display font-bold text-center mb-12">
            {locale === 'uk' ? 'Чому обирають' : 'Почему выбирают'} <span className="gradient-text">JuiceLab</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-dark-bg" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{locale === 'uk' ? 'Насичений смак' : 'Насыщенный вкус'}</h3>
              <p className="text-gray-400 text-sm">
                {locale === 'uk' 
                  ? 'Інтенсивні аромати, які розкриваються повністю'
                  : 'Интенсивные ароматы, которые раскрываются полностью'}
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-dark-bg" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{locale === 'uk' ? 'Безпечні інгредієнти' : 'Безопасные ингредиенты'}</h3>
              <p className="text-gray-400 text-sm">
                {locale === 'uk'
                  ? 'Тільки перевірені та сертифіковані компоненти'
                  : 'Только проверенные и сертифицированные компоненты'}
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-pink to-neon-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-dark-bg" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{locale === 'uk' ? 'Швидка доставка' : 'Быстрая доставка'}</h3>
              <p className="text-gray-400 text-sm">
                {locale === 'uk'
                  ? 'Відправка в день замовлення. Доставка по всій країні'
                  : 'Отправка в день заказа. Доставка по всей стране'}
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-dark-bg" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{locale === 'uk' ? 'Преміум якість' : 'Премиум качество'}</h3>
              <p className="text-gray-400 text-sm">
                {locale === 'uk'
                  ? 'Високоякісні продукти від перевірених виробників'
                  : 'Высококачественные продукты от проверенных производителей'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-display font-bold">
              {t.home.popular} <span className="gradient-text">{locale === 'uk' ? 'смаки' : 'вкусы'}</span>
            </h2>
            <Link 
              href={`/${locale}/catalog`}
              className="hidden md:flex items-center space-x-2 text-neon-cyan hover:text-neon-purple transition-colors"
            >
              <span>{t.home.viewAll}</span>
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href={`/${locale}/catalog`} className="btn-secondary inline-flex items-center space-x-2">
              <span>{t.home.viewAll}</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section-padding bg-dark-card">
        <div className="container-custom">
          <h2 className="text-4xl font-display font-bold text-center mb-12">
            {t.home.reviews} <span className="gradient-text">{locale === 'uk' ? 'клієнтів' : 'клиентов'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Алексей М.',
                rating: 5,
                text: locale === 'uk' 
                  ? 'Відмінний набір CHASER! Смак винограду дуже насичений. Рекомендую всім любителям якісних рідин.'
                  : 'Отличный набор CHASER! Вкус винограда очень насыщенный. Рекомендую всем любителям качественных жидкостей.',
                product: 'CHASER Виноград',
              },
              {
                name: 'Мария К.',
                rating: 5,
                text: locale === 'uk'
                  ? 'Купую вже третій раз. Якість на висоті, смак голубої малини просто приголомшливий. Швидка доставка та відмінний сервіс!'
                  : 'Покупаю уже третий раз. Качество на высоте, вкус голубой малины просто потрясающий. Быстрая доставка и отличный сервис!',
                product: 'CHASER Голубая малина',
              },
              {
                name: 'Дмитрий С.',
                rating: 5,
                text: locale === 'uk'
                  ? 'Vaporesso XROS COREX 2.0 - відмінні картриджі! Чистий смак та стабільна робота. Ідеально для щоденного використання.'
                  : 'Vaporesso XROS COREX 2.0 - отличные картриджи! Чистый вкус и стабильная работа. Идеально для ежедневного использования.',
                product: 'Vaporesso XROS 2ML',
              },
            ].map((review, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-4 text-sm">{review.text}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{review.name}</span>
                  <span className="text-gray-500 text-xs">{review.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section-padding border-t border-dark-border">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-6">
              {t.home.trust} <span className="gradient-text">{locale === 'uk' ? 'якість' : 'качество'}</span>
            </h2>
            <p className="text-gray-400 mb-8">
              {locale === 'uk'
                ? 'Ми гарантуємо високу якість нашої продукції та дотримання всіх стандартів безпеки. Всі рідини для вейпінгу проходять суворий контроль якості перед відправкою.'
                : 'Мы гарантируем высокое качество нашей продукции и соблюдение всех стандартов безопасности. Все жидкости для вейпинга проходят строгий контроль качества перед отправкой.'}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span>✓ {locale === 'uk' ? 'Сертифікована продукція' : 'Сертифицированная продукция'}</span>
              <span>✓ {locale === 'uk' ? 'Гарантія якості' : 'Гарантия качества'}</span>
              <span>✓ {locale === 'uk' ? 'Повернення протягом 14 днів' : 'Возврат в течение 14 дней'}</span>
              <span>✓ {locale === 'uk' ? 'Тільки для осіб 18+' : 'Только для лиц 18+'}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


