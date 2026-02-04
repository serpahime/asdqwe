'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { toastManager } from '@/components/Toast';
import { useTranslations, useLocale } from '@/hooks/useTranslations';

export default function ContactsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toastManager.success(
        locale === 'uk'
          ? 'Повідомлення відправлено! Ми зв\'яжемося з вами найближчим часом.'
          : 'Сообщение отправлено! Мы свяжемся с вами в ближайшее время.'
      );
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1000);
  };

  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 text-center">
          <span className="gradient-text">{t.header.contacts}</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-dark-bg" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{locale === 'uk' ? 'Телефон' : 'Телефон'}</h3>
                  <a 
                    href="tel:+380501234567" 
                    className="text-neon-cyan hover:text-neon-purple transition-colors"
                  >
                    +38 (050) 123-45-67
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-dark-bg" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Email</h3>
                  <a 
                    href="mailto:info@juicelub.store" 
                    className="text-neon-cyan hover:text-neon-purple transition-colors"
                  >
                    info@juicelub.store
                  </a>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-blue rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="text-dark-bg" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{locale === 'uk' ? 'Години роботи' : 'Часы работы'}</h3>
                  <p className="text-gray-300">
                    {locale === 'uk' ? 'Пн-Пт: 9:00 - 20:00' : 'Пн-Пт: 9:00 - 20:00'}<br />
                    {locale === 'uk' ? 'Сб-Нд: 10:00 - 18:00' : 'Сб-Вс: 10:00 - 18:00'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">{locale === 'uk' ? 'Надішліть повідомлення' : 'Отправьте сообщение'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{locale === 'uk' ? 'Ім\'я' : 'Имя'}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{locale === 'uk' ? 'Телефон' : 'Телефон'}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{locale === 'uk' ? 'Повідомлення' : 'Сообщение'}</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Send size={20} />
                <span>{locale === 'uk' ? 'Відправити' : 'Отправить'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


