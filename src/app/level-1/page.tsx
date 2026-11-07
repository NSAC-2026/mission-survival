'use client'

import { useRouter } from 'next/navigation'
import AstronautProfile from '@/components/AstronautProfile'
import { unlockLevel } from '@/lib/campaign-state'

export default function Level1Page() {
  const router = useRouter()

  return (
    <AstronautProfile
      onBack={() => router.push('/')}
      onNext={() => {
        unlockLevel(2)
        router.push('/level-2')
      }}
    />
  )
}


