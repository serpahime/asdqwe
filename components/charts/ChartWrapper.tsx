'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

interface ChartWrapperProps {
  children: ReactNode;
  height: string;
}

export default function ChartWrapper({ children, height }: ChartWrapperProps) {
  const [mounted, setMounted] = useState(false);
  
  // Всегда вызываем useInView (правила хуков)
  // Используем результат только после монтирования
  const { ref, inView } = useInView({ 
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px', // Загружать заранее (за 50px до появления)
  });
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // На сервере всегда показываем placeholder (для SSR)
  // С ssr: false это не должно быть нужно, но для безопасности оставляем
  if (typeof window === 'undefined') {
    return (
      <div className={`w-full ${height} bg-dark-border/20 rounded-lg animate-pulse`} />
    );
  }

  // До монтирования показываем placeholder (одинаковый рендеринг)
  // Это гарантирует, что сервер и клиент рендерят одно и то же
  if (!mounted) {
    return (
      <div 
        className={`w-full ${height} bg-dark-border/20 rounded-lg animate-pulse`}
        suppressHydrationWarning
      />
    );
  }

  // После монтирования используем inView для lazy-load
  // Если еще не в viewport, показываем placeholder с ref для отслеживания
  if (!inView) {
    return (
      <div 
        ref={ref} 
        className={`w-full ${height} bg-dark-border/20 rounded-lg animate-pulse`}
        suppressHydrationWarning
      />
    );
  }

  // Когда в viewport, рендерим график
  return (
    <div ref={ref} suppressHydrationWarning>
      {children}
    </div>
  );
}
