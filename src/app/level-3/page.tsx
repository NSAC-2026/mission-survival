'use client'

import { useRouter } from 'next/navigation'
import SpaceStationDocking from '@/components/SpaceStationDocking'
import HelpDeskChatbot from '@/components/HelpDeskChatbot'
import { unlockLevel } from '@/lib/campaign-state'
import { recordLevelScore } from '@/lib/score-system'

export default function Level3Page() {
  const router = useRouter()

  return (
    <>
      <SpaceStationDocking
        onBack={() => router.push('/')}
        onNext={() => {
          recordLevelScore(3, 2000, 2000, 3, { note: 'Hard Latch Capture Locked' })
          unlockLevel(4)
          router.push('/level-4')
        }}
      />
      <HelpDeskChatbot />
    </>
  )
}
