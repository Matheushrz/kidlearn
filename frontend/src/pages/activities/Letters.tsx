import React, { useState } from 'react'
import { useProgress } from './useProgress'
import { LETTERS } from './letters.data'
const Letters: React.FC = () => {
  const { save } = useProgress('letters')
  const [current, setCurrent] = useState<keyof typeof LETTERS>('A')
  const dt = LETTERS[current]; const word = dt[0]; const emoji = dt[1]
  function speak(text:string){ const u = new SpeechSynthesisUtterance(text); u.lang = 'pt-BR'; speechSynthesis.speak(u) }
  return (
    <div className="max-w-2xl mx-auto px-4 mt-8 text-center">
      <h1 className="text-2xl font-bold mb-4 text-primary">Letras</h1>
      <div className="text-6xl font-bold mb-2">{current}</div>
      <div className="text-6xl mb-2">{emoji}</div>
      <div className="text-xl mb-4">{word}</div>
      <div className="grid grid-cols-8 gap-2 mb-4">{Object.keys(LETTERS).map(k => <button className="btn" key={k} onClick={()=>setCurrent(k as any)}>{k}</button>)}</div>
      <div className="flex gap-2 justify-center">
        <button className="btn" onClick={()=>{ speak(current); speak(word); save({ letter: current }, 0, 1) }}>🔊 Ouvir</button>
      </div>
    </div>
  )
}
export default Letters
