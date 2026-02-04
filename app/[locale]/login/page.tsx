'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { login } from '@/lib/referral/auth';
import { isAuthenticated } from '@/lib/referral/auth-client';
import { useLocale } from '@/hooks/useLocale';
import { toastManager } from '@/components/Toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push(`/${locale}/account`);
    }
  }, [router, locale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = login(email, password);

    if (result.success) {
      toastManager.success(
        locale === 'uk' ? 'Успішний вхід' : 'Успешный вход'
      );
      router.push(`/${locale}/account`);
    } else {
      toastManager.error(result.error || (locale === 'uk' ? 'Невірний email або пароль' : 'Неверный email или пароль'));
      setIsLoading(false);
    }
  };

  return (
    <div className="section-padding">
      <div className="container-custom max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">
              <span className="gradient-text">
                {locale === 'uk' ? 'Вхід' : 'Вход'}
              </span>
            </h1>
            <p className="text-gray-400">
              {locale === 'uk' ? 'Увійдіть до свого акаунту' : 'Войдите в свой аккаунт'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-dark-border border border-dark-border rounded-lg pl-10 pr-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {locale === 'uk' ? 'Пароль' : 'Пароль'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-dark-border border border-dark-border rounded-lg pl-10 pr-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary"
            >
              {isLoading
                ? locale === 'uk' ? 'Вхід...' : 'Вход...'
                : locale === 'uk' ? 'Увійти' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {locale === 'uk' ? 'Немає акаунту?' : 'Нет аккаунта?'}{' '}
              <Link
                href={`/${locale}/register`}
                className="text-neon-cyan hover:text-neon-purple font-medium"
              >
                {locale === 'uk' ? 'Зареєструватися' : 'Зарегистрироваться'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

