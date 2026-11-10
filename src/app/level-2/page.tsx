'use client'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import HelpDeskChatbot from '@/components/HelpDeskChatbot'
import { unlockLevel } from '@/lib/campaign-state'
import { recordLevelScore } from '@/lib/score-system'

const ProtonDashboard = dynamic(() => import('@/components/ProtonDashboard'), {
  ssr: false,
  loading: () => <div className="proton-dashboard" />,
})

export default function Level2Page() {
  const router = useRouter()

  return (
    <>
      <ProtonDashboard
        onBack={() => router.push('/')}
        onNext={() => {
          recordLevelScore(2, 1500, 1500, 3, { note: 'Proton Orbital Insertion 7.8 km/s' })
          unlockLevel(3)
          router.push('/level-3')
        }}
      />
      <HelpDeskChatbot />
    </>
  )
}
