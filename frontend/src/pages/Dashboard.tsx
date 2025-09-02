import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSession } from '../context/SessionContext'

type SessionItem = {
  _id: string
  startAt: string
  endAt?: string
  durationSec?: number
  notes?: string
}

type ProgressItem = {
  _id: string
  activityKey: string
  score?: number
  attempts?: number
  updatedAt?: string
  createdAt?: string
}

function fmtHM(sec = 0) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.floor(sec % 60)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

function isToday(dateISO?: string) {
  if (!dateISO) return false
  const d = new Date(dateISO)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

const Dashboard: React.FC = () => {
  const { user, token } = useAuth()
  const { start, current } = useSession()
  const nav = useNavigate()
  const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  const [studentsTotal, setStudentsTotal] = useState<number>(0)
  const [sessions, setSessions] = useState<SessionItem[]>([])
  const [progress, setProgress] = useState<ProgressItem[]>([])

  const selectedStudent = useMemo(() => {
    const raw = localStorage.getItem('selectedStudent')
    return raw ? JSON.parse(raw) : null
  }, [typeof window !== 'undefined' && localStorage.getItem('selectedStudent')])

  // Carrega contagem total de Pacientes (do usuário/clinica)
  useEffect(() => {
    async function loadStudentsCount() {
      try {
        const res = await fetch(`${api}/api/Pacientes`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        setStudentsTotal(Array.isArray(data) ? data.length : 0)
      } catch {}
    }
    if (token) loadStudentsCount()
  }, [token])

  // Carrega sessões e progresso do Paciente selecionado
  useEffect(() => {
    async function loadSelected() {
      if (!selectedStudent) {
        setSessions([])
        setProgress([])
        return
      }
      try {
        const [sRes, pRes] = await Promise.all([
          fetch(`${api}/api/sessoes/by-student/${selectedStudent._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${api}/api/atividades/by-student/${selectedStudent._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        if (sRes.ok) setSessions(await sRes.json())
        if (pRes.ok) setProgress(await pRes.json())
      } catch {}
    }
    if (token) loadSelected()
  }, [token, selectedStudent?._id])

  const todayActivitiesCount = useMemo(
    () => progress.filter((p) => isToday(p.updatedAt || p.createdAt)).length,
    [progress]
  )

  const lastSessions = useMemo(() => sessions.slice(0, 5), [sessions])

  async function handleStart() {
    if (!selectedStudent) {
      nav('/students')
      return
    }
    const sess = await start(selectedStudent._id)
    if (sess) {
      // você pode escolher ir pra /session (anotações) ou /activities (jogos)
      nav('/activities')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
      {/* Cabeçalho / Saudação */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-primary">
            Olá, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Selecione um Paciente e inicie um atendimento. Você pode abrir atividades enquanto o cronômetro roda
            e registrar observações ao finalizar.
          </p>
        </div>
        <div className="flex gap-2">
          <Link className="btn-outline" to="/students">Ver Pacientes</Link>
          <button className="btn" onClick={handleStart}>
            {current ? 'Sessão em andamento' : (selectedStudent ? 'Iniciar atendimento' : 'Selecionar Paciente')}
          </button>
        </div>
      </section>

      {/* Cartões de Estatísticas */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-sm text-gray-500">Total de Pacientes</div>
          <div className="text-3xl font-bold mt-1">{studentsTotal}</div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-500">Paciente selecionado</div>
          <div className="mt-1 flex items-center gap-3">
            <div className="text-3xl">{selectedStudent ? (selectedStudent.avatar === 'girl' ? '👧' : '👦') : '—'}</div>
            <div>
              <div className="font-semibold">{selectedStudent?.name ?? 'Nenhum Paciente'}</div>
              {selectedStudent && <div className="text-xs text-gray-500">{selectedStudent.age} anos</div>}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="text-sm text-gray-500">Atendimentos recentes (Paciente)</div>
          <div className="text-3xl font-bold mt-1">{sessions.length}</div>
          {selectedStudent && (
            <Link className="link text-sm mt-1 inline-block" to={`/students/${selectedStudent._id}/info`}>
              Ver histórico
            </Link>
          )}
        </div>

        <div className="card">
          <div className="text-sm text-gray-500">Atividades feitas hoje (Paciente)</div>
          <div className="text-3xl font-bold mt-1">{todayActivitiesCount}</div>
          <div className="text-xs text-gray-500 mt-1">Contabiliza registros de progresso datados de hoje.</div>
        </div>
      </section>

      {/* Ações rápidas */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <div className="font-semibold mb-2">Ações rápidas</div>
          <div className="flex flex-wrap gap-2">
            <Link className="btn" to="/students">+ Novo Paciente</Link>
            {selectedStudent ? (
              <>
                <button className="btn" onClick={handleStart}>
                  {current ? 'Retomar atendimento' : 'Iniciar atendimento'}
                </button>
                <Link className="btn-outline" to="/activities">Abrir atividades</Link>
                <Link className="btn-outline" to={`/students/${selectedStudent._id}/info`}>Info do Paciente</Link>
              </>
            ) : (
              <span className="text-sm text-gray-500">Selecione um Paciente para habilitar mais ações.</span>
            )}
          </div>
        </div>

        {/* Bloco de “Dica / Onboarding” */}
        <div className="card">
          <div className="font-semibold mb-2">Dica rápida</div>
          <ul className="text-sm list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
            <li>Vá em <b>Pacientes</b>, crie/seleciona um Paciente.</li>
            <li>Clique em <b>Iniciar atendimento</b> — o cronômetro aparece embaixo.</li>
            <li>Abra <b>Atividades</b> e faça os jogos com o Paciente.</li>
            <li>Ao encerrar, escreva as <b>anotações</b> no painel que aparece.</li>
            <li>Veja o histórico em <b>Info</b> dentro de Pacientes.</li>
          </ul>
        </div>

        {/* Estado da Sessão atual */}
        <div className="card">
          <div className="font-semibold mb-2">Sessão atual</div>
          {current ? (
            <div className="text-sm">
              <div>Paciente: <b>{selectedStudent?.name ?? 'Selecionado anteriormente'}</b></div>
              <div>Início: {new Date(current.startAt).toLocaleString('pt-BR')}</div>
              <div className="text-gray-500 mt-1">Gerencie pela barra de sessão (rodapé).</div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Nenhuma sessão em andamento.</div>
          )}
        </div>
      </section>

      {/* Últimos atendimentos (do Paciente selecionado) */}
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Últimos atendimentos do Paciente</h2>
          {selectedStudent && (
            <Link className="link" to={`/students/${selectedStudent._id}/info`}>Ver todos</Link>
          )}
        </div>

        {selectedStudent ? (
          lastSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-800">
                    <th className="py-2">Data</th>
                    <th className="py-2">Início</th>
                    <th className="py-2">Fim</th>
                    <th className="py-2">Duração</th>
                    <th className="py-2">Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {lastSessions.map((s) => {
                    const d = new Date(s.startAt)
                    const end = s.endAt ? new Date(s.endAt) : null
                    return (
                      <tr key={s._id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2">{d.toLocaleDateString('pt-BR')}</td>
                        <td className="py-2">{d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="py-2">{end ? end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                        <td className="py-2">{fmtHM(s.durationSec || 0)}</td>
                        <td className="py-2 max-w-[320px]">
                          <span className="line-clamp-2 text-gray-600 dark:text-gray-300">{s.notes || '—'}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Sem atendimentos para este Paciente ainda.</div>
          )
        ) : (
          <div className="text-gray-500 text-sm">Selecione um Paciente para ver os atendimentos recentes.</div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
