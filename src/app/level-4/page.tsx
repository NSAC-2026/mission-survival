'use client'

import { useRouter } from 'next/navigation'
import MissionSurvivalTerminal from '@/components/MissionSurvivalTerminal'

export default function Level4Page() {
  const router = useRouter()

  return (
    <MissionSurvivalTerminal
      initialLevel={4}
      onBack={() => router.push('/')}
      onNext={() => router.push('/level-5')}
    />
  )
}


