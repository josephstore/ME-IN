'use client'

import React, { useState, useEffect } from 'react'
import { 
  Languages, 
  ArrowRightLeft, 
  Copy, 
  Check,
  Loader2,
  Volume2,
  VolumeX
} from 'lucide-react'
import { TranslationService, Language } from '@/lib/services/translationService'

interface TranslationWidgetProps {
  text: string
  defaultSourceLanguage?: string
  defaultTargetLanguage?: string
  onTranslation?: (translatedText: string) => void
  className?: string
}

export default function TranslationWidget({
  text,
  defaultSourceLanguage = 'auto',
  defaultTargetLanguage = 'en',
  onTranslation,
  className = ''
}: TranslationWidgetProps) {
  const [sourceLanguage, setSourceLanguage] = useState(defaultSourceLanguage)
  const [targetLanguage, setTargetLanguage] = useState(defaultTargetLanguage)
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [supportedLanguages] = useState<Language[]>(TranslationService.getSupportedLanguages())

  useEffect(() => {
    if (text && text.trim()) {
      translateText()
    }
  }, [text, sourceLanguage, targetLanguage])

  const translateText = async () => {
    if (!text.trim()) return

    setIsTranslating(true)
    try {
      const result = await TranslationService.translateWithCache(
        text,
        targetLanguage,
        sourceLanguage === 'auto' ? undefined : sourceLanguage
      )

      if (result) {
        setTranslatedText(result.translatedText)
        onTranslation?.(result.translatedText)
      }
    } catch (error) {
      console.error('번역 오류:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  const swapLanguages = () => {
    if (sourceLanguage === 'auto') return
    
    const newSource = targetLanguage
    const newTarget = sourceLanguage
    
    setSourceLanguage(newSource)
    setTargetLanguage(newTarget)
    setTranslatedText(text)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('복사 실패:', error)
    }
  }

  const speakText = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language
      speechSynthesis.speak(utterance)
    }
  }

  const getLanguageName = (code: string) => {
    if (code === 'auto') return '자동 감지'
    const language = supportedLanguages.find(lang => lang.code === code)
    return language ? `${language.nativeName} (${language.name})` : code
  }

  if (!text.trim()) {
    return null
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* 헤더 */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Languages className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">번역</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? '접기' : '펼치기'}
          </button>
        </div>
      </div>

      {/* 언어 선택 */}
      {isExpanded && (
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="auto">자동 감지</option>
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>

            <button
              onClick={swapLanguages}
              disabled={sourceLanguage === 'auto'}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 번역 결과 */}
      <div className="p-3">
        {isTranslating ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">번역 중...</span>
          </div>
        ) : translatedText ? (
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <p className="text-sm text-gray-800 leading-relaxed">{translatedText}</p>
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={() => speakText(translatedText, targetLanguage)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="음성 재생"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={copyToClipboard}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="복사"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {getLanguageName(sourceLanguage)} → {getLanguageName(targetLanguage)}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            번역할 텍스트를 입력하세요
          </div>
        )}
      </div>
    </div>
  )
}
