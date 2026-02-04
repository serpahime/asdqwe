import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-6xl font-display font-bold mb-4">
            <span className="gradient-text">404</span>
          </h1>
          <h2 className="text-3xl font-semibold mb-4">Страница не найдена</h2>
          <p className="text-gray-400 mb-8">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
          <Link href="/" className="btn-primary inline-flex items-center space-x-2">
            <Home size={20} />
            <span>Вернуться на главную</span>
          </Link>
        </div>
      </div>
    </div>
  );
}





