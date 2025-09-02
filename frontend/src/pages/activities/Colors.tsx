import React, { useMemo, useState } from 'react'
import { useProgress } from './useProgress'
const COLORS = [ { label:'Vermelho', v:'#ef4444' }, { label:'Azul', v:'#3b82f6' }, { label:'Verde', v:'#22c55e' }, { label:'Amarelo', v:'#eab308' } ]
function shuffle(a:any[]){ return [...a].sort(()=>Math.random()-0.5) }
const Colors: React.FC = () => {
  const { save } = useProgress('colors')
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const target = useMemo(()=>COLORS[Math.floor(Math.random()*COLORS.length)], [score, attempts])
  const options = useMemo(()=>shuffle(COLORS).map(c=>c.label), [target, score])
  function pick(name:string){ setAttempts(a=>a+1); const correct = target.label; if(name===correct) setScore(s=>s+1); save({ target:correct }, score, attempts+1) }
  return (
    <div className="max-w-xl mx-auto px-4 mt-8 text-center">
      <h1 className="text-2xl font-bold mb-4 text-primary">Cores</h1>
      <div className="w-40 h-40 mx-auto rounded-lg mb-4" style={{ background: target.v }} />
      <div className="grid grid-cols-4 gap-2">{options.map(n=><button key={n} className="btn" onClick={()=>pick(n)}>{n}</button>)}</div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Pontuação: {score} • Tentativas: {attempts}</div>
    </div>
  )
}
export default Colors
