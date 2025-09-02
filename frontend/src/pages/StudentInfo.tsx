import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type Sess = {
  _id: string
  startAt: string
  endAt?: string
  durationSec?: number
  notes?: string
}

function fmtDate(d: string){
  const dt = new Date(d)
  const dia = dt.toLocaleDateString('pt-BR')
  const hora = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return { dia, hora }
}

export default function StudentInfo(){
  const { id } = useParams()
  const { token } = useAuth()
  const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const [list, setList] = useState<Sess[]>([])
  const [selected, setSelected] = useState<Sess | null>(null)

  useEffect(() => {
    async function load(){
      const res = await fetch(`${api}/api/sessoes/by-student/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) return
      const data = await res.json()
      setList(data)
    }
    load()
  }, [id])

  return (
    <div className="max-w-5xl mx-auto px-4 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-primary">Informações do Paciente</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-3">Atendimentos</h2>
          <ul className="space-y-2">
            {list.map(s => {
              const { dia, hora } = fmtDate(s.startAt)
              return (
                <li key={s._id} className="flex items-center justify-between">
                  <button className="link" onClick={()=>setSelected(s)}>{dia} — {hora}</button>
                  <span className="text-sm text-gray-500">
                    {s.durationSec ? Math.floor(s.durationSec/60)+'min' : 'em andamento/encerrado sem duração'}
                  </span>
                </li>
              )
            })}
            {list.length === 0 && <li className="text-gray-500">Sem atendimentos</li>}
          </ul>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-3">Detalhes</h2>
          {!selected && <div className="text-gray-500">Clique em uma data na lista para ver os detalhes.</div>}
          {selected && (
            <div className="space-y-2">
              <div><b>Início:</b> {new Date(selected.startAt).toLocaleString('pt-BR')}</div>
              {selected.endAt && <div><b>Fim:</b> {new Date(selected.endAt).toLocaleString('pt-BR')}</div>}
              {typeof selected.durationSec === 'number' &&
                <div><b>Duração:</b> {Math.floor(selected.durationSec/60)} min {selected.durationSec%60}s</div>}
              <div className="mt-3">
                <b>Anotações:</b>
                <div className="whitespace-pre-wrap mt-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  {selected.notes || '—'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
