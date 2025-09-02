import React, { createContext, useContext, useEffect, useState } from 'react'

type Lang = 'pt' | 'en'

interface LangCtx {
  lang: Lang
  toggleLang: () => void
}

const LangContext = createContext<LangCtx | undefined>(undefined)

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('pt')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    if (stored) setLang(stored)
  }, [])

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  function toggleLang() {
    setLang((l) => (l === 'pt' ? 'en' : 'pt'))
  }

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang deve ser usado dentro de LangProvider')
  return ctx
}
