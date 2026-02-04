'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { logger } from '@/lib/logger';
import { usePathname } from 'next/navigation';

export default function AgeGate() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  // Отримуємо IP-адресу через зовнішній API
  useEffect(() => {
    const fetchIP = async () => {
      try {
        // Використовуємо безкоштовний сервіс для отримання IP
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
          const data = await response.json();
          setIpAddress(data.ip);
        }
      } catch (error) {
        // Якщо не вдалося отримати IP, просто не логуємо його
        console.debug('Failed to fetch IP address:', error);
      }
    };

    if (typeof window !== 'undefined') {
      fetchIP();
    }
  }, []);

  useEffect(() => {
    const ageConfirmed = localStorage.getItem('age_confirmed');
    if (!ageConfirmed) {
      setIsVisible(true);
    }
  }, []);

  const handleConfirm = async () => {
    const timestamp = new Date().toISOString();
    const currentPage = pathname || window.location.pathname;
    
    // Отримуємо session ID
    const sessionId = sessionStorage.getItem('juicelab_session_id') || 
                     `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    if (!sessionStorage.getItem('juicelab_session_id')) {
      sessionStorage.setItem('juicelab_session_id', sessionId);
    }

    // Отримуємо userId (якщо користувач авторизований)
    let userId: string | undefined;
    try {
      const authStr = localStorage.getItem('juicelab_user_auth');
      if (authStr) {
        const auth = JSON.parse(authStr);
        userId = auth.userId || auth.email;
      }
    } catch (e) {
      // Ignore
    }

    // Отримуємо IP (якщо ще не отримано)
    let ip = ipAddress;
    if (!ip) {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
          const data = await response.json();
          ip = data.ip;
        }
      } catch (error) {
        // Ignore
      }
    }

    // Логуємо підтвердження віку
    logger.logAgeVerification('confirmed', {
      userId: userId,
      sessionId,
      ipAddress: ip || undefined,
      timestamp,
      page: currentPage,
      userAgent: navigator.userAgent,
      locale,
      referrer: document.referrer || undefined,
    });

    // Зберігаємо підтвердження
    localStorage.setItem('age_confirmed', 'true');
    localStorage.setItem('age_confirmed_at', timestamp);
    localStorage.setItem('age_confirmed_page', currentPage);
    
    setIsVisible(false);
  };

  const handleDecline = () => {
    const timestamp = new Date().toISOString();
    const currentPage = pathname || window.location.pathname;
    
    // Отримуємо session ID
    const sessionId = sessionStorage.getItem('juicelab_session_id') || 
                     `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    if (!sessionStorage.getItem('juicelab_session_id')) {
      sessionStorage.setItem('juicelab_session_id', sessionId);
    }

    // Отримуємо userId (якщо користувач авторизований)
    let userId: string | undefined;
    try {
      const authStr = localStorage.getItem('juicelab_user_auth');
      if (authStr) {
        const auth = JSON.parse(authStr);
        userId = auth.userId || auth.email;
      }
    } catch (e) {
      // Ignore
    }

    // Отримуємо IP
    const ip = ipAddress;

    // Логуємо відмову
    logger.logAgeVerification('declined', {
      userId: userId,
      sessionId,
      ipAddress: ip || undefined,
      timestamp,
      page: currentPage,
      userAgent: navigator.userAgent,
      locale,
      referrer: document.referrer || undefined,
    });

    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-dark-bg/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-dark-card border-2 border-neon-cyan rounded-2xl p-8 max-w-md w-full text-center relative animate-glow">
        <div className="absolute top-4 right-4">
          <button
            onClick={handleDecline}
            className="text-gray-400 hover:text-neon-cyan transition-colors"
            aria-label="Закрыть"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-6xl font-bold gradient-text mb-4">18+</div>
          <h2 className="text-2xl font-display font-bold mb-4">
            {locale === 'uk' ? 'Вікове обмеження' : 'Возрастное ограничение'}
          </h2>
          <p className="text-gray-400 mb-6">
            {locale === 'uk'
              ? 'Даний сайт призначений тільки для осіб старше 18 років. Продукція містить нікотин. Підтвердіть, що вам виповнилося 18 років, щоб продовжити.'
              : 'Данный сайт предназначен только для лиц старше 18 лет. Продукция содержит никотин. Подтвердите, что вам исполнилось 18 лет, чтобы продолжить.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDecline}
            className="flex-1 px-6 py-3 border-2 border-dark-border text-gray-300 rounded-lg 
                     hover:border-neon-cyan hover:text-neon-cyan transition-colors font-medium"
          >
            {locale === 'uk' ? 'Мені немає 18' : 'Мне нет 18'}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 btn-primary"
          >
            {locale === 'uk' ? 'Мені є 18' : 'Мне есть 18'}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          {locale === 'uk'
            ? 'Вейпінг може шкодити вашому здоров\'ю. Містить нікотин.'
            : 'Вейпинг может вредить вашему здоровью. Содержит никотин.'}
        </p>
      </div>
    </div>
  );
}



