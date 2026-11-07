'use client'

import { useRouter } from 'next/navigation'
import MissionSurvivalTerminal from '@/components/MissionSurvivalTerminal'

export default function Level5Page() {
  const router = useRouter()

  return (
    <MissionSurvivalTerminal
      initialLevel={5}
      onBack={() => router.push('/')}
      onNext={() => router.push('/')}
    />
  )
}


