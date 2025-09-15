import { Suspense } from 'react'
import CampaignHomePage from '@/components/CampaignHomePage'

function HomePageContent() {
  return <CampaignHomePage />
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}