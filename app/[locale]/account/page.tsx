'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Gift, 
  Copy, 
  Check, 
  LogOut, 
  ShoppingBag,
  TrendingUp,
  Users,
  User as UserIcon,
  Edit,
  Save,
  X,
  Trophy,
  Award
} from 'lucide-react';
import { getCurrentUser, logout } from '@/lib/referral/auth';
import { isAuthenticated } from '@/lib/referral/auth-client';
import { getUserReferrals, getUserBonusHistory, updateUser, type User } from '@/lib/referral/users';

// Тип для операцій з бонусами
interface BonusOperation {
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  reason: string;
  date: string;
}
import { getReferralLink } from '@/lib/referral/bonus';
import { useLocale } from '@/hooks/useTranslations';
import { toastManager } from '@/components/Toast';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/dateLocale';
import { getUserAchievements, getAchievementProgress } from '@/lib/achievements/userAchievements';
import { getAllAchievements, getAchievementById, type Achievement } from '@/lib/achievements/achievements';
import { getUserLevelData } from '@/lib/userLevel/userLevel';

export default function AccountPage() {
  const router = useRouter();
  const locale = useLocale();
  const [user, setUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<User[]>([]);
  const [bonusHistory, setBonusHistory] = useState<BonusOperation[]>([]);
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
  });
  const [userAchievements, setUserAchievements] = useState<{ achievement: Achievement; unlocked: boolean; progress: { current: number; target: number; percentage: number } }[]>([]);
  const [userLevelData, setUserLevelData] = useState<ReturnType<typeof getUserLevelData> | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`/${locale}/login`);
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push(`/${locale}/login`);
      return;
    }

    setUser(currentUser);
    setReferrals(getUserReferrals(currentUser.id));
    setBonusHistory(getUserBonusHistory(currentUser.id));
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    setReferralLink(getReferralLink(currentUser.id, baseUrl));
    setProfileData({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone || '',
      city: currentUser.city || '',
      address: currentUser.address || '',
    });

    // Загружаем достижения
    const unlockedAchievements = getUserAchievements(currentUser.id);
    const allAchievements = getAllAchievements();
    const achievementsData = allAchievements.map(achievement => {
      const unlocked = unlockedAchievements.some(ua => ua.achievementId === achievement.id);
      const progress = getAchievementProgress(currentUser.id, achievement.id);
      return { achievement, unlocked, progress };
    });
    setUserAchievements(achievementsData);

    // Загружаем данные об уровне
    const levelData = getUserLevelData(currentUser.id);
    setUserLevelData(levelData);
  }, [router, locale]);

  const handleSaveProfile = () => {
    if (!user) return;

    // Валидация
    if (!profileData.name.trim()) {
      toastManager.error(
        locale === 'uk' ? 'Введіть ім\'я' : 'Введите имя'
      );
      return;
    }

    if (!profileData.email.trim() || !profileData.email.includes('@')) {
      toastManager.error(
        locale === 'uk' ? 'Введіть коректний email' : 'Введите корректный email'
      );
      return;
    }

    // Обновляем пользователя
    const updated = updateUser(user.id, {
      name: profileData.name.trim(),
      email: profileData.email.trim().toLowerCase(),
      phone: profileData.phone.trim() || undefined,
      city: profileData.city.trim() || undefined,
      address: profileData.address.trim() || undefined,
    });

    if (updated) {
      // Обновляем локальное состояние
      const updatedUser = getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
        setProfileData({
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone || '',
          city: updatedUser.city || '',
          address: updatedUser.address || '',
        });
      }
      setIsEditingProfile(false);
      toastManager.success(
        locale === 'uk' ? 'Профіль оновлено' : 'Профиль обновлён'
      );
    } else {
      toastManager.error(
        locale === 'uk' ? 'Помилка оновлення профілю' : 'Ошибка обновления профиля'
      );
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toastManager.success(
        locale === 'uk' ? 'Посилання скопійовано!' : 'Ссылка скопирована!'
      );
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback для старих браузерів
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        toastManager.success(
          locale === 'uk' ? 'Посилання скопійовано!' : 'Ссылка скопирована!'
        );
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toastManager.error(
          locale === 'uk' ? 'Помилка копіювання' : 'Ошибка копирования'
        );
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const handleLogout = () => {
    logout();
    toastManager.success(
      locale === 'uk' ? 'Ви вийшли з акаунту' : 'Вы вышли из аккаунта'
    );
    router.push(`/${locale}`);
  };

  if (!user) {
    return (
      <div className="section-padding">
        <div className="container-custom">
          <div className="text-center text-gray-400">
            {locale === 'uk' ? 'Завантаження...' : 'Загрузка...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-custom max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-display font-bold">
            <span className="gradient-text">
              {locale === 'uk' ? 'Особистий кабінет' : 'Личный кабинет'}
            </span>
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
            aria-label={locale === 'uk' ? 'Вихід з акаунту' : 'Выход из аккаунта'}
          >
            <LogOut size={20} />
            <span>{locale === 'uk' ? 'Вихід' : 'Выход'}</span>
          </button>
        </div>

        {/* Профиль пользователя */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold flex items-center space-x-2">
              <UserIcon className="text-neon-cyan" size={28} />
              <span>{locale === 'uk' ? 'Профіль' : 'Профиль'}</span>
            </h2>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center space-x-2 text-gray-400 hover:text-neon-cyan transition-colors"
                aria-label={locale === 'uk' ? 'Редагувати профіль' : 'Редактировать профиль'}
              >
                <Edit size={20} />
                <span>{locale === 'uk' ? 'Редагувати' : 'Редактировать'}</span>
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'uk' ? 'ПІБ' : 'ФИО'} *
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                  placeholder={locale === 'uk' ? 'Ваше повне ім\'я' : 'Ваше полное имя'}
                  aria-label={locale === 'uk' ? 'ПІБ' : 'ФИО'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                  placeholder="example@email.com"
                  aria-label="Email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'uk' ? 'Телефон' : 'Телефон'}
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                  placeholder="+38 (050) 123-45-67"
                  aria-label={locale === 'uk' ? 'Телефон' : 'Телефон'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'uk' ? 'Місто' : 'Город'}
                </label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                  placeholder={locale === 'uk' ? 'Наприклад: Київ' : 'Например: Киев'}
                  aria-label={locale === 'uk' ? 'Місто' : 'Город'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'uk' ? 'Адреса' : 'Адрес'}
                </label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-neon-cyan"
                  placeholder={locale === 'uk' ? 'Вулиця, будинок, квартира' : 'Улица, дом, квартира'}
                  aria-label={locale === 'uk' ? 'Адреса' : 'Адрес'}
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSaveProfile}
                  className="btn-primary flex items-center space-x-2"
                  aria-label={locale === 'uk' ? 'Зберегти зміни профілю' : 'Сохранить изменения профиля'}
                >
                  <Save size={20} />
                  <span>{locale === 'uk' ? 'Зберегти' : 'Сохранить'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditingProfile(false);
                    setProfileData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      city: user?.city || '',
                      address: user?.address || '',
                    });
                  }}
                  className="btn-secondary flex items-center space-x-2"
                  aria-label={locale === 'uk' ? 'Скасувати редагування' : 'Отменить редактирование'}
                >
                  <X size={20} />
                  <span>{locale === 'uk' ? 'Скасувати' : 'Отменить'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-dark-border rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">
                  {locale === 'uk' ? 'ПІБ' : 'ФИО'}
                </p>
                <p className="text-gray-300 font-medium">{user.name}</p>
              </div>
              <div className="bg-dark-border rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-gray-300 font-medium">{user.email}</p>
              </div>
              {user.phone && (
                <div className="bg-dark-border rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">
                    {locale === 'uk' ? 'Телефон' : 'Телефон'}
                  </p>
                  <p className="text-gray-300 font-medium">{user.phone}</p>
                </div>
              )}
              {user.city && (
                <div className="bg-dark-border rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">
                    {locale === 'uk' ? 'Місто' : 'Город'}
                  </p>
                  <p className="text-gray-300 font-medium">{user.city}</p>
                </div>
              )}
              {user.address && (
                <div className="bg-dark-border rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">
                    {locale === 'uk' ? 'Адреса' : 'Адрес'}
                  </p>
                  <p className="text-gray-300 font-medium">{user.address}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Уровень пользователя */}
        {userLevelData && (
          <div className="card mb-6 bg-gradient-to-br from-dark-card via-dark-card to-dark-border border-2 border-opacity-50" style={{
            borderColor: userLevelData.level === 'platinum' ? 'rgba(147, 197, 253, 0.3)' : 
                         userLevelData.level === 'gold' ? 'rgba(250, 204, 21, 0.3)' : 
                         'rgba(156, 163, 175, 0.3)'
          }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-5xl">{userLevelData.levelInfo.icon}</div>
                <div>
                  <h2 className="text-2xl font-semibold mb-1" style={{
                    color: userLevelData.level === 'platinum' ? '#93c5fd' : 
                           userLevelData.level === 'gold' ? '#facc15' : 
                           '#9ca3af'
                  }}>
                    {locale === 'uk' ? userLevelData.levelInfo.name.uk : userLevelData.levelInfo.name.ru}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {locale === 'uk' ? 'Ваш рівень' : 'Ваш уровень'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold" style={{
                  color: userLevelData.level === 'platinum' ? '#93c5fd' : 
                         userLevelData.level === 'gold' ? '#facc15' : 
                         '#9ca3af'
                }}>
                  {userLevelData.points.totalPoints}
                </p>
                <p className="text-gray-400 text-xs">{locale === 'uk' ? 'балів' : 'баллов'}</p>
              </div>
            </div>

            {/* Прогресс до следующего уровня */}
            {userLevelData.progress.nextLevel && (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>
                    {locale === 'uk' ? 'До наступного рівня:' : 'До следующего уровня:'}{' '}
                    <span className="font-semibold text-white">
                      {userLevelData.progress.nextLevel === 'gold' ? (locale === 'uk' ? 'Золото' : 'Золото') : 
                       userLevelData.progress.nextLevel === 'platinum' ? (locale === 'uk' ? 'Платина' : 'Платина') : ''}
                    </span>
                  </span>
                  <span>{userLevelData.progress.current} / {userLevelData.progress.next}</span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${userLevelData.progress.percentage}%`,
                      background: userLevelData.level === 'silver' 
                        ? 'linear-gradient(to right, #9ca3af, #6b7280)'
                        : userLevelData.level === 'gold'
                        ? 'linear-gradient(to right, #facc15, #eab308)'
                        : 'linear-gradient(to right, #93c5fd, #3b82f6)'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Преимущества уровня */}
            <div className="mb-4 pt-4 border-t border-dark-border">
              <p className="text-sm font-semibold mb-2 text-gray-300">
                {locale === 'uk' ? 'Переваги рівня:' : 'Преимущества уровня:'}
              </p>
              <ul className="space-y-1">
                {(locale === 'uk' ? userLevelData.levelInfo.benefits.uk : userLevelData.levelInfo.benefits.ru).map((benefit, index) => (
                  <li key={index} className="text-xs text-gray-400 flex items-center space-x-2">
                    <span className="text-neon-cyan">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Детализация баллов */}
            <div className="pt-4 border-t border-dark-border grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-400 mb-1">{locale === 'uk' ? 'Замовлення' : 'Заказы'}</p>
                <p className="text-sm font-semibold text-white">{userLevelData.points.ordersPoints}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">{locale === 'uk' ? 'Покупки' : 'Покупки'}</p>
                <p className="text-sm font-semibold text-white">{userLevelData.points.spendingPoints}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">{locale === 'uk' ? 'Реферали' : 'Рефералы'}</p>
                <p className="text-sm font-semibold text-white">{userLevelData.points.referralsPoints}</p>
              </div>
            </div>
          </div>
        )}

        {/* Бонусный баланс */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2 flex items-center space-x-2">
                <Gift className="text-neon-cyan" size={28} />
                <span>{locale === 'uk' ? 'Бонусний баланс' : 'Бонусный баланс'}</span>
              </h2>
              <p className="text-gray-400 text-sm">
                {locale === 'uk' 
                  ? 'Використовуйте бонуси при оформленні замовлення (до 10% від суми)'
                  : 'Используйте бонусы при оформлении заказа (до 10% от суммы)'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-neon-cyan">
                {user.bonusBalance} ₴
              </p>
            </div>
          </div>
        </div>

        {/* Достижения */}
        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
            <Trophy className="text-neon-purple" size={28} />
            <span>{locale === 'uk' ? 'Досягнення' : 'Достижения'}</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userAchievements.map(({ achievement, unlocked, progress }) => (
              <div
                key={achievement.id}
                className={`
                  relative p-4 rounded-lg border-2 transition-all
                  ${unlocked
                    ? 'bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border-neon-cyan/50 shadow-lg shadow-neon-cyan/20'
                    : 'bg-dark-border border-dark-border/50 opacity-60'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-4xl">{achievement.icon}</div>
                  {unlocked && (
                    <Award className="text-neon-cyan" size={20} />
                  )}
                </div>
                
                <h3 className={`font-semibold mb-1 ${unlocked ? 'text-white' : 'text-gray-400'}`}>
                  {locale === 'uk' ? achievement.name.uk : achievement.name.ru}
                </h3>
                
                <p className="text-sm text-gray-400 mb-3">
                  {locale === 'uk' ? achievement.description.uk : achievement.description.ru}
                </p>

                {!unlocked && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{progress.current}</span>
                      <span>{progress.target}</span>
                    </div>
                    <div className="w-full bg-dark-bg rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-neon-cyan to-neon-purple h-2 rounded-full transition-all"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {unlocked && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse" />
                  </div>
                )}

                <div className="mt-2">
                  <span className={`
                    text-xs px-2 py-1 rounded
                    ${achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                    ${achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' : ''}
                    ${achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' : ''}
                    ${achievement.rarity === 'common' ? 'bg-gray-500/20 text-gray-400' : ''}
                  `}>
                    {achievement.rarity === 'legendary' ? (locale === 'uk' ? 'Легендарне' : 'Легендарное') : ''}
                    {achievement.rarity === 'epic' ? (locale === 'uk' ? 'Епічне' : 'Эпическое') : ''}
                    {achievement.rarity === 'rare' ? (locale === 'uk' ? 'Рідкісне' : 'Редкое') : ''}
                    {achievement.rarity === 'common' ? (locale === 'uk' ? 'Звичайне' : 'Обычное') : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-dark-border">
            <p className="text-sm text-gray-400 text-center">
              {locale === 'uk' 
                ? `Розблоковано: ${userAchievements.filter(a => a.unlocked).length} / ${userAchievements.length}`
                : `Разблокировано: ${userAchievements.filter(a => a.unlocked).length} / ${userAchievements.length}`}
            </p>
          </div>
        </div>

        {/* Реферальная ссылка */}
        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
            <Users className="text-neon-purple" size={28} />
            <span>{locale === 'uk' ? 'Реферальна програма' : 'Реферальная программа'}</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                {locale === 'uk' ? 'Ваша реферальна посилання' : 'Ваша реферальная ссылка'}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-dark-border border border-dark-border rounded-lg px-4 py-3 text-gray-300"
                  aria-label={locale === 'uk' ? 'Реферальна посилання' : 'Реферальная ссылка'}
                />
                <button
                  onClick={handleCopyLink}
                  className="btn-secondary flex items-center space-x-2 px-4 py-3"
                  aria-label={locale === 'uk' ? 'Копіювати реферальну посилання' : 'Копировать реферальную ссылку'}
                >
                  {copied ? (
                    <>
                      <Check size={20} />
                      <span>{locale === 'uk' ? 'Скопійовано' : 'Скопировано'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      <span>{locale === 'uk' ? 'Копіювати' : 'Копировать'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-border rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">
                  {locale === 'uk' ? 'Запрошено друзів' : 'Приглашено друзей'}
                </p>
                <p className="text-2xl font-bold text-neon-purple">
                  {referrals.length}
                </p>
              </div>
              <div className="bg-dark-border rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">
                  {locale === 'uk' ? 'Ваш реферальний код' : 'Ваш реферальный код'}
                </p>
                <p className="text-2xl font-bold text-neon-purple font-mono">
                  {user.referralCode}
                </p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
              <p className="text-blue-400 text-sm">
                <strong>{locale === 'uk' ? 'Як це працює:' : 'Как это работает:'}</strong>
              </p>
              <ul className="text-gray-300 text-sm mt-2 space-y-1 list-disc list-inside">
                <li>
                  {locale === 'uk' 
                    ? 'Поділіться посиланням з друзями'
                    : 'Поделитесь ссылкой с друзьями'}
                </li>
                <li>
                  {locale === 'uk' 
                    ? 'Коли друг зареєструється - ви отримаєте +10 грн бонусів'
                    : 'Когда друг зарегистрируется - вы получите +10 грн бонусов'}
                </li>
                <li>
                  {locale === 'uk' 
                    ? 'Коли друг зробить перший замовлення - ви отримаєте ще +10 грн'
                    : 'Когда друг сделает первый заказ - вы получите еще +10 грн'}
                </li>
                <li>
                  {locale === 'uk' 
                    ? 'Ваш друг також отримає +10 грн при реєстрації'
                    : 'Ваш друг также получит +10 грн при регистрации'}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* История бонусов */}
        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
            <TrendingUp className="text-neon-pink" size={28} />
            <span>{locale === 'uk' ? 'Історія бонусів' : 'История бонусов'}</span>
          </h2>

          {bonusHistory.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              {locale === 'uk' ? 'Історія порожня' : 'История пуста'}
            </p>
          ) : (
            <div className="space-y-3">
              {bonusHistory
                .sort((a, b) => {
                  const dateA = new Date(a.date).getTime();
                  const dateB = new Date(b.date).getTime();
                  return dateB - dateA;
                })
                .map((operation) => {
                  let formattedDate = '';
                  try {
                    const date = new Date(operation.date);
                    if (!isNaN(date.getTime())) {
                      formattedDate = formatDate(date, 'dd.MM.yyyy HH:mm', locale);
                    } else {
                      formattedDate = operation.date;
                    }
                  } catch {
                    formattedDate = operation.date;
                  }
                  
                  return (
                    <div
                      key={`${operation.userId}-${operation.date}-${operation.amount}-${operation.type}`}
                      className="bg-dark-border rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-gray-300 font-medium">{operation.reason}</p>
                        <p className="text-gray-500 text-sm">{formattedDate}</p>
                      </div>
                      <div
                        className={`text-lg font-bold ${
                          operation.type === 'credit'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {operation.type === 'credit' ? '+' : '-'}
                        {operation.amount} ₴
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Быстрые действия */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">
            {locale === 'uk' ? 'Швидкі дії' : 'Быстрые действия'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href={`/${locale}/catalog`}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <ShoppingBag size={20} />
              <span>{locale === 'uk' ? 'Перейти до каталогу' : 'Перейти в каталог'}</span>
            </Link>
            <Link
              href={`/${locale}/cart`}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <ShoppingBag size={20} />
              <span>{locale === 'uk' ? 'Кошик' : 'Корзина'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

