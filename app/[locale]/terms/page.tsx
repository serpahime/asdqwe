'use client';

import Link from 'next/link';
import { useLocale } from '@/hooks/useTranslations';

export default function TermsPage() {
  const locale = useLocale();
  const isUk = locale === 'uk';

  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">
          {isUk ? 'Умови' : 'Условия'} <span className="gradient-text">{isUk ? 'використання' : 'использования'}</span>
        </h1>

        <div className="card space-y-6">
          <section className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-6">
            <p className="text-blue-400 font-semibold mb-3">
              ℹ️ {isUk ? 'Інформаційна сторінка' : 'Информационная страница'}
            </p>
            <p className="text-gray-300 leading-relaxed">
              {isUk 
                ? 'Ця сторінка містить загальну інформацію про умови використання сайту JuiceLab. Повний договір купівлі-продажу, включаючи всі умови та обмеження, міститься в'
                : 'Эта страница содержит общую информацию об условиях использования сайта JuiceLab. Полный договор купли-продажи, включая все условия и ограничения, содержится в'}{' '}
              <Link href={`/${locale}/oferta`} className="text-neon-cyan hover:text-neon-purple underline font-semibold">
                {isUk ? 'Публічній оферті' : 'Публичной оферте'}
              </Link>, {isUk ? 'яка є основним юридичним документом.' : 'которая является основным юридическим документом.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{isUk ? '1. Загальні умови' : '1. Общие условия'}</h2>
            <p className="text-gray-300 leading-relaxed">
              {isUk 
                ? 'Використовуючи сайт JuiceLab, ви погоджуєтеся з умовами, викладеними в Публічній оферті. Детальні умови купівлі-продажу, повернення товарів, відповідальності та інші важливі положення містяться в повному тексті оферти.'
                : 'Используя сайт JuiceLab, вы соглашаетесь с условиями, изложенными в Публичной оферте. Детальные условия купли-продажи, возврата товаров, ответственности и другие важные положения содержатся в полном тексте оферты.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{isUk ? '2. Вікові обмеження' : '2. Возрастные ограничения'}</h2>
            <div className="bg-red-500/10 border-2 border-red-500/70 rounded-lg p-6 mb-4">
              <p className="text-red-400 font-bold text-lg mb-4">⚠️ {isUk ? 'КРИТИЧНО ВАЖЛИВО!' : 'КРИТИЧЕСКИ ВАЖНО!'}</p>
              <div className="space-y-3 text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">2.1.</strong> {isUk ? 'Продаж нікотиновмісної продукції особам, які не досягли 18 років, заборонений законодавством України.' : 'Продажа никотиносодержащей продукции лицам, не достигшим 18 лет, запрещена законодательством Украины.'}
                </p>
                <p>
                  <strong className="text-white">2.2.</strong> {isUk ? 'Наш сайт призначений тільки для осіб старше 18 років. Покупуючи товари на нашому сайті, ви підтверджуєте, що вам виповнилося 18 років.' : 'Наш сайт предназначен только для лиц старше 18 лет. Покупая товары на нашем сайте, вы подтверждаете, что вам исполнилось 18 лет.'}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{isUk ? '3. Основні положення' : '3. Основные положения'}</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                {isUk 
                  ? 'Детальна інформація про замовлення, оплату, доставку, повернення товарів, відповідальність сторін та інші умови міститься в'
                  : 'Детальная информация о заказах, оплате, доставке, возврате товаров, ответственности сторон и других условиях содержится в'}{' '}
                <Link href={`/${locale}/oferta`} className="text-neon-cyan hover:text-neon-purple underline font-semibold">
                  {isUk ? 'Публічній оферті' : 'Публичной оферте'}
                </Link>.
              </p>
              <p>
                {isUk 
                  ? 'Рекомендуємо ознайомитися з повним текстом оферти перед оформленням замовлення.'
                  : 'Рекомендуем ознакомиться с полным текстом оферты перед оформлением заказа.'}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{isUk ? '4. Інтелектуальна власність' : '4. Интеллектуальная собственность'}</h2>
            <p className="text-gray-300 leading-relaxed">
              {isUk
                ? 'Весь контент сайту, включаючи тексти, зображення, логотипи, є власністю JuiceLab та захищений законами про інтелектуальну власність.'
                : 'Весь контент сайта, включая тексты, изображения, логотипы, является собственностью JuiceLab и защищён законами об интеллектуальной собственности.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{isUk ? '5. Контакти' : '5. Контакты'}</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              {isUk
                ? 'З питань, пов\'язаних з умовами використання, звертайтесь:'
                : 'По вопросам, связанным с условиями использования, обращайтесь:'}
            </p>
            <div className="bg-dark-border rounded-lg p-4 space-y-2 text-gray-300">
              <p>
                <strong className="text-white">Email:</strong> <a href="mailto:info@juicelub.store" className="text-neon-cyan hover:text-neon-purple">info@juicelub.store</a>
              </p>
              <p>
                <strong className="text-white">{isUk ? 'Телефон' : 'Телефон'}:</strong> <a href="tel:+380501234567" className="text-neon-cyan hover:text-neon-purple">+38 (050) 123-45-67</a>
              </p>
            </div>
          </section>

          <section className="border-t border-dark-border pt-6">
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
              <p className="text-yellow-400 font-semibold mb-2">
                ⚠️ {isUk ? 'ВАЖЛИВО' : 'ВАЖНО'}
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isUk 
                  ? 'Для отримання повної інформації про умови купівлі-продажу, повернення товарів, відповідальність та інші важливі положення, будь ласка, ознайомтеся з'
                  : 'Для получения полной информации об условиях купли-продажи, возврата товаров, ответственности и других важных положениях, пожалуйста, ознакомьтесь с'}{' '}
                <Link href={`/${locale}/oferta`} className="text-neon-cyan hover:text-neon-purple underline font-semibold">
                  {isUk ? 'Публічною офертою' : 'Публичной офертой'}
                </Link>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
