'use client';

import AgeGate from '@/components/AgeGate';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ⚡ ПРОИЗВОДИТЕЛЬНОСТЬ: Импортируем компоненты напрямую
// Они не загружаются для админки, т.к. ShopLayout используется только внутри ShopProviders,
// который проверяет pathname и возвращает пустой children для админки
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AgeGate />
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
