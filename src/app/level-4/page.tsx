'use client'

import { useRouter } from 'next/navigation'
import MissionSurvivalTerminal from '@/components/MissionSurvivalTerminal'
import { unlockLevel } from '@/lib/campaign-state'

export default function Level4Page() {
  const router = useRouter()

  return (
    <MissionSurvivalTerminal
      initialLevel={4}
      onBack={() => router.push('/')}
      onNext={() => {
        unlockLevel(5)
        router.push('/level-5')
      }}
    />
  )
}


