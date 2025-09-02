import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useProgress } from './useProgress'

type Tile = {
  id: number            // id correto (índice da peça na solução)
  img: string           // dataURL da fatia
}

function shuffle<T>(arr: T[]): T[] {
  // Fisher-Yates
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const defaultImages = [
  '/puzzles/animais1.jpg',
  '/puzzles/brinquedos1.jpg',
  '/puzzles/formas1.jpg',
]

// fallback: gera uma imagem simples em runtime caso não encontre arquivos
function generateFallback(width=600, height=600) {
  const cvs = document.createElement('canvas')
  cvs.width = width; cvs.height = height
  const ctx = cvs.getContext('2d')!
  const g = ctx.createLinearGradient(0,0,width,height)
  g.addColorStop(0, '#e0f2fe')
  g.addColorStop(1, '#dbeafe')
  ctx.fillStyle = g
  ctx.fillRect(0,0,width,height)
  ctx.fillStyle = '#0ea5e9'
  ctx.font = 'bold 48px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Quebra-cabeça', width/2, height/2-10)
  ctx.font = '24px Inter, system-ui, sans-serif'
  ctx.fillText('adicione imagens em /public/puzzles', width/2, height/2+36)
  return cvs.toDataURL('image/png')
}

const Puzzle: React.FC = () => {
  const { save } = useProgress('puzzle')

  // Configurações
  const [grid, setGrid] = useState<3|4>(3)
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [solved, setSolved] = useState(false)
  const [outline, setOutline] = useState(true)

  const [imageUrl, setImageUrl] = useState(defaultImages[0])
  const [tiles, setTiles] = useState<Tile[]>([])
  const [order, setOrder] = useState<number[]>([]) // ordem atual (guarda ids)
  const timerRef = useRef<number | null>(null)

  // carrega imagem, fatia e embaralha
  useEffect(() => {
    let isMounted = true
    async function load() {
      setSolved(false); setMoves(0); setSeconds(0); setRunning(false)
      // carrega imagem (ou fallback)
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        if (!isMounted) return
        const W = img.width, H = img.height
        const size = Math.min(W, H)
        // canvas quadrado
        const cvs = document.createElement('canvas')
        cvs.width = size; cvs.height = size
        const ctx = cvs.getContext('2d')!
        ctx.drawImage(img, (W-size)/2, (H-size)/2, size, size, 0, 0, size, size)

        const slice: Tile[] = []
        const n = grid
        const pw = size / n, ph = size / n
        for (let r=0; r<n; r++) {
          for (let c=0; c<n; c++) {
            const part = document.createElement('canvas')
            part.width = pw; part.height = ph
            const pctx = part.getContext('2d')!
            pctx.drawImage(cvs, c*pw, r*ph, pw, ph, 0, 0, pw, ph)
            slice.push({ id: r*n + c, img: part.toDataURL('image/png') })
          }
        }
        setTiles(slice)
        // embaralha até não estar resolvido
        let ids = slice.map(s => s.id)
        do { ids = shuffle(ids) } while (ids.every((v,i)=>v===i))
        setOrder(ids)
      }
      img.onerror = () => {
        const data = generateFallback()
        setImageUrl(data) // força redraw
      }
      img.src = imageUrl
    }
    load()
    return () => { isMounted = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, grid])

  // cronômetro
  useEffect(() => {
    if (running && !solved) {
      timerRef.current = window.setInterval(() => setSeconds(s=>s+1), 1000)
      return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
    }
  }, [running, solved])

  const onDragStart = (e: React.DragEvent<HTMLButtonElement>, idx: number) => {
    e.dataTransfer.setData('text/plain', String(idx))
  }
  const onDrop = (e: React.DragEvent<HTMLButtonElement>, idx: number) => {
    const from = Number(e.dataTransfer.getData('text/plain'))
    if (Number.isNaN(from)) return
    if (from === idx) return
    setOrder(prev => {
      const copy = [...prev]
      ;[copy[from], copy[idx]] = [copy[idx], copy[from]]
      return copy
    })
    if (!running) setRunning(true)
    setMoves(m => m+1)
  }
  const onDragOver = (e: React.DragEvent<HTMLButtonElement>) => e.preventDefault()

  // verifica solução
  useEffect(() => {
    if (tiles.length === 0 || order.length === 0) return
    const ok = order.every((id, i) => id === i)
    if (ok && !solved) {
      setSolved(true)
      setRunning(false)
      if (timerRef.current) window.clearInterval(timerRef.current)
      // salva progresso
      save({ grid, moves, seconds }, 1, moves)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order])

  const gridStyle = useMemo(() => `grid gap-2 sm:gap-3 grid-cols-${grid}`, [grid])

  function resetShuffle() {
    if (tiles.length === 0) return
    let ids = tiles.map(t => t.id)
    do { ids = shuffle(ids) } while (ids.every((v,i)=>v===i))
    setOrder(ids); setSolved(false); setMoves(0); setSeconds(0); setRunning(false)
  }

  function formatTime(s: number) {
    const h = Math.floor(s/3600).toString().padStart(2,'0')
    const m = Math.floor((s%3600)/60).toString().padStart(2,'0')
    const ss = Math.floor(s%60).toString().padStart(2,'0')
    return `${h}:${m}:${ss}`
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-primary">Quebra-cabeça</h1>

      {/* Controles */}
      <div className="card mb-4 grid md:grid-cols-4 gap-3">
        <div className="space-y-1">
          <label className="label">Imagem</label>
          <select
            className="input"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          >
            {defaultImages.map((u, i) => <option key={i} value={u}>{u.split('/').pop()}</option>)}
            <option value={imageUrl}>— personalizada / fallback —</option>
          </select>
          <div className="text-xs text-gray-500">
            Dica: coloque imagens em <b>frontend/public/puzzles</b>
          </div>
        </div>

        <div className="space-y-1">
          <label className="label">Dificuldade</label>
          <select className="input" value={grid} onChange={e=>setGrid(Number(e.target.value) as 3|4)}>
            <option value={3}>Fácil — 3×3</option>
            <option value={4}>Médio — 4×4</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="label">Visual</label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={outline} onChange={()=>setOutline(o=>!o)} />
              Mostrar bordas
            </label>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <button className="btn" onClick={resetShuffle}>Embaralhar</button>
          <button className="btn-outline" onClick={()=>{ setSolved(false); setMoves(0); setSeconds(0); setRunning(false) }}>Zerar</button>
        </div>
      </div>

      {/* Status */}
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div className="card"><div className="text-sm text-gray-500">Tempo</div><div className="text-2xl font-bold">{formatTime(seconds)}</div></div>
        <div className="card"><div className="text-sm text-gray-500">Movimentos</div><div className="text-2xl font-bold">{moves}</div></div>
        <div className="card"><div className="text-sm text-gray-500">Grid</div><div className="text-2xl font-bold">{grid}×{grid}</div></div>
        <div className={`card ${solved ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : ''}`}>
          <div className="text-sm text-gray-500">Estado</div>
          <div className="text-2xl font-bold">{solved ? '✅ Concluído!' : 'Em andamento'}</div>
        </div>
      </div>

      {/* Tabuleiro */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className={`${gridStyle}`}>
            {order.map((id, idx) => {
              const piece = tiles[id]
              return (
                <button
                  key={idx}
                  draggable
                  onDragStart={(e)=>onDragStart(e, idx)}
                  onDragOver={onDragOver}
                  onDrop={(e)=>onDrop(e, idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 active:scale-[0.98] transition border ${outline ? 'border-white dark:border-gray-700' : 'border-transparent'}`}
                  aria-label={`Peça ${id+1}`}
                >
                  {piece && (
                    <img
                      src={piece.img}
                      alt=""
                      className="w-full h-full object-cover select-none pointer-events-none"
                      draggable={false}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Preview da imagem */}
        <div className="card">
          <div className="text-sm text-gray-500 mb-2">Pré-visualização</div>
          <div className="rounded-xl overflow-hidden border">
            {/* se a URL for dataURL, mostra normalmente */}
            <img src={imageUrl} onError={(e)=>{(e.currentTarget as HTMLImageElement).src = generateFallback()}} alt="preview" className="w-full h-auto" />
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Essa é a imagem completa como referência.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Puzzle
