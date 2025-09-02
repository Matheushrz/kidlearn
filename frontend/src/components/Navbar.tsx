import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { lang, toggleLang } = useLang()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const nav = useNavigate()

  const isActive = (path: string) =>
    location.pathname === path ? 'text-primary font-semibold' : 'text-gray-600 dark:text-gray-300 hover:text-primary'

  function handleLogout() {
    logout()
    nav('/login')
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-extrabold text-primary tracking-tight">
          ABA <span className="text-blue-500">LEARN</span>
        </Link>

        {/* Links Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={isActive('/')}>Dashboard</Link>
          <Link to="/students" className={isActive('/students')}>Pacientes</Link>
          <Link to="/activities" className={isActive('/activities')}>Atividades</Link>
          {user?.role === 'admin' && (
            <Link to="/admin/users" className={isActive('/admin/users')}>Admin</Link>
          )}
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-3">
          {/* idioma */}
          <button
            onClick={toggleLang}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Trocar idioma"
          >
            {lang === 'pt' ? '🇧🇷' : '🇺🇸'}
          </button>

          {/* tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Trocar tema"
          >
            {theme === 'light' ? '☀️' : '🌙'}
          </button>

          {/* avatar */}
          {user && (
            <div className="relative">
              <button
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold">
                  {user.name ? user.name[0].toUpperCase() : '?'}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{user.name?.split(' ')[0]}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 flex gap-6 overflow-x-auto text-sm">
        <Link to="/" className={isActive('/')}>Dashboard</Link>
        <Link to="/students" className={isActive('/students')}>Pacientes</Link>
        <Link to="/activities" className={isActive('/activities')}>Atividades</Link>
        {user?.role === 'admin' && (
          <Link to="/admin/users" className={isActive('/admin/users')}>Admin</Link>
        )}
      </div>
    </header>
  )
}

export default Navbar
