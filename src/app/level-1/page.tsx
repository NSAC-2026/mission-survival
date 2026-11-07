'use client'

import { useRouter } from 'next/navigation'
import AstronautProfile from '@/components/AstronautProfile'

export default function Level1Page() {
  const router = useRouter()

  return (
    <AstronautProfile
      onBack={() => router.push('/')}
      onNext={() => router.push('/level-2')}
    />
  )
}


