import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

type U = { _id: string; name: string; email: string; role: 'admin' | 'therapist' }

const AdminUsers: React.FC = () => {
  const { token } = useAuth()
  const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const [users, setUsers] = useState<U[]>([])
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'therapist' as 'admin' | 'therapist' })
  const [msg, setMsg] = useState<string | null>(null)

  async function load() {
    const res = await fetch(`${api}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return
    const data = await res.json()
    setUsers(data)
  }
  useEffect(() => { load() }, [])

  async function setRole(id: string, role: 'admin' | 'therapist') {
    const res = await fetch(`${api}/api/admin/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role })
    })
    if (res.ok) { setMsg('Papel atualizado'); load() }
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    const path = createForm.role === 'admin' ? 'register-admin' : 'register-therapist'
    const res = await fetch(`${api}/api/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: createForm.name, email: createForm.email, password: createForm.password })
    })
    if (res.ok) { setMsg('Usuário criado'); setCreateForm({ name: '', email: '', password: '', role: 'therapist' }); load() }
    else setMsg('Erro ao criar usuário')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-primary">Admin • Usuários</h1>

      <div className="card mb-6">
        <h2 className="font-semibold mb-3">Criar novo usuário</h2>
        <form className="grid md:grid-cols-5 gap-3" onSubmit={createUser}>
          <input className="input" placeholder="Nome" value={createForm.name} onChange={e=>setCreateForm(f=>({...f, name: e.target.value}))} required />
          <input className="input" type="email" placeholder="E-mail" value={createForm.email} onChange={e=>setCreateForm(f=>({...f, email: e.target.value}))} required />
          <input className="input" type="password" placeholder="Senha" value={createForm.password} onChange={e=>setCreateForm(f=>({...f, password: e.target.value}))} required />
          <select className="input" value={createForm.role} onChange={e=>setCreateForm(f=>({...f, role: e.target.value as any}))}>
            <option value="therapist">Therapist</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn">Criar</button>
        </form>
        {msg && <div className="text-sm mt-2 text-green-700">{msg}</div>}
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">Lista de usuários</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-800">
                <th className="py-2">Nome</th>
                <th className="py-2">E-mail</th>
                <th className="py-2">Papel</th>
                <th className="py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{u.role}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button className="btn-outline" onClick={()=>setRole(u._id, 'therapist')}>Tornar therapist</button>
                      <button className="btn" onClick={()=>setRole(u._id, 'admin')}>Tornar admin</button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-gray-500">Nenhum usuário</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default AdminUsers
