import React, { createContext, useContext, useEffect, useState } from 'react'
type User = { id: string; name: string; email: string; role?: string } | null
type Ctx = { user: User; token: string | null; login: (e:string,p:string)=>Promise<boolean>; register:(n:string,e:string,p:string)=>Promise<boolean>; logout:()=>void }
const AuthContext = createContext<Ctx>(null!)
export const AuthProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  useEffect(()=>{ const u = localStorage.getItem('user'); if(u) setUser(JSON.parse(u)) },[])
  async function login(email:string, password:string){
    const res = await fetch(`${api}/api/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
    if(!res.ok) return false; const data = await res.json()
    setToken(data.token); localStorage.setItem('token', data.token); setUser(data.user); localStorage.setItem('user', JSON.stringify(data.user)); return true
  }
  async function register(name:string, email:string, password:string){
    const res = await fetch(`${api}/api/auth/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, email, password }) })
    return res.ok
  }
  function logout(){ setToken(null); setUser(null); localStorage.removeItem('token'); localStorage.removeItem('user') }
  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>
}
export function useAuth(){ return useContext(AuthContext) }
