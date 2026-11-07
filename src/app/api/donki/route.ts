import { NextResponse } from 'next/server'
import { getSpaceWeatherReport } from '@/utils/nasaDonki'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const apiKey = searchParams.get('apiKey') || undefined

  try {
    const report = await getSpaceWeatherReport(apiKey)
    return NextResponse.json(report)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to query NASA DONKI', details: String(error) },
      { status: 500 }
    )
  }
}

