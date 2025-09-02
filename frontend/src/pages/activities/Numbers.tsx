import React, { useMemo, useState } from 'react'
import { useProgress } from './useProgress'
const ICON = '⭐'
const Numbers: React.FC = () => {
  const { save } = useProgress('numbers')
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const target = useMemo(()=>Math.floor(Math.random()*5)+1, [score, attempts])
  const options = [1,2,3,4,5]
  function pick(n:number){ setAttempts(a=>a+1); if(n===target) setScore(s=>s+1); save({ target }, score, attempts+1) }
  return (
    <div className="max-w-xl mx-auto px-4 mt-8 text-center">
      <h1 className="text-2xl font-bold mb-4 text-primary">Números</h1>
      <div className="text-4xl mb-2">Clique na quantidade correta:</div>
      <div className="text-5xl mb-4">{Array.from({length:target},()=>ICON).join(' ')}</div>
      <div className="grid grid-cols-5 gap-2">{options.map(n => <button key={n} className="btn" onClick={()=>pick(n)}>{n}</button>)}</div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Pontuação: {score} • Tentativas: {attempts}</div>
    </div>
  )
}
export default Numbers
