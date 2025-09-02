import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { ThemeProvider } from './context/ThemeContext'
import { LangProvider } from './context/LangContext'
import { AuthProvider } from './context/AuthContext'
import { SessionProvider } from './context/SessionContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SessionBar from './components/SessionBar'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'

import Activities from './pages/activities/Activities'
import AAC from './pages/activities/AAC'
import Emotions from './pages/activities/Emotions'
import Routines from './pages/activities/Routines'
import Colors from './pages/activities/Colors'
import Numbers from './pages/activities/Numbers'
import Letters from './pages/activities/Letters'
import Memory from './pages/activities/Memory'
import Puzzle from './pages/activities/Puzzle'

import AdminUsers from './pages/admin/Users'
import StudentInfo from './pages/StudentInfo'
import SessionDesk from './pages/SessionDesk'

const App: React.FC = () => (
  <ThemeProvider>
    <LangProvider>
      <AuthProvider>
        <SessionProvider>
          <div className="min-h-screen pt-16 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* ÁREA AUTENTICADA */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
                <Route path="/students/:id/info" element={<ProtectedRoute><StudentInfo /></ProtectedRoute>} />
                <Route path="/session" element={<ProtectedRoute><SessionDesk /></ProtectedRoute>} />

                {/* Atividades (todas protegidas) */}
                <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
                <Route path="/activities/aac" element={<ProtectedRoute><AAC /></ProtectedRoute>} />
                <Route path="/activities/emotions" element={<ProtectedRoute><Emotions /></ProtectedRoute>} />
                <Route path="/activities/routines" element={<ProtectedRoute><Routines /></ProtectedRoute>} />
                <Route path="/activities/colors" element={<ProtectedRoute><Colors /></ProtectedRoute>} />
                <Route path="/activities/numbers" element={<ProtectedRoute><Numbers /></ProtectedRoute>} />
                <Route path="/activities/letters" element={<ProtectedRoute><Letters /></ProtectedRoute>} />
                <Route path="/activities/memory" element={<ProtectedRoute><Memory /></ProtectedRoute>} />
                <Route path="/activities/puzzle" element={<ProtectedRoute><Puzzle /></ProtectedRoute>} />

                {/* Admin */}
                <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />

                {/* Autenticação */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <SessionBar />
            <Footer />
          </div>
        </SessionProvider>
      </AuthProvider>
    </LangProvider>
  </ThemeProvider>
)

export default App
