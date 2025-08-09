import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    ko: '한국어',
    en: 'English',
    ar: 'العربية',
  }
  return languages[code] || code
}

export function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    SA: 'Saudi Arabia',
    UAE: 'United Arab Emirates',
    KW: 'Kuwait',
    QA: 'Qatar',
    BH: 'Bahrain',
    OM: 'Oman',
    JO: 'Jordan',
    LB: 'Lebanon',
    EG: 'Egypt',
    IQ: 'Iraq',
    SY: 'Syria',
    YE: 'Yemen',
    PS: 'Palestine',
    LY: 'Libya',
    TN: 'Tunisia',
    DZ: 'Algeria',
    MA: 'Morocco',
    SD: 'Sudan',
    TD: 'Chad',
    MR: 'Mauritania',
    DJ: 'Djibouti',
    SO: 'Somalia',
    KM: 'Comoros',
  }
  return countries[code] || code
}
