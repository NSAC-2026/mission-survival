'use client'

import { useRouter } from 'next/navigation'
import ProtonDashboard from '@/components/ProtonDashboard'

export default function Level2Page() {
  const router = useRouter()

  return (
    <ProtonDashboard
      onBack={() => router.push('/')}
      onNext={() => router.push('/level-3')}
    />
  )
}


