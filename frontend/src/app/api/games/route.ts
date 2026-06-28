import { NextRequest, NextResponse } from 'next/server'
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const platform = searchParams.get('platform') || 'nes'
  const res = await fetch(`http://localhost:3001/games?platform=${platform}`)
  const data = await res.json()
  return NextResponse.json(data)
}
