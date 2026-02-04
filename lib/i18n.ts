export type Locale = 'uk' | 'ru';

export const defaultLocale: Locale = 'uk';
export const locales: Locale[] = ['uk', 'ru'];

export const localeNames: Record<Locale, string> = {
  uk: 'Українська',
  ru: 'Русский',
};

// Типы для переводов
export interface Translations {
  // Header
  header: {
    home: string;
    catalog: string;
    about: string;
    contacts: string;
    cart: string;
  };
  
  // Footer
  footer: {
    about: string;
    navigation: string;
    information: string;
    contacts: string;
    rights: string;
    ageWarning: string;
  };
  
  // Common
  common: {
    addToCart: string;
    inCart: string;
    quantity: string;
    price: string;
    total: string;
    checkout: string;
    continueShopping: string;
    empty: string;
    notFound: string;
    backToHome: string;
    backToCatalog: string;
    loading: string;
  };
  
  // Product
  product: {
    new: string;
    hit: string;
    rating: string;
    reviews: string;
    category: string;
    strength: string;
    composition: string;
    instructions: string;
    related: string;
    warning: string;
    warningText: string;
  };
  
  // Cart
  cart: {
    title: string;
    empty: string;
    emptyText: string;
    items: string;
    sum: string;
    toPay: string;
    remove: string;
  };
  
  // Checkout
  checkout: {
    title: string;
    backToCart: string;
    customerInfo: string;
    name: string;
    email: string;
    phone: string;
    delivery: string;
    deliveryMethod: string;
    courier: string;
    post: string;
    pickup: string;
    city: string;
    address: string;
    payment: string;
    paymentMethod: string;
    card: string;
    cash: string;
    success: string;
    successText: string;
    agree: string;
  };
  
  // Catalog
  catalog: {
    title: string;
    subtitle: string;
    filters: string;
    resetFilters: string;
    taste: string;
    all: string;
    strength: string;
    special: string;
    newOnly: string;
    hitOnly: string;
    sort: string;
    sortDefault: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortRating: string;
    found: string;
    noResults: string;
  };
  
  // Home
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroButton: string;
    whyChoose: string;
    popular: string;
    viewAll: string;
    reviews: string;
    trust: string;
  };
}

