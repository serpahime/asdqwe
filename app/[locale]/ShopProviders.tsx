'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { CartProvider } from '@/contexts/CartContext';
import ShopLayout from './ShopLayout';

// ⚡ ПРОИЗВОДИТЕЛЬНОСТЬ: Динамически загружаем Toast только для магазина
// Для админки эти компоненты НЕ загружаются вообще
const ToastProvider = dynamic(() => import('@/components/Toast'), {
  ssr: false,
  loading: () => null,
});

export default function ShopProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.includes('/admin');

  // Для админки не загружаем провайдеры магазина
  if (isAdminPage) {
    return <>{children}</>;
  }

  // Для магазина загружаем все провайдеры
  return (
    <CartProvider>
      <ToastProvider />
      <ShopLayout>
        {children}
      </ShopLayout>
    </CartProvider>
  );
}
