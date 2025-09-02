import React from 'react'
import { useSession } from '../context/SessionContext'
import { Link } from 'react-router-dom'

function format(sec: number){
  const h = Math.floor(sec/3600).toString().padStart(2,'0')
  const m = Math.floor((sec%3600)/60).toString().padStart(2,'0')
  const s = Math.floor(sec%60).toString().padStart(2,'0')
  return `${h}:${m}:${s}`
}

export default function SessionDesk(){
  const { current, elapsedSec, stop, notes, setNotes } = useSession()
  if (!current) return <div className="max-w-3xl mx-auto px-4 mt-8">Nenhuma sessão ativa.</div>
  return (
    <div className="max-w-3xl mx-auto px-4 mt-8 space-y-4">
      <h1 className="text-2xl font-bold text-primary">Atendimento em andamento</h1>
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="text-lg">⏱️ <b>{format(elapsedSec)}</b></div>
          <Link to="/activities" className="btn">Ir para atividades</Link>
          <button className="btn" onClick={stop}>Encerrar</button>
        </div>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Anotações do atendimento</h2>
        <textarea className="input h-40" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Digite observações clínicas, respostas do Paciente, estratégias..." />
        <div className="text-xs text-gray-500 mt-2">As anotações salvam automaticamente durante a sessão.</div>
      </div>
    </div>
  )
}
