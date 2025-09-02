import React, { useEffect, useState } from 'react'
import { useProgress } from './useProgress'
const CARDS = ['🐶','🐱','🦊','🐼','🐵','🐷']
type Card = { id:number; value:string; flipped:boolean; matched:boolean }
function makeDeck(): Card[]{ const d=[...CARDS,...CARDS].map((v,i)=>({id:i,value:v,flipped:false,matched:false})); return d.sort(()=>Math.random()-0.5) }
const Memory: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>(makeDeck())
  const [first, setFirst] = useState<Card | null>(null)
  const [lock, setLock] = useState(false)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const { save } = useProgress('memory')
  useEffect(()=>{ if(deck.every(c=>c.matched)) save({ done:true }, score, attempts) }, [deck])
  function flip(card: Card){
    if(lock || card.flipped || card.matched) return
    setDeck(d=>d.map(c=>c.id===card.id?{...c,flipped:true}:c))
    if(!first){ setFirst({...card, flipped:true}); return }
    setAttempts(a=>a+1); setLock(true)
    if(first.value===card.value){ setDeck(d=>d.map(c=>c.value===card.value?{...c,matched:true}:c)); setScore(s=>s+1); setFirst(null); setLock(false); save({match:card.value}, score+1, attempts+1) }
    else { setTimeout(()=>{ setDeck(d=>d.map(c=>(c.id===first.id||c.id===card.id)?{...c,flipped:false}:c)); setFirst(null); setLock(false); save({mismatch:[first.value, card.value]}, score, attempts+1) }, 600) }
  }
  return (
    <div className="max-w-md mx-auto px-4 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-primary">Memória</h1>
      <div className="grid grid-cols-4 gap-2">{deck.map(c => <button key={c.id} onClick={()=>flip(c)} className={`h-16 rounded card flex items-center justify-center text-2xl ${c.flipped||c.matched?'':'bg-primary text-white'}`}>{c.flipped||c.matched?c.value:'❓'}</button>)}</div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Pares: {score} • Tentativas: {attempts}</div>
      <div className="mt-3"><button className="btn" onClick={()=>{ setDeck(makeDeck()); setScore(0); setAttempts(0); setFirst(null) }}>Reiniciar</button></div>
    </div>
  )
}
export default Memory
