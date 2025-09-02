import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login: React.FC = () => {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  async function onSubmit(e: React.FormEvent){ e.preventDefault(); setErr(null); const ok = await login(email,password); if(!ok) setErr('E-mail ou senha inválidos'); else nav('/') }
  return (
    <div className="max-w-md mx-auto mt-12 card">
      <h1 className="text-2xl font-bold mb-2 text-primary">Entrar</h1>
      <p className="text-sm mb-4 text-gray-500">Acesse com seu e-mail de terapeuta/administrador.</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="label">E-mail</label>
        <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label className="label">Senha</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {err && <div className="text-red-500 text-sm">{err}</div>}
        <button className="btn w-full mt-2">Entrar</button>
      </form>
      <div className="mt-4 text-sm">Não tem conta? <Link className="link" to="/register">Criar conta</Link></div>
    </div>
  )
}
export default Login
