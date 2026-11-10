'use client'

import { useRouter } from 'next/navigation'
import AstronautProfile from '@/components/AstronautProfile'
import HelpDeskChatbot from '@/components/HelpDeskChatbot'
import { unlockLevel } from '@/lib/campaign-state'
import { recordLevelScore } from '@/lib/score-system'

export default function Level1Page() {
  const router = useRouter()

  return (
    <>
      <AstronautProfile
        onBack={() => router.push('/')}
        onNext={() => {
          recordLevelScore(1, 1000, 1000, 3, { note: 'Solar Storm Shield 100% Intact' })
          unlockLevel(2)
          router.push('/level-2')
        }}
      />
      <HelpDeskChatbot />
    </>
  )
}
