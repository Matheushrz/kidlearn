import React, { useEffect, useState } from 'react'
import { useProgress } from './useProgress'
const DEFAULTS = [ { id:'brush', label:'Escovar os dentes' }, { id:'bath', label:'Tomar banho' }, { id:'study', label:'Estudar' }, { id:'play', label:'Brincar' } ]
const Routines: React.FC = () => {
  const { save } = useProgress('routines')
  const [items, setItems] = useState(DEFAULTS.map(x=>({ ...x, done:false })))
  useEffect(()=>{ save({ items }, items.filter(i=>i.done).length, items.length) }, [items])
  return (
    <div className="max-w-xl mx-auto px-4 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-primary">Rotinas Visuais</h1>
      <div className="card">{items.map((it,i)=>(
        <label key={it.id} className="flex items-center gap-3 py-2">
          <input type="checkbox" checked={it.done} onChange={()=>setItems(arr=>{const c=[...arr]; c[i]={...c[i],done:!c[i].done}; return c})} />
          <span className={it.done?'line-through':''}>{it.label}</span>
        </label>
      ))}</div>
    </div>
  )
}
export default Routines
