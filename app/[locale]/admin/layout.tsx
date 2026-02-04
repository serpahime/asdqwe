'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  LogOut,
  Menu,
  X,
  Settings,
  Gift
} from 'lucide-react';
import { isAuthenticated, logout, getCurrentUser } from '@/lib/admin/auth';
import { useLocale } from '@/hooks/useLocale';

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: { uk: 'Дашборд', ru: 'Дашборд' } },
  { href: '/admin/orders', icon: ShoppingBag, label: { uk: 'Замовлення', ru: 'Заказы' } },
  { href: '/admin/products', icon: Package, label: { uk: 'Товари', ru: 'Товары' } },
  { href: '/admin/customers', icon: Users, label: { uk: 'Клієнти', ru: 'Клиенты' } },
  { href: '/admin/analytics', icon: TrendingUp, label: { uk: 'Аналітика', ru: 'Аналитика' } },
  { href: '/admin/bonuses', icon: Gift, label: { uk: 'Бонуси', ru: 'Бонусы' } },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Проверяем, является ли текущая страница страницей входа
  const isLoginPage = pathname?.includes('/admin/login');

  useEffect(() => {
    // Не проверяем авторизацию на странице входа
    if (isLoginPage) {
      return;
    }
    
    if (!isAuthenticated()) {
      router.push(`/${locale}/admin/login`);
      return;
    }
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, [router, locale, isLoginPage]);

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/admin/login`);
  };

  // Если это страница входа, показываем только содержимое без layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Если не авторизован и не на странице входа, не показываем layout
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-dark-card border-r border-dark-border z-40 transform transition-transform duration-300 md:translate-x-0">
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-bold gradient-text">
              Admin Panel
            </h1>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="md:hidden text-gray-400 hover:text-neon-cyan"
            >
              <X size={24} />
            </button>
          </div>
          {user && (
            <p className="text-sm text-gray-400 mt-2">{user.name}</p>
          )}
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === `/${locale}${item.href}`;
            return (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                    : 'text-gray-300 hover:bg-dark-border hover:text-neon-cyan'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label[locale]}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">{locale === 'uk' ? 'Вихід' : 'Выход'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-dark-bg/80 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-dark-card border-b border-dark-border">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-400 hover:text-neon-cyan"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-4 ml-auto">
              <div className="text-sm text-gray-400">
                {user?.email}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

