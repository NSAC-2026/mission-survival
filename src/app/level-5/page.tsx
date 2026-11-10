'use client'

import { useRouter } from 'next/navigation'
import MissionSurvivalTerminal from '@/components/MissionSurvivalTerminal'
import HelpDeskChatbot from '@/components/HelpDeskChatbot'
import { recordLevelScore } from '@/lib/score-system'

export default function Level5Page() {
  const router = useRouter()

  return (
    <>
      <MissionSurvivalTerminal
        initialLevel={5}
        onBack={() => router.push('/')}
        onNext={() => {
          recordLevelScore(5, 2000, 2000, 3, { note: 'Mars Bio-Dome Secured' })
          router.push('/')
        }}
      />
      <HelpDeskChatbot />
    </>
  )
}
