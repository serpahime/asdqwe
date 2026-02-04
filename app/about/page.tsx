import { Award, Target, Heart, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'О бренде JuiceLab - Премиальные жидкости для вейпинга',
  description: 'Узнайте больше о бренде JuiceLab и нашей миссии создавать лучшие жидкости для вейпинга.',
};

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 text-center">
          О <span className="gradient-text">бренде</span>
        </h1>

        <div className="prose prose-invert max-w-none mb-12">
          <p className="text-xl text-gray-300 mb-6 text-center">
            JuiceLab — это премиальный бренд жидкостей для вейпинга, 
            созданный для тех, кто ценит качество, вкус и стиль.
          </p>
        </div>

        {/* Mission */}
        <div className="card mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="text-dark-bg" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Наша миссия</h2>
              <p className="text-gray-300 leading-relaxed">
                Мы стремимся создавать жидкости для вейпинга высочайшего качества, которые раскрывают 
                полный потенциал вкуса и аромата. Каждый продукт проходит строгий контроль качества, 
                чтобы гарантировать безопасность и превосходный вкус.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-dark-bg" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Качество</h3>
            <p className="text-gray-400 text-sm">
              Мы используем только проверенные и сертифицированные ингредиенты от ведущих производителей.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-dark-bg" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Забота</h3>
            <p className="text-gray-400 text-sm">
              Безопасность наших клиентов — наш приоритет. Все продукты проходят тщательное тестирование.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-neon-pink to-neon-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-dark-bg" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Клиенты</h3>
            <p className="text-gray-400 text-sm">
              Мы ценим каждого клиента и постоянно работаем над улучшением нашего сервиса.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-dark-bg" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Инновации</h3>
            <p className="text-gray-400 text-sm">
              Мы следим за трендами и постоянно расширяем ассортимент новыми вкусами.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Наша история</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              JuiceLab был основан в 2020 году группой энтузиастов, которые устали от 
              низкокачественных жидкостей для вейпинга на рынке. Мы решили создать продукт, который 
              объединяет в себе насыщенный вкус, безопасность и доступность.
            </p>
            <p>
              За годы работы мы завоевали доверие тысяч клиентов по всей стране. Наша команда 
              постоянно работает над улучшением формул, расширением ассортимента и повышением 
              качества обслуживания.
            </p>
            <p>
              Сегодня JuiceLab — это не просто бренд жидкостей для вейпинга, это сообщество людей, 
              которые ценят качество и наслаждаются каждым моментом.
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="card bg-red-500/10 border-red-500/50 mt-8">
          <p className="text-red-400 font-semibold mb-2">⚠️ Важно</p>
          <p className="text-gray-300 text-sm">
            Все наши продукты предназначены только для лиц старше 18 лет. 
            Мы не пропагандируем курение и напоминаем, что курение вредит вашему здоровью.
          </p>
        </div>
      </div>
    </div>
  );
}


