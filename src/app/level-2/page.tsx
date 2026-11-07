'use client'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { unlockLevel } from '@/lib/campaign-state'

const ProtonDashboard = dynamic(() => import('@/components/ProtonDashboard'), {
  ssr: false,
  loading: () => <div className="proton-dashboard" />,
})

export default function Level2Page() {
  const router = useRouter()

  return (
    <ProtonDashboard
      onBack={() => router.push('/')}
      onNext={() => {
        unlockLevel(3)
        router.push('/level-3')
      }}
    />
  )
}



