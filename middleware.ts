import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/i18n';
import { logger } from './lib/logger';

export function middleware(request: NextRequest) {
  try {
    const startTime = Date.now();
    const pathname = request.nextUrl.pathname;
    const ipAddress = request.ip || 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      'unknown';
    const requestId = logger.createRequestId();
    
    // Пропускаем статические файлы и API routes
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.') ||
      pathname.startsWith('/favicon')
    ) {
      // Не логуємо статичні файли
      return NextResponse.next();
    }
    
    // Проверяем, есть ли уже локаль в пути
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // Если локаль уже есть, пропускаем
    if (pathnameHasLocale) {
      // Не логуємо звичайні запити з локалью
      const response = NextResponse.next();
      response.headers.set('X-Request-ID', requestId);
      return response;
    }

    // Определяем локаль из cookie или заголовков
    const locale = getLocale(request) || defaultLocale;
    // Не логуємо звичайні перенаправлення локалі

    // Перенаправляем на путь с локалью
    const newUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
    const response = NextResponse.redirect(newUrl);
    
    // Додаємо request ID в заголовки для відстеження
    response.headers.set('X-Request-ID', requestId);
    
    return response;
  } catch (error) {
    // Обробка помилок middleware
    logger.error('middleware', 'Middleware error', error as Error, {
      pathname: request.nextUrl.pathname,
    });
    // Повертаємо стандартну відповідь навіть при помилці
    return NextResponse.next();
  }
}

function getLocale(request: NextRequest): string | null {
  // Проверяем cookie
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // Проверяем Accept-Language заголовок
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase())
      .find((lang) => locales.includes(lang as any));
    
    if (preferredLocale) {
      return preferredLocale;
    }
  }

  return null;
}

export const config = {
  matcher: [
    // Исключаем статические файлы и API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

