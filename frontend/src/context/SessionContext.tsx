import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'

type SessionData = { id: string; studentId: string; startAt: string } | null
type Ctx = {
  current: SessionData
  start: (studentId: string) => Promise<SessionData | null>
  stop: () => Promise<void>
  setNotes: (notes: string) => Promise<void>
  notes: string
  elapsedSec: number
}

const SessionContext = createContext<Ctx>(null!)

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth()
  const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const [current, setCurrent] = useState<SessionData>(() => {
    const raw = localStorage.getItem('currentSession'); return raw ? JSON.parse(raw) : null
  })
  const [notes, setNotesState] = useState<string>(() => localStorage.getItem('currentSessionNotes') || '')
  const [elapsedSec, setElapsedSec] = useState<number>(0)
  const timerRef = useRef<number | null>(null)

  // Atualiza cronômetro
  useEffect(() => {
    if (!current) { if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null } ; setElapsedSec(0); return }
    function tick() {
      const start = new Date(current.startAt).getTime()
      setElapsedSec(Math.max(0, Math.floor((Date.now() - start) / 1000)))
    }
    tick()
    timerRef.current = window.setInterval(tick, 1000)
    return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [current])

  async function start(studentId: string) {
    const res = await fetch(`${api}/api/sessoes/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ studentId })
    })
    if (!res.ok) return null
    const data = await res.json()
    const sess: SessionData = { id: data._id, studentId, startAt: data.startAt }
    setCurrent(sess); localStorage.setItem('currentSession', JSON.stringify(sess))
    setNotesState(''); localStorage.setItem('currentSessionNotes', '')
    return sess
  }

  async function stop() {
    if (!current) return
    await fetch(`${api}/api/sessoes/${current.id}/stop`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    setCurrent(null); localStorage.removeItem('currentSession')
    setNotesState(''); localStorage.removeItem('currentSessionNotes')
  }

  async function setNotes(notesText: string){
    setNotesState(notesText); localStorage.setItem('currentSessionNotes', notesText)
    if (!current) return
    await fetch(`${api}/api/sessoes/${current.id}/notes`, {
      method: 'PUT',
      headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ notes: notesText })
    })
  }

  return (
    <SessionContext.Provider value={{ current, start, stop, setNotes, notes, elapsedSec }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(){ return useContext(SessionContext) }