// Переводы
export const translations: Record<Locale, Translations> = {
  uk: {
    header: {
      home: 'Головна',
      catalog: 'Каталог',
      about: 'Про бренд',
      contacts: 'Контакти',
      cart: 'Кошик',
    },
    footer: {
      about: 'Про нас',
      navigation: 'Навігація',
      information: 'Інформація',
      contacts: 'Контакти',
      rights: 'Всі права захищені.',
      ageWarning: 'Тільки для осіб старше 18 років. Вейпінг може шкодити здоров\'ю.',
    },
    common: {
      addToCart: 'Додати в кошик',
      inCart: 'В кошику',
      quantity: 'Кількість',
      price: 'Ціна',
      total: 'Всього',
      checkout: 'Оформити замовлення',
      continueShopping: 'Продовжити покупки',
      empty: 'Порожньо',
      notFound: 'Не знайдено',
      backToHome: 'Повернутися на головну',
      backToCatalog: 'Повернутися в каталог',
      loading: 'Завантаження...',
    },
    product: {
      new: 'НОВИНКА',
      hit: 'ХІТ',
      rating: 'Рейтинг',
      reviews: 'відгуків',
      category: 'Категорія',
      strength: 'Міцність',
      composition: 'Склад',
      instructions: 'Інструкція застосування',
      related: 'Схожі товари',
      warning: 'Важливо!',
      warningText: 'Даний продукт призначений тільки для осіб старше 18 років. Містить нікотин. Вейпінг може шкодити вашому здоров\'ю.',
    },
    cart: {
      title: 'Кошик',
      empty: 'Кошик порожній',
      emptyText: 'Додайте товари в кошик, щоб продовжити покупки',
      items: 'Товарів',
      sum: 'Сума',
      toPay: 'До оплати',
      remove: 'Видалити',
    },
    checkout: {
      title: 'Оформлення замовлення',
      backToCart: 'Повернутися в кошик',
      customerInfo: 'Контактні дані',
      name: 'Ім\'я',
      email: 'Email',
      phone: 'Телефон',
      delivery: 'Доставка',
      deliveryMethod: 'Спосіб доставки',
      courier: 'Кур\'єром',
      post: 'Новою поштою',
      pickup: 'Самовивіз',
      city: 'Місто',
      address: 'Адреса',
      payment: 'Оплата',
      paymentMethod: 'Спосіб оплати',
      card: 'Банківською карткою онлайн',
      cash: 'Готівкою при отриманні',
      success: 'Замовлення оформлено',
      successText: 'Дякуємо за ваше замовлення! Ми зв\'яжемося з вами найближчим часом для підтвердження.',
      agree: 'Натискаючи кнопку, ви погоджуєтесь з',
    },
    catalog: {
      title: 'Каталог товарів',
      subtitle: 'Виберіть свій ідеальний смак з нашої колекції преміальних рідин та аксесуарів',
      filters: 'Фільтри',
      resetFilters: 'Скинути фільтри',
      taste: 'Смак',
      all: 'Всі',
      strength: 'Міцність',
      special: 'Особливі',
      newOnly: 'Тільки новинки',
      hitOnly: 'Тільки хіти',
      sort: 'Сортування',
      sortDefault: 'За замовчуванням',
      sortPriceAsc: 'Ціна: за зростанням',
      sortPriceDesc: 'Ціна: за спаданням',
      sortRating: 'За рейтингом',
      found: 'Знайдено',
      noResults: 'Товари не знайдені',
    },
    home: {
      heroTitle: 'JuiceLab',
      heroSubtitle: 'Преміум рідини',
      heroButton: 'Перейти в каталог',
      whyChoose: 'Чому обирають',
      popular: 'Популярні смаки',
      viewAll: 'Дивитися всі',
      reviews: 'Відгуки клієнтів',
      trust: 'Довіра та якість',
    },
  },
  
  ru: {
    header: {
      home: 'Главная',
      catalog: 'Каталог',
      about: 'О бренде',
      contacts: 'Контакты',
      cart: 'Корзина',
    },
    footer: {
      about: 'О нас',
      navigation: 'Навигация',
      information: 'Информация',
      contacts: 'Контакты',
      rights: 'Все права защищены.',
      ageWarning: 'Только для лиц старше 18 лет. Вейпинг может вредить здоровью.',
    },
    common: {
      addToCart: 'Добавить в корзину',
      inCart: 'В корзине',
      quantity: 'Количество',
      price: 'Цена',
      total: 'Итого',
      checkout: 'Оформить заказ',
      continueShopping: 'Продолжить покупки',
      empty: 'Пусто',
      notFound: 'Не найдено',
      backToHome: 'Вернуться на главную',
      backToCatalog: 'Вернуться в каталог',
      loading: 'Загрузка...',
    },
    product: {
      new: 'НОВИНКА',
      hit: 'ХИТ',
      rating: 'Рейтинг',
      reviews: 'отзывов',
      category: 'Категория',
      strength: 'Крепость',
      composition: 'Состав',
      instructions: 'Инструкция применения',
      related: 'Похожие товары',
      warning: 'Важно!',
      warningText: 'Данный продукт предназначен только для лиц старше 18 лет. Содержит никотин. Вейпинг может вредить вашему здоровью.',
    },
    cart: {
      title: 'Корзина',
      empty: 'Корзина пуста',
      emptyText: 'Добавьте товары в корзину, чтобы продолжить покупки',
      items: 'Товаров',
      sum: 'Сумма',
      toPay: 'К оплате',
      remove: 'Удалить',
    },
    checkout: {
      title: 'Оформление заказа',
      backToCart: 'Вернуться в корзину',
      customerInfo: 'Контактные данные',
      name: 'Имя',
      email: 'Email',
      phone: 'Телефон',
      delivery: 'Доставка',
      deliveryMethod: 'Способ доставки',
      courier: 'Курьером',
      post: 'Новой почтой',
      pickup: 'Самовывоз',
      city: 'Город',
      address: 'Адрес',
      payment: 'Оплата',
      paymentMethod: 'Способ оплаты',
      card: 'Банковской картой онлайн',
      cash: 'Наличными при получении',
      success: 'Заказ оформлен',
      successText: 'Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения.',
      agree: 'Нажимая кнопку, вы соглашаетесь с',
    },
    catalog: {
      title: 'Каталог товаров',
      subtitle: 'Выберите свой идеальный вкус из нашей коллекции премиальных жидкостей и аксессуаров',
      filters: 'Фильтры',
      resetFilters: 'Сбросить фильтры',
      taste: 'Вкус',
      all: 'Все',
      strength: 'Крепость',
      special: 'Особые',
      newOnly: 'Только новинки',
      hitOnly: 'Только хиты',
      sort: 'Сортировка',
      sortDefault: 'По умолчанию',
      sortPriceAsc: 'Цена: по возрастанию',
      sortPriceDesc: 'Цена: по убыванию',
      sortRating: 'По рейтингу',
      found: 'Найдено',
      noResults: 'Товары не найдены',
    },
    home: {
      heroTitle: 'JuiceLab',
      heroSubtitle: 'Премиум жидкости',
      heroButton: 'Перейти в каталог',
      whyChoose: 'Почему выбирают',
      popular: 'Популярные вкусы',
      viewAll: 'Смотреть все',
      reviews: 'Отзывы клиентов',
      trust: 'Доверие и качество',
    },
  },
};


