/**
 * Покращена система логування для JuiceLab
 * Логування помилок, подій, продуктивності та важливої інформації
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 
  | 'auth' 
  | 'cart' 
  | 'order' 
  | 'payment' 
  | 'product' 
  | 'api' 
  | 'ui' 
  | 'system'
  | 'security'
  | 'performance'
  | 'middleware'
  | 'navigation'
  | 'nova-poshta';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  error?: Error;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  ipAddress?: string;
  duration?: number; // для performance логів
  memory?: {
    used: number;
    total: number;
  };
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Максимум логів в пам'яті
  private performanceMarks: Map<string, number> = new Map();
  private requestCounter = 0;

  private formatTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }

  private formatTimestampReadable(): string {
    const now = new Date();
    return now.toLocaleString('uk-UA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server';
    
    let sessionId = sessionStorage.getItem('juicelab_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      sessionStorage.setItem('juicelab_session_id', sessionId);
    }
    return sessionId;
  }

  private getUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    
    try {
      // Отримуємо userId з сесії авторизації
      const authStr = localStorage.getItem('juicelab_user_auth');
      if (authStr) {
        const auth = JSON.parse(authStr);
        return auth.userId || auth.email || undefined;
      }
    } catch (e) {
      // Ignore
    }
    return undefined;
  }

  private createLogEntry(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: any,
    error?: Error,
    additionalInfo?: Partial<LogEntry>
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      category,
      message,
      data,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      } as any : undefined,
      ...additionalInfo,
    };

    if (typeof window !== 'undefined') {
      entry.sessionId = this.getSessionId();
      entry.userId = this.getUserId();
      entry.url = window.location.href;
      entry.userAgent = navigator.userAgent;
      
      // Додаємо інформацію про пам'ять (якщо доступна)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        entry.memory = {
          used: Math.round(memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        };
      }
    }

    return entry;
  }

  private addLog(entry: LogEntry) {
    // Додаємо лог в масив (обмежуємо розмір)
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Логування в консоль для розробки
    if (this.isDevelopment) {
      const style = this.getConsoleStyle(entry.level);
      const readableTime = this.formatTimestampReadable();
      const prefix = `%c[${readableTime}] [${entry.level.toUpperCase()}] [${entry.category}]`;
      
      const logParts: any[] = [prefix, style, entry.message];
      
      if (entry.duration !== undefined) {
        logParts.push(`⏱️ ${entry.duration}ms`);
      }
      
      if (entry.memory) {
        logParts.push(`💾 ${entry.memory.used}MB / ${entry.memory.total}MB`);
      }
      
      if (entry.data) {
        logParts.push('📦', entry.data);
      }
      
      if (entry.error) {
        logParts.push('❌', entry.error);
      }
      
      if (entry.requestId) {
        logParts.push(`🔗 Request ID: ${entry.requestId}`);
      }
      
      console.log(...logParts);
    }

    // В продакшні відправляємо на сервер (помилки та важливі події)
    if (this.isProduction) {
      if (entry.level === 'error' || entry.level === 'warn' || entry.category === 'security') {
        this.sendToServer(entry);
      }
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      debug: 'color: #888; font-weight: normal;',
      info: 'color: #2196F3; font-weight: normal;',
      warn: 'color: #FF9800; font-weight: bold;',
      error: 'color: #F44336; font-weight: bold; background: #ffebee;',
    };
    return styles[level] || '';
  }

  private async sendToServer(entry: LogEntry) {
    // В реальному додатку тут буде відправка на сервер
    // Наприклад, через API endpoint або сервіс логування (Sentry, LogRocket, etc.)
    try {
      // Приклад інтеграції з API
      if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.sendBeacon) {
        // Використовуємо sendBeacon для надійності (працює навіть при закритті сторінки)
        try {
          const blob = new Blob([JSON.stringify(entry)], { type: 'application/json' });
          navigator.sendBeacon('/api/logs', blob);
        } catch (beaconError) {
          // Fallback до fetch якщо sendBeacon не підтримується
          if (this.isDevelopment) {
            fetch('/api/logs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(entry),
              keepalive: true,
            }).catch(() => {
              // Ignore fetch errors in production
            });
          }
        }
      } else {
        // Server-side логування (можна інтегрувати з Winston, Pino, etc.)
        if (this.isDevelopment) {
          console.error('[SERVER LOG]', entry);
        }
      }
    } catch (e) {
      // Не логуємо помилки логування, щоб уникнути циклів
      if (this.isDevelopment) {
        console.error('Failed to send log to server:', e);
      }
    }
  }

  // Публічні методи логування
  debug(category: LogCategory, message: string, data?: any) {
    if (this.isDevelopment) {
      this.addLog(this.createLogEntry('debug', category, message, data));
    }
  }

  info(category: LogCategory, message: string, data?: any) {
    this.addLog(this.createLogEntry('info', category, message, data));
  }

  warn(category: LogCategory, message: string, data?: any, error?: Error) {
    this.addLog(this.createLogEntry('warn', category, message, data, error));
  }

  error(category: LogCategory, message: string, error?: Error, data?: any) {
    this.addLog(this.createLogEntry('error', category, message, data, error));
  }

  // Performance логування
  startPerformanceMark(name: string): string {
    const markId = `${name}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.performanceMarks.set(markId, startTime);
    return markId;
  }

  endPerformanceMark(markId: string, category: LogCategory = 'performance', message?: string) {
    const startTime = this.performanceMarks.get(markId);
    if (startTime !== undefined) {
      const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const duration = Math.round(endTime - startTime);
      this.performanceMarks.delete(markId);
      
      const logMessage = message || `Performance: ${markId.split('_')[0]}`;
      this.addLog(this.createLogEntry(
        duration > 1000 ? 'warn' : 'info',
        category,
        logMessage,
        { markId, duration },
        undefined,
        { duration }
      ));
      
      return duration;
    }
    return 0;
  }

  // Логування навігації
  logNavigation(from: string, to: string, duration?: number) {
    this.info('navigation', `Navigation: ${from} → ${to}`, {
      from,
      to,
      duration,
    });
  }

  // Логування middleware
  logMiddleware(action: string, data?: any, ipAddress?: string) {
    const requestId = `req_${++this.requestCounter}_${Date.now()}`;
    this.addLog(this.createLogEntry(
      'info',
      'middleware',
      `Middleware: ${action}`,
      { ...data, requestId, ipAddress },
      undefined,
      { requestId, ipAddress }
    ));
  }

  // Спеціалізовані методи
  logAuth(action: string, data?: any) {
    this.info('auth', `Auth action: ${action}`, data);
  }

  logCart(action: string, data?: any) {
    this.info('cart', `Cart action: ${action}`, data);
  }

  logOrder(action: string, orderData?: any) {
    this.info('order', `Order action: ${action}`, orderData);
  }

  logPayment(action: string, paymentData?: any) {
    if (action.includes('error') || action.includes('fail')) {
      this.error('payment', `Payment ${action}`, undefined, paymentData);
    } else {
      this.info('payment', `Payment ${action}`, paymentData);
    }
  }

  logProduct(action: string, productData?: any) {
    this.info('product', `Product action: ${action}`, productData);
  }

  logAPI(method: string, endpoint: string, status?: number, error?: Error, duration?: number, requestId?: string) {
    const message = `${method} ${endpoint}${status ? ` - ${status}` : ''}`;
    const logData: any = { method, endpoint, status, duration, requestId };
    
    if (error || (status && status >= 400)) {
      this.error('api', message, error, logData);
    } else if (status && status >= 300) {
      this.warn('api', message, logData);
    } else {
      this.info('api', message, logData);
    }
  }

  // Створення request ID для відстеження запитів
  createRequestId(): string {
    return `req_${++this.requestCounter}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  logSecurity(event: string, data?: any) {
    this.warn('security', `Security event: ${event}`, data);
  }

  logAgeVerification(action: 'confirmed' | 'declined', data: {
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    timestamp?: string;
    page?: string;
    userAgent?: string;
    locale?: string;
    referrer?: string;
  }) {
    const message = `Age verification ${action}: User ${data.userId || 'guest'} from IP ${data.ipAddress || 'unknown'} on page ${data.page || 'unknown'}`;
    this.info('security', message, {
      action,
      userId: data.userId || 'guest',
      sessionId: data.sessionId,
      ipAddress: data.ipAddress,
      timestamp: data.timestamp || new Date().toISOString(),
      page: data.page,
      userAgent: data.userAgent,
      locale: data.locale,
      referrer: data.referrer,
    });
  }

  // Отримання логів (для адмін-панелі)
  getLogs(level?: LogLevel, category?: LogCategory, limit: number = 100): LogEntry[] {
    let filtered = [...this.logs];

    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }

    if (category) {
      filtered = filtered.filter(log => log.category === category);
    }

    return filtered.slice(-limit);
  }

  // Очищення логів
  clearLogs() {
    this.logs = [];
  }

  // Експорт логів (для збереження/аналізу)
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Singleton instance
export const logger = new Logger();

// Глобальна обробка помилок
if (typeof window !== 'undefined') {
  // Unhandled errors
  window.addEventListener('error', (event) => {
    logger.error('system', 'Unhandled error', event.error, {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('system', 'Unhandled promise rejection', event.reason, {
      reason: event.reason,
    });
  });
}
