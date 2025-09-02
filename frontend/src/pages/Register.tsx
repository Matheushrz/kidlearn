import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register: React.FC = () => {
  const { register } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  async function onSubmit(e: React.FormEvent){ e.preventDefault(); setMsg(null); setErr(null); const ok = await register(name,email,password); if(ok){ setMsg('Conta criada! Faça login.'); setTimeout(()=>nav('/login'), 800) } else setErr('Erro ao cadastrar. Verifique o back-end (Mongo).') }
  return (
    <div className="max-w-md mx-auto mt-12 card">
      <h1 className="text-2xl font-bold mb-2 text-primary">Criar conta</h1>
      <p className="text-sm mb-4 text-gray-500">Crie acesso de terapeuta/administrador.</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="label">Nome</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
        <label className="label">E-mail</label>
        <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label className="label">Senha</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {msg && <div className="text-green-600 text-sm">{msg}</div>}
        {err && <div className="text-red-500 text-sm">{err}</div>}
        <button className="btn w-full mt-2">Criar conta</button>
      </form>
      <div className="mt-4 text-sm">Já possui conta? <Link className="link" to="/login">Entrar</Link></div>
    </div>
  )
}
export default Register
