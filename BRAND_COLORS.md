# ME-IN 브랜드 색상 가이드

## 🎨 브랜드 색상 팔레트

### 메인 색상

#### 1. 네이비 (Navy) - #1C2B4A
- **용도**: 메인 브랜드 컬러, 텍스트, 버튼, 헤더
- **의미**: 신뢰성, 전문성, 안정성
- **사용 예시**: 
  - 로고 배경
  - 메인 버튼
  - 헤더 텍스트
  - 네비게이션 바

#### 2. 베이지 (Beige) - #F8F3EB
- **용도**: 배경색, 카드 배경, 부드러운 톤
- **의미**: 따뜻함, 친근함, 편안함
- **사용 예시**:
  - 전체 배경색
  - 카드 배경
  - 입력 필드 배경
  - 구분선

#### 3. 연어주황 (Salmon) - #F2AA84
- **용도**: 액센트 컬러, 강조, CTA 버튼
- **의미**: 활력, 창의성, 따뜻함
- **사용 예시**:
  - 카테고리 태그
  - 알림 배지
  - 호버 효과
  - 강조 텍스트

## 🎯 색상 사용 가이드라인

### 텍스트 색상
- **주요 텍스트**: `text-navy-600` (#1C2B4A)
- **보조 텍스트**: `text-navy-500` (중간 톤)
- **설명 텍스트**: `text-navy-400` (연한 톤)

### 배경 색상
- **메인 배경**: `bg-beige-50` (#FEFCF9)
- **카드 배경**: `bg-white`
- **입력 필드**: `bg-beige-100`

### 버튼 색상
- **주요 버튼**: `bg-navy-600` + `hover:bg-navy-700`
- **액센트 버튼**: `bg-salmon-500` + `hover:bg-salmon-600`
- **보조 버튼**: `bg-beige-200` + `text-navy-600`

### 테두리 색상
- **일반 테두리**: `border-beige-200`
- **강조 테두리**: `border-navy-300`
- **포커스 테두리**: `border-salmon-500`

## 📱 컴포넌트별 색상 적용

### 헤더
```css
background: white
border: beige-200
logo: Arabic logo with beige-400 background
text: navy-600
notification: salmon-500
```

### 검색바
```css
background: beige-100
text: navy-600
placeholder: navy-400
focus: salmon-500
```

### 캠페인 카드
```css
background: white
border: beige-200
category: salmon-100 + salmon-800
title: navy-600
description: navy-400
button: navy-600
```

### 로그인 페이지
```css
background: beige-50 to beige-100
logo: Arabic logo with beige-400 background
title: navy-600
info box: salmon-50 + salmon-200
button: navy-600
```

## 🎨 Tailwind CSS 클래스

### 네이비 색상
- `text-navy-600` - 메인 텍스트
- `bg-navy-600` - 메인 버튼
- `border-navy-300` - 테두리

### 베이지 색상
- `bg-beige-50` - 메인 배경
- `bg-beige-100` - 입력 필드
- `border-beige-200` - 구분선

### 연어주황 색상
- `bg-salmon-500` - 액센트 버튼
- `text-salmon-800` - 강조 텍스트
- `bg-salmon-100` - 태그 배경

## 🌟 브랜드 톤앤매너

### 전체적인 느낌
- **따뜻하고 친근한**: 베이지 톤으로 편안함 제공
- **전문적이고 신뢰할 수 있는**: 네이비로 안정성 표현
- **활기차고 창의적인**: 연어주황으로 에너지 표현

### 사용 원칙
1. **네이비**: 주요 정보, 중요한 버튼, 브랜드 요소
2. **베이지**: 배경, 구분, 부드러운 톤
3. **연어주황**: 강조, 액센트, 주목을 끄는 요소

### 금지 사항
- 너무 많은 색상 혼용 금지
- 네이비와 베이지의 조화 유지
- 연어주황은 적절한 비율로 사용 (전체의 10-20%)

## 📋 체크리스트

- [ ] 모든 텍스트가 네이비 톤으로 통일되었는가?
- [ ] 배경이 베이지 톤으로 따뜻한 느낌을 주는가?
- [ ] 액센트 요소에 연어주황이 적절히 사용되었는가?
- [ ] 색상 대비가 충분하여 가독성이 좋은가?
- [ ] 브랜드 일관성이 유지되는가?

---

**업데이트 날짜**: 2025년 1월 8일  
**버전**: 1.0  
**담당자**: ME-IN 디자인팀
