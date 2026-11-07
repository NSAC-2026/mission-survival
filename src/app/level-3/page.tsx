'use client'

import { useRouter } from 'next/navigation'
import SpaceStationDocking from '@/components/SpaceStationDocking'

export default function Level3Page() {
  const router = useRouter()

  return (
    <SpaceStationDocking
      onBack={() => router.push('/')}
      onNext={() => router.push('/level-4')}
    />
  )
}


