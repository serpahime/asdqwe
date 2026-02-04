'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { login, isAuthenticated } from '@/lib/admin/auth';
import { useLocale } from '@/hooks/useLocale';
import { toastManager } from '@/components/Toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated()) {
      router.push(`/${locale}/admin`);
    }
  }, [router, locale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Защита от множественной отправки
    if (isLoading) return;
    
    setIsLoading(true);

    // Небольшая задержка для предотвращения множественных вызовов
    setTimeout(() => {
      if (login(email.trim(), password)) {
        toastManager.success(
          locale === 'uk' ? 'Успішний вхід' : 'Успешный вход'
        );
        // Небольшая задержка перед редиректом, чтобы увидеть успешное сообщение
        setTimeout(() => {
          router.push(`/${locale}/admin`);
        }, 500);
      } else {
        toastManager.error(
          locale === 'uk' ? 'Невірний email або пароль' : 'Неверный email или пароль'
        );
        setIsLoading(false);
      }
    }, 100);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="text-gray-400">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">
              <span className="gradient-text">Admin Panel</span>
            </h1>
            <p className="text-gray-400">
              {locale === 'uk' ? 'Вхід до адмін-панелі' : 'Вход в админ-панель'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {locale === 'uk' ? 'Email' : 'Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-dark-border border border-dark-border rounded-lg pl-10 pr-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                  placeholder="admin@juicelub.store"
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

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <p className="text-sm text-blue-400">
              <strong>{locale === 'uk' ? 'Тестові дані:' : 'Тестовые данные:'}</strong>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Email: admin@juicelub.store
              <br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

