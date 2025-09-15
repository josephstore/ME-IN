import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let text = ''
  let source = ''
  
  try {
    const requestData = await request.json()
    text = requestData.text
    source = requestData.source || 'auto'
    const target = requestData.target

    if (!text || !target) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      )
    }

    // Google Translate API 호출
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: target,
          source: source,
          format: 'text'
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.data && data.data.translations && data.data.translations.length > 0) {
      const translation = data.data.translations[0]
      
      return NextResponse.json({
        translatedText: translation.translatedText,
        detectedLanguage: translation.detectedSourceLanguage || source,
        confidence: 1.0 // Google Translate는 confidence를 제공하지 않음
      })
    } else {
      throw new Error('No translation result received')
    }
  } catch (error) {
    console.error('Translation API error:', error)
    
    // Google Translate API 키가 없는 경우 더미 번역 반환
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json({
        translatedText: `[번역됨] ${text}`,
        detectedLanguage: source || 'auto',
        confidence: 0.5
      })
    }
    
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}
