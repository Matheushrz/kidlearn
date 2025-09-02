const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')
const ensureAdmin = require('../middleware/ensureAdmin')

// Registrar a si mesmo (sempre como therapist)
// Só admin poderá criar outros admins via painel
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ message: 'Campos obrigatórios' })
  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'Email já registrado' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash, role: 'therapist' })
  return res.status(201).json({ id: user._id })
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message: 'Credenciais inválidas' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(400).json({ message: 'Credenciais inválidas' })
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
  return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
})

// Admin cria TERAPEUTA
router.post('/register-therapist', auth, ensureAdmin, async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ message: 'Campos obrigatórios' })
  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'Email já registrado' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash, role: 'therapist' })
  return res.status(201).json({ id: user._id })
})

// Admin cria ADMIN
router.post('/register-admin', auth, ensureAdmin, async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ message: 'Campos obrigatórios' })
  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'Email já registrado' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash, role: 'admin' })
  return res.status(201).json({ id: user._id })
})

module.exports = router
