import React, { useEffect, useState } from 'react'
import StudentCard from '../components/StudentCard'
import { useAuth } from '../context/AuthContext'
import { useSession } from '../context/SessionContext'
import { Link, useNavigate } from 'react-router-dom'

const Students: React.FC = () => {
  const { token } = useAuth()
  const { start } = useSession()
  const nav = useNavigate()
  const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const [list, setList] = useState<any[]>([])
  const [name, setName] = useState('')
  const [age, setAge] = useState<number>(5 as any)
  const [avatar, setAvatar] = useState<'boy'|'girl'>('boy')

  async function load(){
    const res = await fetch(`${api}/api/Pacientes`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json(); setList(data)
  }
  useEffect(()=>{ load() }, [])

  async function add(){
    const res = await fetch(`${api}/api/Pacientes`, { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({ name, age: Number(age), avatar }) })
    if (res.ok){ setName(''); setAge(5 as any); setAvatar('boy'); load() }
  }

  async function handleStart(s: any){
    localStorage.setItem('selectedStudent', JSON.stringify(s))
    const sess = await start(s._id)
    if (sess) nav('/activities') // redireciona para atividades
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-primary">Pacientes</h1>
      <div className="card mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div><label className="label">Nome</label><input className="input" value={name} onChange={e=>setName(e.target.value)} /></div>
          <div><label className="label">Idade</label><input className="input" type="number" value={age} onChange={e=>setAge(parseInt(e.target.value))} /></div>
          <div><label className="label">Avatar</label>
            <select className="input" value={avatar} onChange={e=>setAvatar(e.target.value as any)}>
              <option value="boy">Menino</option>
              <option value="girl">Menina</option>
            </select>
          </div>
          <div className="flex items-end"><button className="btn w-full" onClick={add}>Adicionar Paciente</button></div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(s =>
          <div key={s._id} className="card space-y-3">
            <StudentCard name={s.name} age={s.age} avatar={s.avatar} onSelect={()=>localStorage.setItem('selectedStudent', JSON.stringify(s))} />
            <div className="flex gap-2">
              <button className="btn" onClick={()=>handleStart(s)}>Iniciar atendimento</button>
              <Link className="btn-outline" to={`/students/${s._id}/info`}>Info</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Students
