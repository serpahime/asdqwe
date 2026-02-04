'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Phone, Gift } from 'lucide-react';
import { register } from '@/lib/referral/auth';
import { isAuthenticated } from '@/lib/referral/auth-client';
import { useLocale } from '@/hooks/useLocale';
import { toastManager } from '@/components/Toast';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const referralCode = searchParams?.get('ref') || '';

  useEffect(() => {
    if (isAuthenticated()) {
      router.push(`/${locale}/account`);
    }
  }, [router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Валидация
    if (formData.password !== formData.confirmPassword) {
      toastManager.error(
        locale === 'uk' ? 'Паролі не співпадають' : 'Пароли не совпадают'
      );
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toastManager.error(
        locale === 'uk' ? 'Пароль повинен містити мінімум 6 символів' : 'Пароль должен содержать минимум 6 символов'
      );
      setIsLoading(false);
      return;
    }

    // Регистрация
    const result = register(
      formData.email,
      formData.name,
      formData.password,
      formData.phone || undefined,
      referralCode || undefined
    );

    if (result.success && result.user) {
      toastManager.success(
        locale === 'uk' 
          ? `Реєстрація успішна! ${result.user.bonusBalance > 0 ? `Ви отримали ${result.user.bonusBalance} грн бонусів!` : ''}`
          : `Регистрация успешна! ${result.user.bonusBalance > 0 ? `Вы получили ${result.user.bonusBalance} грн бонусов!` : ''}`
      );
      router.push(`/${locale}/account`);
    } else {
      toastManager.error(result.error || (locale === 'uk' ? 'Помилка реєстрації' : 'Ошибка регистрации'));
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
                {locale === 'uk' ? 'Реєстрація' : 'Регистрация'}
              </span>
            </h1>
            {referralCode && (
              <div className="mt-4 p-3 bg-neon-cyan/10 border border-neon-cyan/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-neon-cyan">
                  <Gift size={20} />
                  <p className="text-sm font-medium">
                    {locale === 'uk' ? 'Ви зареєстровані за реферальним посиланням!' : 'Вы зарегистрированы по реферальной ссылке!'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {locale === 'uk' ? 'Ім\'я' : 'Имя'} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-dark-border border border-dark-border rounded-lg pl-10 pr-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                  placeholder={locale === 'uk' ? 'Ваше ім\'я' : 'Ваше имя'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-dark-border border border-dark-border rounded-lg pl-10 pr-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {locale === 'uk' ? 'Телефон' : 'Телефон'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-dark-border border border-dark-border rounded-lg pl-10 pr-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                  placeholder="+38 (050) 123-45-67"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {locale === 'uk' ? 'Пароль' : 'Пароль'} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full bg-dark-border border border-dark-border rounded-lg pl-10 pr-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {locale === 'uk' ? 'Підтвердження пароля' : 'Подтверждение пароля'} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
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
                ? locale === 'uk' ? 'Реєстрація...' : 'Регистрация...'
                : locale === 'uk' ? 'Зареєструватися' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {locale === 'uk' ? 'Вже є акаунт?' : 'Уже есть аккаунт?'}{' '}
              <Link
                href={`/${locale}/login`}
                className="text-neon-cyan hover:text-neon-purple font-medium"
              >
                {locale === 'uk' ? 'Увійти' : 'Войти'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

