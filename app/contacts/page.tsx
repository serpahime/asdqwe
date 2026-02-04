'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { toastManager } from '@/components/Toast';

export default function ContactsPage() {
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

    // Симуляция отправки формы
    setTimeout(() => {
      setIsSubmitting(false);
      toastManager.success('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1000);
  };

  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 text-center">
          <span className="gradient-text">Контакты</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-dark-bg" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Телефон</h3>
                  <a 
                    href="tel:+380501234567" 
                    className="text-neon-cyan hover:text-neon-purple transition-colors"
                  >
                    +38 (050) 123-45-67
                  </a>
                  <p className="text-gray-400 text-sm mt-1">
                    Пн-Пт: 9:00 - 20:00
                  </p>
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
                  <p className="text-gray-400 text-sm mt-1">
                    Ответим в течение 24 часов
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-blue rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-dark-bg" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Адрес</h3>
                  <p className="text-gray-300">
                    г. Киев, ул. Примерная, 123
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Офис и пункт самовывоза
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="text-dark-bg" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Режим работы</h3>
                  <div className="text-gray-300 space-y-1 text-sm">
                    <p>Понедельник - Пятница: 9:00 - 20:00</p>
                    <p>Суббота: 10:00 - 18:00</p>
                    <p>Воскресенье: Выходной</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">Напишите нам</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Имя *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan text-white placeholder-gray-500"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan text-white placeholder-gray-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan text-white placeholder-gray-500"
                  placeholder="+38 (050) 123-45-67"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Сообщение *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan resize-none text-white placeholder-gray-500"
                  placeholder="Ваше сообщение..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
                <span>{isSubmitting ? 'Отправка...' : 'Отправить'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="card bg-dark-border h-64 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400">Карта будет здесь</p>
          </div>
        </div>
      </div>
    </div>
  );
}


