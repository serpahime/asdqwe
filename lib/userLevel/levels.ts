// Система уровней пользователя

export type UserLevel = 'silver' | 'gold' | 'platinum';

export interface LevelInfo {
  id: UserLevel;
  name: {
    uk: string;
    ru: string;
  };
  icon: string;
  color: string;
  gradient: string;
  requirements: {
    ordersCount?: number;
    totalSpent?: number;
    referralsCount?: number;
    totalPoints?: number; // Комбинированные баллы
  };
  benefits: {
    uk: string[];
    ru: string[];
  };
}

export const USER_LEVELS: Record<UserLevel, LevelInfo> = {
  silver: {
    id: 'silver',
    name: {
      uk: 'Срібло',
      ru: 'Серебро',
    },
    icon: '🥈',
    color: 'text-gray-400',
    gradient: 'from-gray-400 to-gray-600',
    requirements: {
      totalPoints: 0, // Стартовый уровень
    },
    benefits: {
      uk: [
        'Стандартна програма бонусів',
        'Швидка доставка',
      ],
      ru: [
        'Стандартная программа бонусов',
        'Быстрая доставка',
      ],
    },
  },
  gold: {
    id: 'gold',
    name: {
      uk: 'Золото',
      ru: 'Золото',
    },
    icon: '🥇',
    color: 'text-yellow-400',
    gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
    requirements: {
      totalPoints: 100, // Комбинированные баллы
    },
    benefits: {
      uk: [
        'Бонус +3% до накопичення',
        'Пріоритетна підтримка',
        'Спеціальні пропозиції',
      ],
      ru: [
        'Бонус +3% к накоплению',
        'Приоритетная поддержка',
        'Специальные предложения',
      ],
    },
  },
  platinum: {
    id: 'platinum',
    name: {
      uk: 'Платина',
      ru: 'Платина',
    },
    icon: '💎',
    color: 'text-cyan-300',
    gradient: 'from-cyan-300 via-blue-400 to-purple-500',
    requirements: {
      totalPoints: 500, // Комбинированные баллы
    },
    benefits: {
      uk: [
        'Бонус +5% до накопичення',
        'Пріоритетна підтримка',
        'Ексклюзивні пропозиції',
        'Ранній доступ до новинок',
      ],
      ru: [
        'Бонус +5% к накоплению',
        'Приоритетная поддержка',
        'Эксклюзивные предложения',
        'Ранний доступ к новинкам',
      ],
    },
  },
};

// Вычислить баллы пользователя
export interface UserPoints {
  ordersPoints: number; // 10 баллов за каждый заказ
  spendingPoints: number; // 1 балл за каждые 10 грн потрачено
  referralsPoints: number; // 20 баллов за каждого реферала
  totalPoints: number;
}

export function calculateUserPoints(
  ordersCount: number,
  totalSpent: number,
  referralsCount: number
): UserPoints {
  const ordersPoints = ordersCount * 10;
  const spendingPoints = Math.floor(totalSpent / 10);
  const referralsPoints = referralsCount * 20;
  const totalPoints = ordersPoints + spendingPoints + referralsPoints;

  return {
    ordersPoints,
    spendingPoints,
    referralsPoints,
    totalPoints,
  };
}

// Определить уровень пользователя по баллам
export function getUserLevel(totalPoints: number): UserLevel {
  if (totalPoints >= USER_LEVELS.platinum.requirements.totalPoints!) {
    return 'platinum';
  } else if (totalPoints >= USER_LEVELS.gold.requirements.totalPoints!) {
    return 'gold';
  }
  return 'silver';
}

// Получить информацию об уровне
export function getLevelInfo(level: UserLevel): LevelInfo {
  return USER_LEVELS[level];
}

// Получить прогресс до следующего уровня
export function getLevelProgress(
  currentPoints: number,
  currentLevel: UserLevel
): {
  current: number;
  next: number;
  percentage: number;
  nextLevel: UserLevel | null;
} {
  const levels: UserLevel[] = ['silver', 'gold', 'platinum'];
  const currentIndex = levels.indexOf(currentLevel);
  
  if (currentIndex === levels.length - 1) {
    // Уже максимальный уровень
    return {
      current: currentPoints,
      next: currentPoints,
      percentage: 100,
      nextLevel: null,
    };
  }

  const nextLevel = levels[currentIndex + 1];
  const nextLevelInfo = USER_LEVELS[nextLevel];
  const nextLevelPoints = nextLevelInfo.requirements.totalPoints || 0;
  
  const currentLevelInfo = USER_LEVELS[currentLevel];
  const currentLevelPoints = currentLevelInfo.requirements.totalPoints || 0;
  
  const progress = currentPoints - currentLevelPoints;
  const needed = nextLevelPoints - currentLevelPoints;
  const percentage = Math.min(100, Math.round((progress / needed) * 100));

  return {
    current: currentPoints,
    next: nextLevelPoints,
    percentage,
    nextLevel,
  };
}
