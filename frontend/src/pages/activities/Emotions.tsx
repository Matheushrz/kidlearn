import React, { useState } from 'react'
import { useProgress } from './useProgress'
const EMOJIS = [ {e:'😊', label:'Feliz'}, {e:'😢', label:'Triste'}, {e:'😡', label:'Bravo'}, {e:'😮', label:'Surpreso'}, {e:'😐', label:'Neutro'} ]
const Emotions: React.FC = () => {
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [msg, setMsg] = useState('')
  const { save } = useProgress('emotions')
  function ask(label: string){
    setAttempts(a=>a+1)
    const correct = EMOJIS[idx].label
    if (label === correct){ setScore(s=>s+1); setMsg('Acertou!'); setTimeout(()=>{ setIdx((idx+1)%EMOJIS.length); setMsg('') }, 600) }
    else setMsg('Tente novamente')
    save({ current: correct }, score, attempts+1)
  }
  const options = EMOJIS.map(x => x.label)
  return (
    <div className="max-w-xl mx-auto px-4 mt-8 text-center">
      <h1 className="text-2xl font-bold mb-4 text-primary">Emoções</h1>
      <div className="text-7xl mb-4">{EMOJIS[idx].e}</div>
      <div className="grid grid-cols-5 gap-2 mb-2">
        {options.map(l => <button key={l} className="btn" onClick={()=>ask(l)}>{l}</button>)}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">Pontuação: {score} • Tentativas: {attempts}</div>
      {msg && <div className="mt-2">{msg}</div>}
    </div>
  )
}
export default Emotions
