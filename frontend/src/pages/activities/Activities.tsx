import React from 'react'
import { Link } from 'react-router-dom'
const items = [
  { key:'aac', label:'AAC (Comunicação)', path:'/activities/aac' },
  { key:'emotions', label:'Emoções', path:'/activities/emotions' },
  { key:'routines', label:'Rotinas Visuais', path:'/activities/routines' },
  { key:'colors', label:'Cores', path:'/activities/colors' },
  { key:'numbers', label:'Números', path:'/activities/numbers' },
  { key:'letters', label:'Letras', path:'/activities/letters' },
  { key:'memory', label:'Memória', path:'/activities/memory' },
  { key:'puzzle', label:'Quebra-cabeça', path:'/activities/puzzle' }
]
const Activities: React.FC = () => (
  <div className="max-w-6xl mx-auto px-4 mt-8">
    <h1 className="text-2xl font-bold mb-4 text-primary">Atividades</h1>
    <div className="grid md:grid-cols-4 gap-4">
      {items.map(i => <Link to={i.path} key={i.key} className="card text-center hover:shadow-md"><div className="text-lg font-semibold">{i.label}</div></Link>)}
    </div>
  </div>
)
export default Activities
