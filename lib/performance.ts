/**
 * Утиліти для відстеження продуктивності
 */

import { logger } from './logger';

export class PerformanceTracker {
  private static marks: Map<string, number> = new Map();

  /**
   * Почати відстеження продуктивності
   */
  static start(name: string): string {
    const markId = logger.startPerformanceMark(name);
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.marks.set(markId, startTime);
    return markId;
  }

  /**
   * Завершити відстеження продуктивності
   */
  static end(markId: string, category: 'performance' | 'api' | 'ui' | 'system' = 'performance', message?: string): number {
    const startTime = this.marks.get(markId);
    if (startTime !== undefined) {
      const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const duration = Math.round(endTime - startTime);
      this.marks.delete(markId);
      logger.endPerformanceMark(markId, category, message);
      return duration;
    }
    return 0;
  }

  /**
   * Відстеження виконання функції
   */
  static async track<T>(
    name: string,
    fn: () => Promise<T> | T,
    category: 'performance' | 'api' | 'ui' | 'system' = 'performance'
  ): Promise<T> {
    const markId = this.start(name);
    try {
      const result = await fn();
      this.end(markId, category, `${name} completed`);
      return result;
    } catch (error) {
      this.end(markId, category, `${name} failed`);
      logger.error(category, `${name} failed`, error as Error);
      throw error;
    }
  }
}

/**
 * Декоратор для автоматичного відстеження продуктивності функцій
 */
export function trackPerformance(name: string, category: 'performance' | 'api' | 'ui' | 'system' = 'performance') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return PerformanceTracker.track(
        `${target.constructor.name}.${propertyKey}`,
        () => originalMethod.apply(this, args),
        category
      );
    };

    return descriptor;
  };
}
