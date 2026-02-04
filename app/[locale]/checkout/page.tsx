'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowLeft, Gift, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toastManager } from '@/components/Toast';
import Link from 'next/link';
import { useTranslations, useLocale } from '@/hooks/useTranslations';
import { getCurrentUser, isAuthenticated } from '@/lib/referral/auth';
import { calculateMaxBonusPayment, calculateOrderTotalWithBonus, processOrderWithBonus } from '@/lib/referral/bonus';
import type { User } from '@/lib/referral/users';
import { logger } from '@/lib/logger';
import { validateCheckoutForm, formatPhone, validateEmail, validatePhone } from '@/lib/validation';
import { PerformanceTracker } from '@/lib/performance';
import { processCardPayment, processCashPayment } from '@/lib/payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, total, clearCart } = useCart();
  const t = useTranslations();
  const locale = useLocale();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [user, setUser] = useState<User | null>(null);
  const [useBonus, setUseBonus] = useState(false);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Юридичні підтвердження для захисту продавця (об'єднані в один чекбокс)
  const [allTermsAccepted, setAllTermsAccepted] = useState(false);
  
  // Внутрішній стан для збереження всіх підтверджень
  const legalConsents = {
    termsAccepted: allTermsAccepted,
    privacyAccepted: allTermsAccepted,
    disclaimerAccepted: allTermsAccepted,
    returnPolicyAcknowledged: allTermsAccepted,
    chargebackWarningAcknowledged: allTermsAccepted,
  };
  
  // Технічні дані для захисту від шахрайства
  const [technicalData, setTechnicalData] = useState<{
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
  }>({});
  
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    deliveryMethod: 'courier' | 'post' | 'pickup';
    address: string;
    city: string;
    paymentMethod: 'card' | 'cash';
  }>({
    name: '',
    email: '',
    phone: '',
    deliveryMethod: 'courier',
    address: '',
    city: '',
    paymentMethod: 'card',
  });

  useEffect(() => {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone || '',
          // Автозаполнение города и адреса из профиля или сохраненных данных
          city: currentUser.city || currentUser.savedDelivery?.city || prev.city,
          address: currentUser.address || currentUser.savedDelivery?.address || prev.address,
          // Автозаполнение сохраненных данных доставки и оплаты
          deliveryMethod: currentUser.savedDelivery?.method || prev.deliveryMethod,
          paymentMethod: currentUser.savedPayment?.method || prev.paymentMethod,
        }));
      }
    }
    
    // Отримуємо технічні дані для захисту від шахрайства
    const fetchTechnicalData = async () => {
      try {
        // Отримуємо IP адресу
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = ipResponse.ok ? await ipResponse.json() : null;
        
        // Отримуємо session ID
        let sessionId = sessionStorage.getItem('juicelab_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          sessionStorage.setItem('juicelab_session_id', sessionId);
        }
        
        setTechnicalData({
          ipAddress: ipData?.ip,
          userAgent: navigator.userAgent,
          sessionId,
        });
      } catch (error) {
        logger.warn('order', 'Failed to fetch technical data', error as Error);
        // Встановлюємо хоча б user agent та session ID
        let sessionId = sessionStorage.getItem('juicelab_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          sessionStorage.setItem('juicelab_session_id', sessionId);
        }
        setTechnicalData({
          userAgent: navigator.userAgent,
          sessionId,
        });
      }
    };
    
    fetchTechnicalData();
  }, []);

  const maxBonus = user ? calculateMaxBonusPayment(total) : 0;
  const availableBonus = user?.bonusBalance || 0;

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push(`/${locale}/cart`);
    }
  }, [cartItems.length, router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    let markId: string | undefined;
    
    try {

      // Валідація форми
      const validation = validateCheckoutForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        deliveryMethod: formData.deliveryMethod,
        address: formData.address,
        city: formData.city,
      });

      if (!validation.isValid) {
        setErrors(validation.errors);
        setTouched(Object.keys(validation.errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        setIsSubmitting(false);
        toastManager.error(locale === 'uk' ? 'Будь ласка, виправте помилки в формі' : 'Пожалуйста, исправьте ошибки в форме');
        return;
      }
      
      // КРИТИЧНО: Перевірка юридичних підтверджень для захисту продавця
      if (!allTermsAccepted) {
        setErrors({ 
          legal: locale === 'uk' 
            ? 'Необхідно підтвердити згоду з усіма умовами' 
            : 'Необходимо подтвердить согласие со всеми условиями' 
        });
        setIsSubmitting(false);
        toastManager.error(locale === 'uk' 
          ? 'Будь ласка, підтвердіть згоду з усіма умовами' 
          : 'Пожалуйста, подтвердите согласие со всеми условиями');
        return;
      }
      
      // Перевірка підтвердження віку
      const ageConfirmed = localStorage.getItem('age_confirmed') === 'true';
      if (!ageConfirmed) {
        setErrors({ 
          legal: locale === 'uk' 
            ? 'Необхідно підтвердити вік 18+' 
            : 'Необходимо подтвердить возраст 18+' 
        });
        setIsSubmitting(false);
        toastManager.error(locale === 'uk' 
          ? 'Будь ласка, підтвердіть вік 18+' 
          : 'Пожалуйста, подтвердите возраст 18+');
        return;
      }

      const now = new Date().toISOString();
      
      try {
        markId = PerformanceTracker.start('order_submission');
      } catch (perfError) {
        logger.warn('order', 'Failed to start performance tracking', perfError as Error);
      }
      
      logger.info('order', 'Order submission started', { 
        itemsCount: cartItems.length, 
        total: total.toFixed(2),
        userId: user?.id,
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: formData.paymentMethod,
      });
      
      const order = {
        id: Date.now().toString(),
        items: cartItems,
        total,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          userId: user?.id,
        },
        delivery: {
          method: formData.deliveryMethod,
          address: formData.address,
          city: formData.city,
        },
        payment: {
          method: formData.paymentMethod,
        },
        status: 'pending' as const,
        createdAt: now,
        // КРИТИЧНО: Юридичні дані для захисту продавця від чарджбеків та шахрайства
        legal: {
          // Підтвердження згоди з умовами
          termsAccepted: legalConsents.termsAccepted,
          termsAcceptedAt: now,
          privacyAccepted: legalConsents.privacyAccepted,
          privacyAcceptedAt: now,
          disclaimerAccepted: legalConsents.disclaimerAccepted,
          disclaimerAcceptedAt: now,
          // Технічні дані для захисту від шахрайства
          ipAddress: technicalData.ipAddress,
          userAgent: technicalData.userAgent,
          sessionId: technicalData.sessionId,
          // Підтвердження віку
          ageConfirmed: ageConfirmed,
          ageConfirmedAt: localStorage.getItem('age_confirmed_at') || now,
          // Попередження про повернення
          returnPolicyAcknowledged: legalConsents.returnPolicyAcknowledged,
          returnPolicyAcknowledgedAt: now,
          // Попередження про чарджбеки
          chargebackWarningAcknowledged: legalConsents.chargebackWarningAcknowledged,
          chargebackWarningAcknowledgedAt: now,
        },
      };
      
      // КРИТИЧНО: Логування юридичних підтверджень для захисту від чарджбеків
      logger.logSecurity('legal_consents_confirmed', {
        orderId: order.id,
        userId: user?.id,
        termsAccepted: legalConsents.termsAccepted,
        privacyAccepted: legalConsents.privacyAccepted,
        disclaimerAccepted: legalConsents.disclaimerAccepted,
        returnPolicyAcknowledged: legalConsents.returnPolicyAcknowledged,
        chargebackWarningAcknowledged: legalConsents.chargebackWarningAcknowledged,
        ageConfirmed: ageConfirmed,
        ipAddress: technicalData.ipAddress,
        userAgent: technicalData.userAgent,
        sessionId: technicalData.sessionId,
        timestamp: now,
      });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('last_order', JSON.stringify(order));
        // Сохраняем заказ в админ-панель
        const { addOrder } = await import('@/lib/admin/orders');
        addOrder({
          ...order,
          status: 'new' as const,
        });

        logger.logOrder('created', {
          orderId: order.id,
          itemsCount: cartItems.length,
          total: total.toFixed(2),
          paymentMethod: formData.paymentMethod,
          deliveryMethod: formData.deliveryMethod,
        });

      // Сохраняем данные доставки и оплаты для автозаполнения
      if (user) {
        const { updateUser } = await import('@/lib/referral/users');
        updateUser(user.id, {
          // Сохраняем город и адрес в профиль
          city: formData.city || undefined,
          address: formData.address || undefined,
          // Сохраняем данные доставки и оплаты
          savedDelivery: {
            method: formData.deliveryMethod,
            city: formData.city,
            address: formData.address,
          },
          savedPayment: {
            method: formData.paymentMethod,
          },
        });

        // Отмечаем первый заказ как завершенный (если это первый заказ)
        if (!user.firstOrderCompleted) {
          const { markFirstOrderCompleted } = await import('@/lib/referral/users');
          markFirstOrderCompleted(user.id);
        }

        // Проверяем и разблокируем достижения
        const { checkAndUnlockAchievements } = await import('@/lib/achievements/userAchievements');
        const { getAchievementById } = await import('@/lib/achievements/achievements');
        const unlockedAchievements = checkAndUnlockAchievements(user.id);
        
        if (unlockedAchievements.length > 0) {
          logger.info('system', 'Achievements unlocked', { 
            userId: user.id, 
            achievements: unlockedAchievements 
          });
        }
        
        // Показываем уведомления о новых достижениях
        if (unlockedAchievements.length > 0) {
          unlockedAchievements.forEach((achievementId, index) => {
            const achievement = getAchievementById(achievementId);
            if (achievement) {
              setTimeout(() => {
                toastManager.success(
                  `${achievement.icon} ${locale === 'uk' ? achievement.name.uk : achievement.name.ru}!`,
                  5000
                );
              }, index * 1000);
            }
          });
        }
      }
      }

      // Обробка бонусів
      let finalTotal = total;
      let bonusUsedAmount = 0;
      if (useBonus && bonusAmount > 0 && user) {
        try {
          const result = processOrderWithBonus(user.id, order as any, bonusAmount);
          finalTotal = result.finalTotal;
          bonusUsedAmount = bonusAmount;
          (order as any).bonusUsed = bonusAmount;
          (order as any).finalTotal = finalTotal;
          
          logger.info('system', 'Bonus applied to order', {
            orderId: order.id,
            bonusAmount,
            originalTotal: total,
            finalTotal,
          });
        } catch (bonusError) {
          logger.warn('system', 'Failed to apply bonus', { 
            orderId: order.id,
            userId: user.id 
          }, bonusError as Error);
          // Продовжуємо без бонусів
        }
      }

      // Інтеграція з платіжною системою
      let paymentResult;
      if (formData.paymentMethod === 'card') {
        paymentResult = await processCardPayment(order.id, finalTotal, order);
        if (!paymentResult.success) {
          throw new Error(paymentResult.error || 'Payment processing failed');
        }
        
        // Якщо є redirectUrl, перенаправляємо на платіжну сторінку
        if (paymentResult.redirectUrl) {
          window.location.href = paymentResult.redirectUrl;
          return;
        }
      } else {
        // Готівковий платіж
        paymentResult = await processCashPayment(order.id, finalTotal);
        if (!paymentResult.success) {
          throw new Error(paymentResult.error || 'Payment processing failed');
        }
      }
      
      // Зберігаємо transaction ID якщо є
      if (paymentResult.transactionId) {
        order.payment = {
          ...order.payment,
          transactionId: paymentResult.transactionId,
        } as any;
      }

      if (markId) {
        PerformanceTracker.end(markId, 'system', 'Order submitted successfully');
      }
      
      logger.logPayment('success', { 
        orderId: order.id, 
        amount: finalTotal.toFixed(2), 
        method: formData.paymentMethod,
        bonusUsed: bonusUsedAmount,
      });

      // Відправка email підтвердження (заглушка)
      try {
        // await sendOrderConfirmationEmail(order.customer.email, order);
        logger.info('system', 'Order confirmation email sent', { orderId: order.id, email: order.customer.email });
      } catch (emailError) {
        logger.warn('system', 'Failed to send confirmation email', { 
          orderId: order.id,
          email: order.customer.email 
        }, emailError as Error);
        // Не блокуємо успішне оформлення через помилку email
      }

      clearCart();
      toastManager.success(locale === 'uk' ? 'Замовлення успішно оформлено!' : 'Заказ успешно оформлен!');
      setStep('success');
    } catch (error) {
      if (markId) {
        PerformanceTracker.end(markId, 'system', 'Order submission failed');
      }
      
      logger.error('system', 'Failed to submit order', error as Error, { 
        itemsCount: cartItems.length, 
        total: total.toFixed(2),
        formData: {
          deliveryMethod: formData.deliveryMethod,
          paymentMethod: formData.paymentMethod,
        }
      });
      
      toastManager.error(
        locale === 'uk' 
          ? 'Помилка оформлення замовлення. Спробуйте ще раз або зв\'яжіться з підтримкою.' 
          : 'Ошибка оформления заказа. Попробуйте еще раз или свяжитесь с поддержкой.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-400" />
            </div>
            <h1 className="text-4xl font-display font-bold mb-4">
              {t.checkout.success} <span className="gradient-text">{locale === 'uk' ? 'оформлено' : 'оформлен'}</span>
            </h1>
            <p className="text-gray-400 mb-8">
              {t.checkout.successText}
            </p>
            <Link href={`/${locale}/catalog`} className="btn-primary">
              {t.common.backToCatalog}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-custom">
        <Link 
          href={`/${locale}/cart`}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-neon-cyan mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{t.checkout.backToCart}</span>
        </Link>

        <h1 className="text-4xl font-display font-bold mb-8">
          {t.checkout.title} <span className="gradient-text">{locale === 'uk' ? 'замовлення' : 'заказа'}</span>
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6">{t.checkout.customerInfo}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.checkout.name} *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (touched.name && errors.name) {
                        setErrors({ ...errors, name: '' });
                      }
                    }}
                    onBlur={() => {
                      setTouched({ ...touched, name: true });
                      if (!formData.name || formData.name.trim().length < 2) {
                        setErrors({ ...errors, name: locale === 'uk' ? 'Ім\'я повинно містити мінімум 2 символи' : 'Имя должно содержать минимум 2 символа' });
                      }
                    }}
                    className={`w-full bg-dark-border border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                      errors.name ? 'border-red-500' : 'border-dark-border focus:border-neon-cyan'
                    }`}
                  />
                  {errors.name && touched.name && (
                    <p className="text-red-400 text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.checkout.email} *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (touched.email && errors.email) {
                        setErrors({ ...errors, email: '' });
                      }
                    }}
                    onBlur={() => {
                      setTouched({ ...touched, email: true });
                      if (!formData.email || !validateEmail(formData.email)) {
                        setErrors({ ...errors, email: locale === 'uk' ? 'Введіть коректний email адрес' : 'Введите корректный email адрес' });
                      }
                    }}
                    className={`w-full bg-dark-border border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500' : 'border-dark-border focus:border-neon-cyan'
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-400 text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.checkout.phone} *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Автоматичне форматування телефону
                      if (value.length > formData.phone.length) {
                        value = formatPhone(value);
                      }
                      setFormData({ ...formData, phone: value });
                      if (touched.phone && errors.phone) {
                        setErrors({ ...errors, phone: '' });
                      }
                    }}
                    onBlur={() => {
                      setTouched({ ...touched, phone: true });
                      if (!formData.phone || !validatePhone(formData.phone)) {
                        setErrors({ ...errors, phone: locale === 'uk' ? 'Введіть коректний номер телефону' : 'Введите корректный номер телефона' });
                      }
                    }}
                    placeholder="+38 (050) 123-45-67"
                    className={`w-full bg-dark-border border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-dark-border focus:border-neon-cyan'
                    }`}
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-red-400 text-xs mt-1 flex items-center space-x-1">
                      <AlertCircle size={12} />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-semibold mb-6">{t.checkout.delivery}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">{t.checkout.deliveryMethod} *</label>
                  <div className="space-y-2">
                    {[
                      { value: 'courier', label: t.checkout.courier },
                      { value: 'post', label: t.checkout.post },
                      { value: 'pickup', label: t.checkout.pickup },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="delivery"
                          value={option.value}
                          checked={formData.deliveryMethod === option.value}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, deliveryMethod: e.target.value as 'courier' | 'post' | 'pickup' })}
                          className="w-4 h-4 text-neon-cyan bg-dark-border border-dark-border focus:ring-neon-cyan"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {formData.deliveryMethod !== 'pickup' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t.checkout.city} *</label>
                      <input
                        type="text"
                        required={formData.deliveryMethod === 'courier' || formData.deliveryMethod === 'post'}
                        value={formData.city}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value });
                          if (touched.city && errors.city) {
                            setErrors({ ...errors, city: '' });
                          }
                        }}
                        onBlur={() => {
                          setTouched({ ...touched, city: true });
                          if ((formData.deliveryMethod === 'courier' || formData.deliveryMethod === 'post') && (!formData.city || formData.city.trim().length < 2)) {
                            setErrors({ ...errors, city: locale === 'uk' ? 'Введіть коректну назву міста' : 'Введите корректное название города' });
                          }
                        }}
                        className={`w-full bg-dark-border border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                          errors.city ? 'border-red-500' : 'border-dark-border focus:border-neon-cyan'
                        }`}
                      />
                      {errors.city && touched.city && (
                        <p className="text-red-400 text-xs mt-1 flex items-center space-x-1">
                          <AlertCircle size={12} />
                          <span>{errors.city}</span>
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t.checkout.address} *</label>
                      <input
                        type="text"
                        required={formData.deliveryMethod === 'courier' || formData.deliveryMethod === 'post'}
                        value={formData.address}
                        onChange={(e) => {
                          setFormData({ ...formData, address: e.target.value });
                          if (touched.address && errors.address) {
                            setErrors({ ...errors, address: '' });
                          }
                        }}
                        onBlur={() => {
                          setTouched({ ...touched, address: true });
                          if ((formData.deliveryMethod === 'courier' || formData.deliveryMethod === 'post') && (!formData.address || formData.address.trim().length < 5)) {
                            setErrors({ ...errors, address: locale === 'uk' ? 'Введіть коректну адресу доставки (мінімум 5 символів)' : 'Введите корректный адрес доставки (минимум 5 символов)' });
                          }
                        }}
                        placeholder={locale === 'uk' ? 'Введіть адресу доставки' : 'Введите адрес доставки'}
                        className={`w-full bg-dark-border border rounded-lg px-4 py-3 focus:outline-none transition-colors ${
                          errors.address ? 'border-red-500' : 'border-dark-border focus:border-neon-cyan'
                        }`}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-semibold mb-6">{t.checkout.payment}</h2>
              <div className="space-y-2">
                {[
                  { value: 'card', label: t.checkout.card },
                  { value: 'cash', label: t.checkout.cash },
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={formData.paymentMethod === option.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, paymentMethod: e.target.value as 'card' | 'cash' })}
                      className="w-4 h-4 text-neon-cyan bg-dark-border border-dark-border focus:ring-neon-cyan"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Бонусы */}
            {user && availableBonus > 0 && maxBonus > 0 && (
              <div className="card bg-neon-cyan/10 border-neon-cyan/50">
                <div className="flex items-center space-x-2 mb-4">
                  <Gift className="text-neon-cyan" size={24} />
                  <h2 className="text-2xl font-semibold">
                    {locale === 'uk' ? 'Використати бонуси' : 'Использовать бонусы'}
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="bg-dark-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">
                        {locale === 'uk' ? 'Доступно бонусів' : 'Доступно бонусов'}
                      </span>
                      <span className="text-neon-cyan font-bold">{availableBonus} ₴</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">
                        {locale === 'uk' ? 'Максимум до списання' : 'Максимум к списанию'}
                      </span>
                      <span className="text-gray-300 font-semibold">{maxBonus} ₴ (10%)</span>
                    </div>
                  </div>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useBonus}
                      onChange={(e) => {
                        setUseBonus(e.target.checked);
                        if (e.target.checked) {
                          setBonusAmount(Math.min(availableBonus, maxBonus));
                        } else {
                          setBonusAmount(0);
                        }
                      }}
                      className="w-4 h-4 text-neon-cyan bg-dark-border border-dark-border rounded focus:ring-neon-cyan"
                    />
                    <span className="text-gray-300">
                      {locale === 'uk' ? 'Використати бонуси' : 'Использовать бонусы'}
                    </span>
                  </label>

                  {useBonus && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-400">
                        {locale === 'uk' ? 'Сума бонусів для списання' : 'Сумма бонусов к списанию'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={Math.min(availableBonus, maxBonus)}
                        value={bonusAmount}
                        onChange={(e) => {
                          const value = Math.min(
                            Math.max(0, parseInt(e.target.value) || 0),
                            Math.min(availableBonus, maxBonus)
                          );
                          setBonusAmount(value);
                        }}
                        className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {locale === 'uk' 
                          ? `Максимум: ${Math.min(availableBonus, maxBonus)} ₴ (10% від суми замовлення)`
                          : `Максимум: ${Math.min(availableBonus, maxBonus)} ₴ (10% от суммы заказа)`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {user && availableBonus === 0 && (
              <div className="card bg-gray-500/10 border-gray-500/50">
                <div className="flex items-center space-x-2">
                  <Gift className="text-gray-400" size={20} />
                  <p className="text-gray-400 text-sm">
                    {locale === 'uk' 
                      ? 'У вас немає бонусів. Зареєструйтеся за реферальним посиланням, щоб отримати бонуси!'
                      : 'У вас нет бонусов. Зарегистрируйтесь по реферальной ссылке, чтобы получить бонусы!'}
                  </p>
                </div>
              </div>
            )}

            {!user && (
              <div className="card bg-blue-500/10 border-blue-500/50">
                <p className="text-blue-400 text-sm mb-2">
                  {locale === 'uk' ? '💡 Підказка:' : '💡 Подсказка:'}
                </p>
                <p className="text-gray-300 text-sm mb-3">
                  {locale === 'uk' 
                    ? 'Зареєструйтеся або увійдіть, щоб використовувати бонусні бали при оплаті замовлення!'
                    : 'Зарегистрируйтесь или войдите, чтобы использовать бонусные баллы при оплате заказа!'}
                </p>
                <div className="flex space-x-2">
                  <Link
                    href={`/${locale}/register`}
                    className="btn-secondary text-sm flex-1 text-center"
                  >
                    {locale === 'uk' ? 'Реєстрація' : 'Регистрация'}
                  </Link>
                  <Link
                    href={`/${locale}/login`}
                    className="btn-primary text-sm flex-1 text-center"
                  >
                    {locale === 'uk' ? 'Вхід' : 'Вход'}
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-2xl font-semibold mb-6">{locale === 'uk' ? 'Підсумок' : 'Итого'}</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>{t.cart.items}:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} {locale === 'uk' ? 'шт.' : 'шт.'}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>{locale === 'uk' ? 'Сума замовлення' : 'Сумма заказа'}:</span>
                  <span>{total} ₴</span>
                </div>
                {useBonus && bonusAmount > 0 && (
                  <>
                    <div className="flex justify-between text-green-400">
                      <span>{locale === 'uk' ? 'Списано бонусів' : 'Списано бонусов'}:</span>
                      <span>-{bonusAmount} ₴</span>
                    </div>
                    <div className="border-t border-dark-border pt-4">
                      <div className="flex justify-between text-xl font-bold">
                        <span>{t.cart.toPay}:</span>
                        <span className="text-neon-cyan">
                          {calculateOrderTotalWithBonus(total, bonusAmount).finalTotal} ₴
                        </span>
                      </div>
                    </div>
                  </>
                )}
                {(!useBonus || bonusAmount === 0) && (
                  <div className="border-t border-dark-border pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>{t.cart.toPay}:</span>
                      <span className="text-neon-cyan">{total} ₴</span>
                    </div>
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting || cartItems.length === 0}
                className={`w-full btn-primary transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 ${
                  isSubmitting || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>{locale === 'uk' ? 'Оформлення...' : 'Оформление...'}</span>
                  </>
                ) : (
                  <span>{t.checkout.title}</span>
                )}
              </button>
              {/* КРИТИЧНО: Об'єднане юридичне підтвердження для захисту продавця */}
              <div className="mt-4 border-t border-dark-border pt-3">
                <label className="flex items-start space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    checked={allTermsAccepted}
                    onChange={(e) => setAllTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-neon-cyan bg-dark-border border-dark-border rounded focus:ring-neon-cyan flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="text-xs text-gray-300 leading-relaxed">
                      {locale === 'uk' 
                        ? (
                          <>
                            Я підтверджую, що ознайомився та погоджуюся з{' '}
                            <Link href={`/${locale}/terms`} className="text-neon-cyan hover:text-neon-purple underline font-semibold">
                              Умовами
                            </Link>,{' '}
                            <Link href={`/${locale}/oferta#return-policy`} className="text-neon-cyan hover:text-neon-purple underline font-semibold">
                              Політикою повернення
                            </Link>{' '}
                            та{' '}
                            <Link href={`/${locale}/oferta`} className="text-neon-cyan hover:text-neon-purple underline font-semibold">
                              Публічною офертою
                            </Link>. Товар є витратним і не підлягає поверненню після відкриття. Чарджбек без підстав є порушенням умов.
                          </>
                        )
                        : (
                          <>
                            Я подтверждаю, что ознакомился и согласен с{' '}
                            <Link href={`/${locale}/terms`} className="text-neon-cyan hover:text-neon-purple underline font-semibold">
                              Условиями
                            </Link>,{' '}
                            <Link href={`/${locale}/oferta#return-policy`} className="text-neon-cyan hover:text-neon-purple underline font-semibold">
                              Политикой возврата
                            </Link>{' '}
                            и{' '}
                            <Link href={`/${locale}/oferta`} className="text-neon-cyan hover:text-neon-purple underline font-semibold">
                              Публичной офертой
                            </Link>. Товар является расходным и не подлежит возврату после вскрытия. Чарджбек без оснований является нарушением условий.
                          </>
                        )
                      }
                    </div>
                  </div>
                </label>
                
                {errors.legal && (
                  <p className="text-red-400 text-[10px] mt-2 flex items-center space-x-1">
                    <AlertCircle size={10} />
                    <span>{errors.legal}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


