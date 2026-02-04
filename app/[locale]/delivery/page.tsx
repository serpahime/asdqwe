'use client';

import { Truck, CreditCard, Package, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from '@/hooks/useTranslations';

export default function DeliveryPage() {
  const locale = useLocale();

  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 text-center">
          {locale === 'uk' ? 'Доставка' : 'Доставка'} {locale === 'uk' ? 'та' : 'и'} <span className="gradient-text">{locale === 'uk' ? 'оплата' : 'оплата'}</span>
        </h1>

        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 flex items-center space-x-3">
            <Truck className="text-neon-cyan" size={32} />
            <span>{locale === 'uk' ? 'Способи доставки' : 'Способы доставки'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center mb-4">
                <Truck className="text-dark-bg" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{locale === 'uk' ? 'Кур\'єром' : 'Курьером'}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {locale === 'uk' ? 'Доставка кур\'єром за вашою адресою в межах міста' : 'Доставка курьером по вашему адресу в пределах города'}
              </p>
              <div className="text-neon-cyan font-semibold">{locale === 'uk' ? 'Від' : 'От'} 50 ₴</div>
              <div className="text-gray-500 text-xs mt-1">{locale === 'uk' ? '1-2 робочих дні' : '1-2 рабочих дня'}</div>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center mb-4">
                <Package className="text-dark-bg" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{locale === 'uk' ? 'Новою поштою' : 'Новой почтой'}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {locale === 'uk' ? 'Доставка у відділення Нової пошти по всій Україні' : 'Доставка в отделение Новой почты по всей Украине'}
              </p>
              <div className="text-neon-cyan font-semibold">{locale === 'uk' ? 'Від' : 'От'} 40 ₴</div>
              <div className="text-gray-500 text-xs mt-1">{locale === 'uk' ? '2-3 робочих дні' : '2-3 рабочих дня'}</div>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-blue rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-dark-bg" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{locale === 'uk' ? 'Самовивіз' : 'Самовывоз'}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {locale === 'uk' ? 'Забрати замовлення самостійно з нашого офісу' : 'Забрать заказ самостоятельно из нашего офиса'}
              </p>
              <div className="text-neon-cyan font-semibold">{locale === 'uk' ? 'Безкоштовно' : 'Бесплатно'}</div>
              <div className="text-gray-500 text-xs mt-1">{locale === 'uk' ? 'В день замовлення' : 'В день заказа'}</div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 flex items-center space-x-3">
            <CreditCard className="text-neon-cyan" size={32} />
            <span>{locale === 'uk' ? 'Способи оплати' : 'Способы оплаты'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="text-dark-bg" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{locale === 'uk' ? 'Банківською карткою онлайн' : 'Банковской картой онлайн'}</h3>
                  <p className="text-gray-400 text-sm">
                    {locale === 'uk' 
                      ? 'Безпечна оплата карткою Visa, MasterCard через захищений платіжний шлюз. Оплата відбувається миттєво.'
                      : 'Безопасная оплата картой Visa, MasterCard через защищённый платёжный шлюз. Оплата происходит мгновенно.'}
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
                  <h3 className="text-xl font-semibold mb-2">{locale === 'uk' ? 'Готівкою при отриманні' : 'Наличными при получении'}</h3>
                  <p className="text-gray-400 text-sm">
                    {locale === 'uk'
                      ? 'Оплата готівкою кур\'єру або у відділенні Нової пошти при отриманні замовлення. Доступно для всіх способів доставки.'
                      : 'Оплата наличными курьеру или в отделении Новой почты при получении заказа. Доступно для всех способов доставки.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">{locale === 'uk' ? 'Умови доставки' : 'Условия доставки'}</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">{locale === 'uk' ? 'Терміни доставки' : 'Сроки доставки'}</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>{locale === 'uk' ? 'Замовлення обробляються протягом 24 годин' : 'Заказы обрабатываются в течение 24 часов'}</li>
                <li>{locale === 'uk' ? 'Доставка кур\'єром: 1-2 робочих дні' : 'Доставка курьером: 1-2 рабочих дня'}</li>
                <li>{locale === 'uk' ? 'Доставка Новою поштою: 2-3 робочих дні' : 'Доставка Новой почтой: 2-3 рабочих дня'}</li>
                <li>{locale === 'uk' ? 'Самовивіз: в день замовлення (за наявності товару)' : 'Самовывоз: в день заказа (при наличии товара)'}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">{locale === 'uk' ? 'Вартість доставки' : 'Стоимость доставки'}</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>{locale === 'uk' ? 'При замовленні від 1000 ₴ — доставка безкоштовна' : 'При заказе от 1000 ₴ — доставка бесплатная'}</li>
                <li>{locale === 'uk' ? 'Кур\'єром: від 50 ₴ (залежить від району)' : 'Курьером: от 50 ₴ (зависит от района)'}</li>
                <li>{locale === 'uk' ? 'Новою поштою: від 40 ₴ (за тарифами перевізника)' : 'Новой почтой: от 40 ₴ (по тарифам перевозчика)'}</li>
                <li>{locale === 'uk' ? 'Самовивіз: безкоштовно' : 'Самовывоз: бесплатно'}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">{locale === 'uk' ? 'Повернення та обмін' : 'Возврат и обмен'}</h3>
              <div className="space-y-2 text-sm">
                <p>
                  {locale === 'uk'
                    ? 'Права Покупця щодо повернення та обміну товарів визначаються відповідно до Закону України «Про захист прав споживачів» та Постанови КМУ №172.'
                    : 'Права Покупателя относительно возврата и обмена товаров определяются в соответствии с Законом Украины «О защите прав потребителей» и Постановлением КМУ №172.'}
                </p>
                <p className="text-yellow-400 font-semibold">
                  ⚠️ {locale === 'uk'
                    ? 'ВАЖЛИВО: Рідини для вейпінгу належної якості не підлягають поверненню або обміну відповідно до Постанови КМУ №172, якщо вони відповідають заявленим характеристикам та не мають виробничих дефектів.'
                    : 'ВАЖНО: Жидкости для вейпинга надлежащего качества не подлежат возврату или обмену согласно Постановлению КМУ №172, если они соответствуют заявленным характеристикам и не имеют производственных дефектов.'}
                </p>
                <p>
                  {locale === 'uk'
                    ? 'При виявленні браку або невідповідності товару заявленим характеристикам, Покупець має право на повернення коштів або заміну товару протягом гарантійного терміну. Повернення коштів здійснюється протягом 5-7 робочих днів.'
                    : 'При выявлении брака или несоответствия товара заявленным характеристикам, Покупатель имеет право на возврат средств или замену товара в течение гарантийного срока. Возврат средств осуществляется в течение 5-7 рабочих дней.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-neon-cyan/10 border-neon-cyan/50 mt-8">
          <h3 className="text-xl font-semibold mb-2">{locale === 'uk' ? 'Питання з доставки?' : 'Вопросы по доставке?'}</h3>
          <p className="text-gray-300 text-sm mb-4">
            {locale === 'uk' ? 'Зв\'яжіться з нами, і ми відповімо на всі ваші питання' : 'Свяжитесь с нами, и мы ответим на все ваши вопросы'}
          </p>
          <Link 
            href={`/${locale}/contacts`}
            className="text-neon-cyan hover:text-neon-purple transition-colors font-semibold"
          >
            {locale === 'uk' ? 'Зв\'язатися з нами' : 'Связаться с нами'} →
          </Link>
        </div>
      </div>
    </div>
  );
}
