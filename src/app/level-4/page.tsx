'use client'

import { useRouter } from 'next/navigation'
import MissionSurvivalTerminal from '@/components/MissionSurvivalTerminal'
import HelpDeskChatbot from '@/components/HelpDeskChatbot'
import { unlockLevel } from '@/lib/campaign-state'
import { recordLevelScore } from '@/lib/score-system'

export default function Level4Page() {
  const router = useRouter()

  return (
    <>
      <MissionSurvivalTerminal
        initialLevel={4}
        onBack={() => router.push('/')}
        onNext={() => {
          recordLevelScore(4, 1500, 1500, 3, { note: 'Artemis Moon Night Survived' })
          unlockLevel(5)
          router.push('/level-5')
        }}
      />
      <HelpDeskChatbot />
    </>
  )
}
