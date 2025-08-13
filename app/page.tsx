import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import StatsSection from '@/components/sections/StatsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}