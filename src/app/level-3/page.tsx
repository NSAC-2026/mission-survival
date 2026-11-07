'use client'

import { useRouter } from 'next/navigation'
import SpaceStationDocking from '@/components/SpaceStationDocking'
import { unlockLevel } from '@/lib/campaign-state'

export default function Level3Page() {
  const router = useRouter()

  return (
    <SpaceStationDocking
      onBack={() => router.push('/')}
      onNext={() => {
        unlockLevel(4)
        router.push('/level-4')
      }}
    />
  )
}


