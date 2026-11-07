import { redirect } from 'next/navigation'

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ]
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function DynamicLevelPage({ params }: Props) {
  const { id } = await params
  const levelNum = parseInt(id, 10)

  if (levelNum >= 1 && levelNum <= 5) {
    redirect(`/level-${levelNum}`)
  }

  redirect('/')
}
