import { useAuth } from '../../context/AuthContext'
export function useProgress(activityKey: string){
  const { token } = useAuth()
  const api = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  async function save(details:any, score:number, attempts:number){
    const s = localStorage.getItem('selectedStudent'); if(!s) return
    const student = JSON.parse(s)
    await fetch(`${api}/api/atividades/save`, { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify({ studentId: student._id, activityKey, details, score, attempts }) })
  }
  return { save }
}
