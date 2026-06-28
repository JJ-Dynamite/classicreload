'use client'
import { useState } from 'react'
const PLATFORMS = ['nes','snes','genesis','gameboy','n64','ps1','atari','sega']
export default function Home() {
  const [platform, setPlatform] = useState('nes')
  const [games, setGames] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const fetchGames = async () => {
    const res = await fetch(`/api/games?platform=${platform}`)
    const data = await res.json()
    setGames(data.games || [])
  }
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-red-600 bg-clip-text text-transparent">ClassicReload</h1>
        <p className="text-gray-400 mb-8">Play retro games in your browser</p>
        <div className="flex flex-wrap gap-3 mb-8">
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => { setPlatform(p); setSelected(null) }} className={`px-5 py-3 rounded-xl uppercase font-bold transition-all ${platform === p ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>{p}</button>
          ))}
        </div>
        <button onClick={fetchGames} className="bg-gradient-to-r from-yellow-500 to-red-600 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition mb-8">Load Games</button>
        {selected && (
          <div className="bg-black/50 rounded-2xl p-6 mb-8">
            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center"><p className="text-6xl mb-4">🎮</p><p className="text-gray-400">Emulator loading: {selected.title}</p></div>
            </div>
            <div className="flex justify-between items-center">
              <div><h2 className="text-2xl font-bold">{selected.title}</h2><p className="text-gray-400">{selected.platform?.toUpperCase()} - {selected.year}</p></div>
              <button className="bg-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">▶ Play Now</button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map((g) => (
            <div key={g.id} className={`bg-white/10 backdrop-blur rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 ${selected?.id === g.id ? 'ring-2 ring-red-500' : ''}`} onClick={() => setSelected(g)}>
              <div className="aspect-square bg-gradient-to-br from-yellow-600 to-red-700 flex items-center justify-center text-5xl">🎮</div>
              <div className="p-3"><h3 className="font-semibold text-sm">{g.title}</h3><p className="text-gray-400 text-xs">{g.year}</p></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
