import { Truck, CreditCard, Package, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Доставка и оплата - JuiceLab',
  description: 'Условия доставки и оплаты заказов в JuiceLab. Быстрая доставка по всей стране.',
};

export default function DeliveryPage() {
  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 text-center">
          Доставка и <span className="gradient-text">оплата</span>
        </h1>

        {/* Delivery Methods */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 flex items-center space-x-3">
            <Truck className="text-neon-cyan" size={32} />
            <span>Способы доставки</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center mb-4">
                <Truck className="text-dark-bg" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Курьером</h3>
              <p className="text-gray-400 text-sm mb-4">
                Доставка курьером по вашему адресу в пределах города
              </p>
              <div className="text-neon-cyan font-semibold">От 50 ₴</div>
              <div className="text-gray-500 text-xs mt-1">1-2 рабочих дня</div>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center mb-4">
                <Package className="text-dark-bg" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Новой почтой</h3>
              <p className="text-gray-400 text-sm mb-4">
                Доставка в отделение Новой почты по всей Украине
              </p>
              <div className="text-neon-cyan font-semibold">От 40 ₴</div>
              <div className="text-gray-500 text-xs mt-1">2-3 рабочих дня</div>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-blue rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-dark-bg" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Самовывоз</h3>
              <p className="text-gray-400 text-sm mb-4">
                Забрать заказ самостоятельно из нашего офиса
              </p>
              <div className="text-neon-cyan font-semibold">Бесплатно</div>
              <div className="text-gray-500 text-xs mt-1">В день заказа</div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 flex items-center space-x-3">
            <CreditCard className="text-neon-cyan" size={32} />
            <span>Способы оплаты</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="text-dark-bg" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Банковской картой онлайн</h3>
                  <p className="text-gray-400 text-sm">
                    Безопасная оплата картой Visa, MasterCard через защищённый платёжный шлюз. 
                    Оплата происходит мгновенно.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="text-dark-bg" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Наличными при получении</h3>
                  <p className="text-gray-400 text-sm">
                    Оплата наличными курьеру или в отделении Новой почты при получении заказа. 
                    Доступно для всех способов доставки.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Условия доставки</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Сроки доставки</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Заказы обрабатываются в течение 24 часов</li>
                <li>Доставка курьером: 1-2 рабочих дня</li>
                <li>Доставка Новой почтой: 2-3 рабочих дня</li>
                <li>Самовывоз: в день заказа (при наличии товара)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Стоимость доставки</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>При заказе от 1000 ₴ — доставка бесплатная</li>
                <li>Курьером: от 50 ₴ (зависит от района)</li>
                <li>Новой почтой: от 40 ₴ (по тарифам перевозчика)</li>
                <li>Самовывоз: бесплатно</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Возврат и обмен</h3>
              <p className="text-sm">
                Вы можете вернуть товар в течение 14 дней с момента покупки при условии, 
                что товар не был использован и сохранён товарный вид. Возврат средств 
                осуществляется в течение 5-7 рабочих дней.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card bg-neon-cyan/10 border-neon-cyan/50 mt-8">
          <h3 className="text-xl font-semibold mb-2">Вопросы по доставке?</h3>
          <p className="text-gray-300 text-sm mb-4">
            Свяжитесь с нами, и мы ответим на все ваши вопросы
          </p>
          <a 
            href="/contacts" 
            className="text-neon-cyan hover:text-neon-purple transition-colors font-semibold"
          >
            Связаться с нами →
          </a>
        </div>
      </div>
    </div>
  );
}


