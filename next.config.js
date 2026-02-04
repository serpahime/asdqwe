/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Оптимізація зображень
  images: {
    // Використовуємо тільки локальні зображення з public/
    formats: ['image/avif', 'image/webp'], // Підтримка сучасних форматів
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Кешування зображень
    unoptimized: false, // Дозволяємо оптимізацію, але для локальних файлів використовуємо unoptimized prop
  },
  
  // Компресія
  compress: true,
  
  // Оптимізація продуктивності
  poweredByHeader: false, // Прибрати X-Powered-By заголовок для безпеки
  
  // Оптимізація импортов пакетов
  experimental: {
    optimizeCss: false, // Отключены из-за отсутствия critters
    optimizePackageImports: ['lucide-react', 'date-fns', 'recharts'], // Оптимізация импортов
  },
  
  // Домен проекту
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Domain',
            value: 'juicelub.store',
          },
          // Безпека та продуктивність
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Кешування статичних ресурсів
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Оптимізація збірки
  swcMinify: true,
  
  // Обработка ошибок при pre-rendering динамических страниц
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
  
  // Disable static generation for pages that need client-side providers
  staticPageGenerationTimeout: 120,
};

module.exports = withBundleAnalyzer(nextConfig);





