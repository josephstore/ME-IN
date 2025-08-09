export interface User {
  id: string;
  email: string;
  userType: 'brand' | 'influencer';
  profile: {
    name: string;
    language: string[];
    timezone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandProfile {
  userId: string;
  companyInfo: {
    name: {
      ko: string;
      en: string;
      ar: string;
    };
    businessNumber: string;
    logo?: string;
  };
  products: Product[];
  targetMarkets: string[];
  budget: {
    min: number;
    max: number;
  };
}

export interface InfluencerProfile {
  userId: string;
  socialAccounts: SocialAccount[];
  expertise: string[];
  languages: string[];
  locations: string[];
  followers: number;
  avgViews: number;
}

export interface SocialAccount {
  platform: 'instagram' | 'tiktok' | 'youtube';
  username: string;
  followers: number;
  avgViews: number;
}

export interface Product {
  id: string;
  name: {
    ko: string;
    en: string;
    ar: string;
  };
  category: string;
  description: {
    ko: string;
    en: string;
    ar: string;
  };
  images: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  userType: 'brand' | 'influencer';
  profile: {
    name: string;
    language: string[];
    timezone: string;
  };
}
