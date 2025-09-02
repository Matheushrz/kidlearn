import React from 'react'
import { motion } from 'framer-motion'
type Props = { name: string; age: number; avatar: 'boy'|'girl'; onSelect?: ()=>void }
const StudentCard: React.FC<Props> = ({ name, age, avatar, onSelect }) => (
  <motion.div className="card flex items-center gap-4 cursor-pointer hover:shadow" whileHover={{ scale: 1.02 }} onClick={onSelect}>
    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-2xl">{avatar==='boy'?'👦':'👧'}</div>
    <div><div className="font-semibold">{name}</div><div className="text-sm text-gray-500 dark:text-gray-400">{age} anos</div></div>
  </motion.div>
)
export default StudentCard
