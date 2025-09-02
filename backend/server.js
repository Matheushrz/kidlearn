const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv')
const connectDB = require('./src/config/db')
const authRoutes = require('./src/routes/auth')
const studentRoutes = require('./src/routes/students')
const activityRoutes = require('./src/routes/activities')
const adminRoutes = require('./src/routes/admin')
const sessionRoutes = require('./src/routes/sessions')

dotenv.config()
const app = express()

app.use(helmet())
app.use(express.json())
app.use(cors({
  origin: (process.env.CORS_ORIGIN || '').split(',').filter(Boolean) || ['http://localhost:5173'],
  credentials: true
}))

connectDB()

app.use('/api/auth', authRoutes)
app.use('/api/Pacientes', studentRoutes)
app.use('/api/atividades', activityRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/sessoes', sessionRoutes)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`✅ Backend na porta ${PORT}`))
