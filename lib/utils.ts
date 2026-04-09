import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Locale = "en" | "ru" | "kk";

export type Product = {
  id: string;
  vendor_id: string;
  vendor_name?: string;
  name: string;
  category: string;
  description: string;
  original_price: number;
  discounted_price: number;
  quantity: number;
  expiry_time: string;
  image_url: string;
  location?: { lat: number; lng: number } | string | null;
  created_at: string;
  distance?: number;
};

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("ru-KZ")} ₸`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatExpiry(expiryTime: string): string {
  const now = new Date();
  const expiry = new Date(expiryTime);
  const diffMs = expiry.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffMs < 0) return "Expired";
  if (diffHours > 24) return `${Math.floor(diffHours / 24)}d left`;
  if (diffHours > 0) return `${diffHours}h ${diffMins}m left`;
  return `${diffMins}m left`;
}

export const translations = {
  en: {
    appName: "SANA",
    tagline: "Find fresh food. Reduce waste. Save money.",
    subtext: "Sana connects you with nearby vendors offering surplus meals at reduced prices — guided by AI.",
    getStarted: "Get Started",
    signIn: "Sign In",
    signOut: "Sign Out",
    aiPowered: "AI-Powered Search",
    nearbyDeals: "Nearby Deals",
    zeroWaste: "Zero Waste",
    sustainable: "Sustainable Consumption · Almaty",
    whoAreYou: "Who are you joining as?",
    chooseRole: "Choose your role. You can always contact us to switch.",
    iAmVendor: "I'm a Vendor",
    iAmCustomer: "I'm a Customer",
    vendorDesc: "Post surplus food, dishes, or groceries. Reduce waste and earn extra revenue.",
    customerDesc: "Find affordable, fresh food nearby. Let our AI guide you based on your budget and location.",
    postItem: "Post New Item",
    yourListings: "Your Active Listings",
    searchPlaceholder: "Search for food...",
    askSana: "Ask Sana",
    takeMeThere: "Take Me There",
    expiresIn: "Expires in",
    allCategories: "All",
    meals: "Meals",
    bakery: "Bakery",
    grocery: "Grocery",
    beverage: "Beverage",
    welcomeBack: "Welcome back",
    itemName: "Item Name",
    category: "Category",
    originalPrice: "Original Price (₸)",
    discountedPrice: "Discounted Price (₸)",
    quantity: "Quantity",
    expiryTime: "Expiry Time",
    description: "Description",
    uploadPhoto: "Upload Photo",
    submit: "Post Item",
    edit: "Edit",
    delete: "Delete",
    distance: "Distance",
    sanaAssistant: "Sana Assistant",
    typeMessage: "Type a message...",
    suggestion1: "What can I eat near me for under 2000₸?",
    suggestion2: "Show me today's bakery deals",
    suggestion3: "I need dinner ideas using surplus ingredients",
    noListings: "No active listings yet.",
    loading: "Loading...",
    openInMaps: "Open in Google Maps",
    vendorInfo: "Vendor Info",
  },
  ru: {
    appName: "SANA",
    tagline: "Свежая еда. Меньше отходов. Экономия.",
    subtext: "Sana соединяет вас с ближайшими продавцами, предлагающими излишки еды по сниженным ценам — с помощью ИИ.",
    getStarted: "Начать",
    signIn: "Войти",
    signOut: "Выйти",
    aiPowered: "ИИ-поиск",
    nearbyDeals: "Рядом с вами",
    zeroWaste: "Ноль отходов",
    sustainable: "Осознанное потребление · Алматы",
    whoAreYou: "Кем вы регистрируетесь?",
    chooseRole: "Выберите роль. Вы всегда можете связаться с нами для смены.",
    iAmVendor: "Я продавец",
    iAmCustomer: "Я покупатель",
    vendorDesc: "Размещайте излишки еды, блюд или продуктов. Сокращайте отходы и получайте доход.",
    customerDesc: "Найдите доступную свежую еду рядом. Пусть ИИ поможет вам с учётом бюджета и местоположения.",
    postItem: "Добавить товар",
    yourListings: "Ваши активные объявления",
    searchPlaceholder: "Поиск еды...",
    askSana: "Спросить Sana",
    takeMeThere: "Как добраться",
    expiresIn: "Истекает через",
    allCategories: "Все",
    meals: "Блюда",
    bakery: "Выпечка",
    grocery: "Продукты",
    beverage: "Напитки",
    welcomeBack: "Добро пожаловать",
    itemName: "Название",
    category: "Категория",
    originalPrice: "Обычная цена (₸)",
    discountedPrice: "Цена со скидкой (₸)",
    quantity: "Количество",
    expiryTime: "Срок годности",
    description: "Описание",
    uploadPhoto: "Загрузить фото",
    submit: "Опубликовать",
    edit: "Изменить",
    delete: "Удалить",
    distance: "Расстояние",
    sanaAssistant: "Ассистент Sana",
    typeMessage: "Напишите сообщение...",
    suggestion1: "Что можно поесть рядом до 2000₸?",
    suggestion2: "Покажи акции на выпечку сегодня",
    suggestion3: "Идеи для ужина из остатков продуктов",
    noListings: "Активных объявлений пока нет.",
    loading: "Загрузка...",
    openInMaps: "Открыть в Google Maps",
    vendorInfo: "Информация о продавце",
  },
  kk: {
    appName: "SANA",
    tagline: "Тươі тамақ. Қалдықсыз. Үнемді.",
    subtext: "Sana сізді жақын жердегі артық тамақты жеңілдікпен ұсынатын сатушылармен байланыстырады — ЖИ көмегімен.",
    getStarted: "Бастау",
    signIn: "Кіру",
    signOut: "Шығу",
    aiPowered: "ЖИ іздеу",
    nearbyDeals: "Жаныңыздағы ұсыныстар",
    zeroWaste: "Нөл қалдық",
    sustainable: "Саналы тұтыну · Алматы",
    whoAreYou: "Сіз кім ретінде тіркелесіз?",
    chooseRole: "Рөлді таңдаңыз. Өзгерту үшін бізге хабарласа аласыз.",
    iAmVendor: "Мен сатушымын",
    iAmCustomer: "Мен сатып алушымын",
    vendorDesc: "Артық тамақ, тағам немесе азық-түлікті жарияланыз. Қалдықты азайтып, қосымша табыс алыңыз.",
    customerDesc: "Жақын жердегі қолжетімді тазалама тамақты табыңыз. ЖИ сізге бюджет пен орынға қарай кеңес береді.",
    postItem: "Тауар қосу",
    yourListings: "Белсенді хабарландыруларыңыз",
    searchPlaceholder: "Тамақ іздеу...",
    askSana: "Санадан сұрау",
    takeMeThere: "Жол сілтеу",
    expiresIn: "Мерзімі аяқталады",
    allCategories: "Барлығы",
    meals: "Тағамдар",
    bakery: "Нан-тоқаш",
    grocery: "Азық-түлік",
    beverage: "Сусындар",
    welcomeBack: "Қош келдіңіз",
    itemName: "Атауы",
    category: "Санат",
    originalPrice: "Бастапқы баға (₸)",
    discountedPrice: "Жеңілдіктегі баға (₸)",
    quantity: "Саны",
    expiryTime: "Жарамдылық мерзімі",
    description: "Сипаттама",
    uploadPhoto: "Фото жүктеу",
    submit: "Жариялау",
    edit: "Өзгерту",
    delete: "Жою",
    distance: "Қашықтық",
    sanaAssistant: "Sana көмекшісі",
    typeMessage: "Хабар жазыңыз...",
    suggestion1: "Жанымда 2000₸-ге дейін не жеуге болады?",
    suggestion2: "Бүгінгі нан-тоқаш акцияларын көрсет",
    suggestion3: "Артық өнімдерден кешкі ас идеялары",
    noListings: "Белсенді хабарландырулар жоқ.",
    loading: "Жүктелуде...",
    openInMaps: "Google Maps-та ашу",
    vendorInfo: "Сатушы туралы ақпарат",
  },
};

export function t(locale: Locale, key: keyof typeof translations.en): string {
  return translations[locale][key] ?? translations.en[key];
}