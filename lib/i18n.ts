export const supportedLanguages = ['ko', 'en', 'ar'] as const;
export type Language = typeof supportedLanguages[number];

export const defaultLanguage: Language = 'ko';

export const languageNames = {
  ko: '한국어',
  en: 'English',
  ar: 'العربية'
} as const;

export const translations = {
  ko: {
    // 헤더
    'nav.home': '홈',
    'nav.brands': '브랜드',
    'nav.influencers': '인플루언서',
    'nav.campaigns': '캠페인',
    'nav.about': '소개',
    'nav.contact': '문의',
    'nav.login': '로그인',
    'nav.register': '회원가입',
    'nav.logout': '로그아웃',
    
    // 히어로 섹션
    'hero.badge': '중동 & 한국 연결',
    'hero.title': '중동 인플루언서와 한국 브랜드를 연결하는 플랫폼',
    'hero.subtitle': '빅데이터 기반 AI 매칭으로 최적의 파트너를 찾으세요',
    'hero.cta.primary': '지금 시작하기',
    'hero.cta.secondary': '자세히 보기',
    
    // 기능 섹션
    'features.title': 'ME-IN의 핵심 기능',
    'features.ai_matching.title': 'AI 스마트 매칭',
    'features.ai_matching.description': '빅데이터 기반 AI 알고리즘으로 최적의 매칭을 제공합니다',
    'features.analytics.title': '실시간 분석',
    'features.analytics.description': '캠페인 성과를 실시간으로 추적하고 분석합니다',
    'features.multilingual.title': '다국어 지원',
    'features.multilingual.description': '한국어, 영어, 아랍어 완전 지원',
    'features.security.title': '보안 강화',
    'features.security.description': '개인정보보호 및 데이터 보안을 최우선으로 합니다',
    
    // 통계 섹션
    'stats.title': 'ME-IN의 성과',
    'stats.influencers': '인플루언서',
    'stats.brands': '브랜드',
    'stats.campaigns': '캠페인',
    'stats.countries': '국가',
    
    // CTA 섹션
    'cta.title': '지금 바로 시작하세요',
    'cta.subtitle': '중동 시장 진출의 새로운 기회를 만나보세요',
    'cta.button': '무료로 시작하기',
    
    // 인증
    'auth.login.title': '로그인',
    'auth.login.subtitle': '계정에 로그인하세요',
    'auth.email': '이메일',
    'auth.password': '비밀번호',
    'auth.remember': '로그인 상태 유지',
    'auth.forgot': '비밀번호를 잊으셨나요?',
    'auth.or': '또는',
    'auth.no_account': '계정이 없으신가요?',
    
    // 푸터
    'footer.company': 'ME-IN',
    'footer.description': '중동 인플루언서 네트워크 플랫폼',
    'footer.contact': '문의',
    'footer.privacy': '개인정보처리방침',
    'footer.terms': '이용약관',
    'footer.copyright': '© 2025 ME-IN. All rights reserved.'
  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.brands': 'Brands',
    'nav.influencers': 'Influencers',
    'nav.campaigns': 'Campaigns',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    
    // Hero Section
    'hero.badge': 'Middle East & Korea Connected',
    'hero.title': 'Connecting Middle East Influencers with Korean Brands',
    'hero.subtitle': 'Find the perfect partner with AI-powered matching based on big data',
    'hero.cta.primary': 'Get Started',
    'hero.cta.secondary': 'Learn More',
    
    // Features Section
    'features.title': 'Core Features of ME-IN',
    'features.ai_matching.title': 'AI Smart Matching',
    'features.ai_matching.description': 'AI algorithm based on big data provides optimal matching',
    'features.analytics.title': 'Real-time Analytics',
    'features.analytics.description': 'Track and analyze campaign performance in real-time',
    'features.multilingual.title': 'Multilingual Support',
    'features.multilingual.description': 'Full support for Korean, English, and Arabic',
    'features.security.title': 'Enhanced Security',
    'features.security.description': 'Prioritizes privacy protection and data security',
    
    // Stats Section
    'stats.title': 'ME-IN Performance',
    'stats.influencers': 'Influencers',
    'stats.brands': 'Brands',
    'stats.campaigns': 'Campaigns',
    'stats.countries': 'Countries',
    
    // CTA Section
    'cta.title': 'Start Now',
    'cta.subtitle': 'Discover new opportunities in the Middle East market',
    'cta.button': 'Start Free',
    
    // Auth
    'auth.login.title': 'Sign In',
    'auth.login.subtitle': 'Sign in to your account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.remember': 'Remember me',
    'auth.forgot': 'Forgot your password?',
    'auth.or': 'Or',
    'auth.no_account': "Don't have an account?",
    
    // Footer
    'footer.company': 'ME-IN',
    'footer.description': 'Middle East Influencer Network Platform',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.copyright': '© 2025 ME-IN. All rights reserved.'
  },
  ar: {
    // Header
    'nav.home': 'الرئيسية',
    'nav.brands': 'العلامات التجارية',
    'nav.influencers': 'المؤثرون',
    'nav.campaigns': 'الحملات',
    'nav.about': 'حول',
    'nav.contact': 'اتصل بنا',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'التسجيل',
    'nav.logout': 'تسجيل الخروج',
    
    // Hero Section
    'hero.badge': 'الشرق الأوسط وكوريا متصلان',
    'hero.title': 'ربط المؤثرين في الشرق الأوسط بالعلامات التجارية الكورية',
    'hero.subtitle': 'اعثر على الشريك المثالي مع المطابقة المدعومة بالذكاء الاصطناعي',
    'hero.cta.primary': 'ابدأ الآن',
    'hero.cta.secondary': 'اعرف المزيد',
    
    // Features Section
    'features.title': 'الميزات الأساسية لـ ME-IN',
    'features.ai_matching.title': 'المطابقة الذكية بالذكاء الاصطناعي',
    'features.ai_matching.description': 'خوارزمية الذكاء الاصطناعي القائمة على البيانات الضخمة توفر مطابقة مثالية',
    'features.analytics.title': 'التحليلات في الوقت الفعلي',
    'features.analytics.description': 'تتبع وتحليل أداء الحملات في الوقت الفعلي',
    'features.multilingual.title': 'الدعم متعدد اللغات',
    'features.multilingual.description': 'دعم كامل للكورية والإنجليزية والعربية',
    'features.security.title': 'الأمان المحسن',
    'features.security.description': 'يضع حماية الخصوصية وأمان البيانات في المقام الأول',
    
    // Stats Section
    'stats.title': 'أداء ME-IN',
    'stats.influencers': 'مؤثرون',
    'stats.brands': 'علامات تجارية',
    'stats.campaigns': 'حملات',
    'stats.countries': 'دول',
    
    // CTA Section
    'cta.title': 'ابدأ الآن',
    'cta.subtitle': 'اكتشف فرصًا جديدة في السوق الشرق أوسطي',
    'cta.button': 'ابدأ مجانًا',
    
    // Auth
    'auth.login.title': 'تسجيل الدخول',
    'auth.login.subtitle': 'سجل دخولك إلى حسابك',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.remember': 'تذكرني',
    'auth.forgot': 'نسيت كلمة المرور؟',
    'auth.or': 'أو',
    'auth.no_account': 'ليس لديك حساب؟',
    
    // Footer
    'footer.company': 'ME-IN',
    'footer.description': 'منصة شبكة المؤثرين في الشرق الأوسط',
    'footer.contact': 'اتصل بنا',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الخدمة',
    'footer.copyright': '© 2025 ME-IN. جميع الحقوق محفوظة.'
  }
} as const;

export function getTranslation(lang: Language, key: string): string {
  return translations[lang][key as keyof typeof translations[typeof lang]] || key;
}

export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && supportedLanguages.includes(savedLang)) {
      return savedLang;
    }
    
    const browserLang = navigator.language.split('-')[0] as Language;
    if (supportedLanguages.includes(browserLang)) {
      return browserLang;
    }
  }
  return defaultLanguage;
}

export function setLanguage(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
}
