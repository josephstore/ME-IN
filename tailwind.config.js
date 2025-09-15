/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ME-IN 브랜드 색상
        navy: {
          50: '#f0f2f5',
          100: '#d9dde3',
          200: '#b3bcc7',
          300: '#8d9aab',
          400: '#67798f',
          500: '#415773',
          600: '#1C2B4A', // 메인 네이비
          700: '#16223a',
          800: '#111a2d',
          900: '#0c121f',
        },
        beige: {
          50: '#FEFCF9',
          100: '#FDF9F3',
          200: '#FBF3E7',
          300: '#F9EDDB',
          400: '#F8F3EB', // 메인 베이지
          500: '#F0E8D8',
          600: '#E8DDC5',
          700: '#E0D2B2',
          800: '#D8C79F',
          900: '#D0BC8C',
        },
        salmon: {
          50: '#FEF7F3',
          100: '#FDEFE7',
          200: '#FBDFCF',
          300: '#F9CFB7',
          400: '#F5BF9F',
          500: '#F2AA84', // 메인 연어주황
          600: '#E89A6A',
          700: '#DE8A50',
          800: '#D47A36',
          900: '#CA6A1C',
        },
        // 기존 색상 유지 (호환성)
        primary: {
          50: '#f0f2f5',
          100: '#d9dde3',
          200: '#b3bcc7',
          300: '#8d9aab',
          400: '#67798f',
          500: '#415773',
          600: '#1C2B4A',
          700: '#16223a',
          800: '#111a2d',
          900: '#0c121f',
        },
        secondary: {
          50: '#FEFCF9',
          100: '#FDF9F3',
          200: '#FBF3E7',
          300: '#F9EDDB',
          400: '#F8F3EB',
          500: '#F0E8D8',
          600: '#E8DDC5',
          700: '#E0D2B2',
          800: '#D8C79F',
          900: '#D0BC8C',
        },
        accent: {
          50: '#FEF7F3',
          100: '#FDEFE7',
          200: '#FBDFCF',
          300: '#F9CFB7',
          400: '#F5BF9F',
          500: '#F2AA84',
          600: '#E89A6A',
          700: '#DE8A50',
          800: '#D47A36',
          900: '#CA6A1C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // 반응형 텍스트 크기 (최소 크기 보장)
        'xs-responsive': ['0.75rem', { lineHeight: '1rem', minSize: '0.75rem' }], // 12px
        'sm-responsive': ['0.875rem', { lineHeight: '1.25rem', minSize: '0.875rem' }], // 14px
        'base-responsive': ['1rem', { lineHeight: '1.5rem', minSize: '1rem' }], // 16px
        'lg-responsive': ['1.125rem', { lineHeight: '1.75rem', minSize: '1.125rem' }], // 18px
        'xl-responsive': ['1.25rem', { lineHeight: '1.75rem', minSize: '1.25rem' }], // 20px
        '2xl-responsive': ['1.5rem', { lineHeight: '2rem', minSize: '1.5rem' }], // 24px
        '3xl-responsive': ['1.875rem', { lineHeight: '2.25rem', minSize: '1.875rem' }], // 30px
        '4xl-responsive': ['2.25rem', { lineHeight: '2.5rem', minSize: '2.25rem' }], // 36px
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

