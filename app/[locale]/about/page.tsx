'use client';

import Link from 'next/link';
import { Award, Target, Heart, Users, AlertTriangle, Sparkles, ArrowRight, CheckCircle2, Star, TrendingUp, Shield } from 'lucide-react';
import { useTranslations, useLocale } from '@/hooks/useTranslations';
import { useEffect, useState } from 'react';

export default function AboutPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { value: '10,000+', label: locale === 'uk' ? 'Задоволених клієнтів' : 'Довольных клиентов', icon: Users },
    { value: '4.9/5', label: locale === 'uk' ? 'Середня оцінка' : 'Средняя оценка', icon: Star },
    { value: '500+', label: locale === 'uk' ? 'Товарів у каталозі' : 'Товаров в каталоге', icon: Award },
    { value: '98%', label: locale === 'uk' ? 'Рекомендують нас' : 'Рекомендуют нас', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-card/50 to-dark-bg"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(176,38,255,0.15),transparent_50%)]"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-neon-cyan/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-neon-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

        <div className="container-custom relative z-10">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Header */}
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              <span className="text-white">{locale === 'uk' ? 'Про' : 'О'}</span>{' '}
              <span className="bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                {locale === 'uk' ? 'бренд' : 'бренде'}
              </span>
            </h1>

            {/* Brand Introduction */}
            <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              {locale === 'uk' 
                ? 'JuiceLab — це преміальний бренд рідин для вейпінгу, створений для тих, хто цінує якість, смак та стиль.'
                : 'JuiceLab — это премиальный бренд жидкостей для вейпинга, созданный для тех, кто ценит качество, вкус и стиль.'}
            </p>

            {/* CTA Button */}
            <Link 
              href={`/${locale}/catalog`} 
              className="btn-primary inline-flex items-center space-x-2 text-lg group"
            >
              <span>{locale === 'uk' ? 'Перейти в каталог' : 'Перейти в каталог'}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-padding bg-dark-card/30 border-y border-dark-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className={`text-center transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-2xl mb-4 shadow-lg shadow-neon-cyan/10">
                    <Icon className="text-neon-cyan" size={28} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="section-padding">
        <div className="container-custom max-w-6xl">
          {/* Important Disclaimer */}
          <div className={`mb-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border-2 border-yellow-500/40 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-2xl shadow-yellow-500/20 hover:border-yellow-500/60 transition-all duration-300">
              <div className="flex items-start space-x-4 md:space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-yellow-500/20 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30 animate-pulse">
                    <AlertTriangle className="text-yellow-400" size={28} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-yellow-400 font-bold text-xl md:text-2xl mb-4 flex items-center gap-2">
                    <span>{locale === 'uk' ? 'ВАЖЛИВО' : 'ВАЖНО'}</span>
                    <Shield className="text-yellow-400/60" size={20} />
                  </h3>
                  <p className="text-gray-200 leading-relaxed text-base md:text-lg">
                    {locale === 'uk' 
                      ? 'JuiceLab є продавцем, який здійснює роздрібний продаж товарів, виготовлених виробниками (третіми особами). JuiceLab не є виробником товарів.'
                      : 'JuiceLab является продавцом, который осуществляет розничную продажу товаров, изготовленных производителями (третьими лицами). JuiceLab не является производителем товаров.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Mission */}
          <div className={`mb-16 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="card p-8 md:p-10 hover:border-neon-cyan/50 hover:shadow-2xl hover:shadow-neon-cyan/20 transition-all duration-300 group relative overflow-hidden">
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Target className="text-white" size={36} />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                    {locale === 'uk' ? 'Наша місія' : 'Наша миссия'}
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg md:text-xl mb-6">
                    {locale === 'uk'
                      ? 'Ми прагнемо створювати рідини для вейпінгу найвищої якості, які розкривають повний потенціал смаку та аромату. Кожен продукт проходить суворий контроль якості, щоб гарантувати безпеку та чудовий смак.'
                      : 'Мы стремимся создавать жидкости для вейпинга высочайшего качества, которые раскрывают полный потенциал вкуса и аромата. Каждый продукт проходит строгий контроль качества, чтобы гарантировать безопасность и превосходный вкус.'}
                  </p>
                  
                  {/* Key Points */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {[
                      locale === 'uk' ? 'Сертифіковані інгредієнти' : 'Сертифицированные ингредиенты',
                      locale === 'uk' ? 'Суворий контроль якості' : 'Строгий контроль качества',
                      locale === 'uk' ? 'Безпека та надійність' : 'Безопасность и надежность',
                      locale === 'uk' ? 'Преміальний смак' : 'Превосходный вкус',
                    ].map((point, idx) => (
                      <div key={idx} className="flex items-center space-x-3 text-gray-300">
                        <CheckCircle2 className="text-neon-cyan flex-shrink-0" size={20} />
                        <span className="text-sm md:text-base">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {/* Quality */}
            <div className="card text-center p-8 hover:border-neon-cyan/50 hover:shadow-2xl hover:shadow-neon-cyan/20 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Award className="text-white" size={40} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{locale === 'uk' ? 'Якість' : 'Качество'}</h3>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  {locale === 'uk'
                    ? 'Ми використовуємо тільки перевірені та сертифіковані інгредієнти від провідних виробників.'
                    : 'Мы используем только проверенные и сертифицированные ингредиенты от ведущих производителей.'}
                </p>
              </div>
            </div>

            {/* Taste */}
            <div className="card text-center p-8 hover:border-neon-purple/50 hover:shadow-2xl hover:shadow-neon-purple/20 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Heart className="text-white" size={40} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{locale === 'uk' ? 'Смак' : 'Вкус'}</h3>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  {locale === 'uk'
                    ? 'Інтенсивні та насичені аромати, які задовольнять навіть найвибагливіших поціновувачів.'
                    : 'Интенсивные и насыщенные ароматы, которые удовлетворят даже самых требовательных ценителей.'}
                </p>
              </div>
            </div>

            {/* Clients */}
            <div className="card text-center p-8 hover:border-neon-purple/50 hover:shadow-2xl hover:shadow-neon-purple/20 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Users className="text-white" size={40} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{locale === 'uk' ? 'Клієнти' : 'Клиенты'}</h3>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  {locale === 'uk'
                    ? 'Ваше задоволення — наш пріоритет. Ми завжди готові допомогти та відповісти на ваші питання.'
                    : 'Ваше удовлетворение — наш приоритет. Мы всегда готовы помочь и ответить на ваши вопросы.'}
                </p>
              </div>
            </div>

            {/* Innovations */}
            <div className="card text-center p-8 hover:border-neon-cyan/50 hover:shadow-2xl hover:shadow-neon-cyan/20 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Sparkles className="text-white" size={40} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{locale === 'uk' ? 'Інновації' : 'Инновации'}</h3>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                  {locale === 'uk'
                    ? 'Постійно розвиваємося та вдосконалюємо наші продукти, щоб задовольнити потреби клієнтів.'
                    : 'Постоянно развиваемся и совершенствуем наши продукты, чтобы удовлетворить потребности клиентов.'}
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className={`mt-16 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="card p-8 md:p-12 bg-gradient-to-br from-dark-card via-dark-card/80 to-dark-card border-2 border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                {locale === 'uk' ? 'Готові спробувати?' : 'Готовы попробовать?'}
              </h3>
              <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                {locale === 'uk' 
                  ? 'Перегляньте наш каталог преміальних рідин для вейпінгу та знайдіть свій ідеальний смак'
                  : 'Просмотрите наш каталог премиальных жидкостей для вейпинга и найдите свой идеальный вкус'}
              </p>
              <Link 
                href={`/${locale}/catalog`} 
                className="btn-primary inline-flex items-center space-x-2 text-lg group"
              >
                <span>{locale === 'uk' ? 'Перейти в каталог' : 'Перейти в каталог'}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


