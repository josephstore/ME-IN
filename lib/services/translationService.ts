/**
 * ME-IN 다국어 번역 서비스
 * Google Translate API를 활용한 실시간 번역 시스템
 */

export interface TranslationResult {
  translatedText: string
  detectedLanguage: string
  confidence: number
}

export interface Language {
  code: string
  name: string
  nativeName: string
}

export class TranslationService {
  private static readonly SUPPORTED_LANGUAGES: Language[] = [
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' }
  ]

  /**
   * 지원되는 언어 목록 조회
   */
  static getSupportedLanguages(): Language[] {
    return this.SUPPORTED_LANGUAGES
  }

  /**
   * 언어 코드로 언어 정보 조회
   */
  static getLanguageByCode(code: string): Language | undefined {
    return this.SUPPORTED_LANGUAGES.find(lang => lang.code === code)
  }

  /**
   * 텍스트 번역 (Google Translate API 사용)
   */
  static async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<TranslationResult | null> {
    try {
      // Google Translate API 호출
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          target: targetLanguage,
          source: sourceLanguage
        })
      })

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('번역 오류:', error)
      return null
    }
  }

  /**
   * 언어 자동 감지
   */
  static async detectLanguage(text: string): Promise<string | null> {
    try {
      const result = await this.translateText(text, 'en')
      return result?.detectedLanguage || null
    } catch (error) {
      console.error('언어 감지 오류:', error)
      return null
    }
  }

  /**
   * 다중 언어 번역
   */
  static async translateToMultipleLanguages(
    text: string,
    targetLanguages: string[],
    sourceLanguage?: string
  ): Promise<Record<string, string>> {
    const translations: Record<string, string> = {}
    
    try {
      const promises = targetLanguages.map(async (lang) => {
        const result = await this.translateText(text, lang, sourceLanguage)
        if (result) {
          translations[lang] = result.translatedText
        }
      })

      await Promise.all(promises)
      return translations
    } catch (error) {
      console.error('다중 언어 번역 오류:', error)
      return translations
    }
  }

  /**
   * 캠페인 내용 번역 (제목, 설명 등)
   */
  static async translateCampaignContent(
    content: {
      title?: string
      description?: string
      requirements?: string
    },
    targetLanguages: string[]
  ): Promise<Record<string, any>> {
    const translations: Record<string, any> = {}

    try {
      for (const lang of targetLanguages) {
        translations[lang] = {}

        if (content.title) {
          const titleResult = await this.translateText(content.title, lang)
          if (titleResult) {
            translations[lang].title = titleResult.translatedText
          }
        }

        if (content.description) {
          const descResult = await this.translateText(content.description, lang)
          if (descResult) {
            translations[lang].description = descResult.translatedText
          }
        }

        if (content.requirements) {
          const reqResult = await this.translateText(content.requirements, lang)
          if (reqResult) {
            translations[lang].requirements = reqResult.translatedText
          }
        }
      }

      return translations
    } catch (error) {
      console.error('캠페인 내용 번역 오류:', error)
      return translations
    }
  }

  /**
   * 메시지 실시간 번역
   */
  static async translateMessage(
    message: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<string> {
    try {
      const result = await this.translateText(message, targetLanguage, sourceLanguage)
      return result?.translatedText || message
    } catch (error) {
      console.error('메시지 번역 오류:', error)
      return message
    }
  }

  /**
   * 번역 캐시 (로컬 스토리지 사용)
   */
  private static getCacheKey(text: string, targetLang: string, sourceLang?: string): string {
    return `translation_${sourceLang || 'auto'}_${targetLang}_${btoa(text)}`
  }

  static async translateWithCache(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<TranslationResult | null> {
    const cacheKey = this.getCacheKey(text, targetLanguage, sourceLanguage)
    
    // 캐시에서 확인
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch (error) {
        localStorage.removeItem(cacheKey)
      }
    }

    // 번역 실행
    const result = await this.translateText(text, targetLanguage, sourceLanguage)
    
    // 캐시에 저장 (24시간)
    if (result) {
      const cacheData = {
        ...result,
        cachedAt: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    }

    return result
  }

  /**
   * 번역 품질 평가 (간단한 휴리스틱)
   */
  static evaluateTranslationQuality(
    originalText: string,
    translatedText: string
  ): number {
    // 간단한 품질 평가 로직
    const originalLength = originalText.length
    const translatedLength = translatedText.length
    
    // 길이 비율이 너무 다르면 품질이 낮을 가능성
    const lengthRatio = Math.min(originalLength, translatedLength) / Math.max(originalLength, translatedLength)
    
    // 특수 문자나 숫자가 많이 포함되어 있으면 품질이 높을 가능성
    const specialCharCount = (translatedText.match(/[^\w\s]/g) || []).length
    const specialCharRatio = specialCharCount / translatedLength
    
    // 기본 점수 계산 (0-100)
    let score = 50
    
    // 길이 비율 기반 조정
    if (lengthRatio > 0.5) score += 20
    else if (lengthRatio > 0.3) score += 10
    
    // 특수 문자 비율 기반 조정
    if (specialCharRatio > 0.1) score += 15
    else if (specialCharRatio > 0.05) score += 10
    
    return Math.min(100, Math.max(0, score))
  }
}
