import React, { useState } from 'react'
import { useSession } from '../context/SessionContext'
import { Link } from 'react-router-dom'

function format(sec: number){
  const h = Math.floor(sec/3600).toString().padStart(2,'0')
  const m = Math.floor((sec%3600)/60).toString().padStart(2,'0')
  const s = Math.floor(sec%60).toString().padStart(2,'0')
  return `${h}:${m}:${s}`
}

const SessionBar: React.FC = () => {
  const { current, elapsedSec, stop, setNotes } = useSession()
  const [showNotes, setShowNotes] = useState(false)
  const [tempNotes, setTempNotes] = useState("")

  if (!current) return null

  async function handleStop() {
    // mostra modal para preencher notas
    setShowNotes(true)
  }

  async function handleSave() {
    await setNotes(tempNotes)
    await stop()
    setShowNotes(false)
  }

  return (
    <>
      {/* Barra flutuante */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-gray-900 border border-primary/30 text-primary rounded-xl shadow-soft px-4 py-2 flex items-center gap-3">
        <span>⏱️ {format(elapsedSec)}</span>
        <Link to="/activities" className="underline">Ir para atividades</Link>
        <button className="px-3 py-1 rounded-lg bg-primary text-white" onClick={handleStop}>
          Encerrar
        </button>
      </div>

      {/* Modal de anotações */}
      {showNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-primary mb-4 text-center">
              Digite aqui tudo que você observou no atendimento do Paciente hoje
            </h2>
            <textarea
              className="w-full h-40 p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Exemplo: O Paciente participou bem, reconheceu emoções, mostrou interesse em cores..."
              value={tempNotes}
              onChange={e=>setTempNotes(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-400"
                onClick={async()=>{ await stop(); setShowNotes(false) }}
              >
                Pular
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-primary text-white"
                onClick={handleSave}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SessionBar
