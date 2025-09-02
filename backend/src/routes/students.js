const router = require('express').Router()
const auth = require('../middleware/auth')
const Student = require('../models/Student')

router.use(auth)

// Admin enxerga todos; therapist enxerga só os seus
router.get('/', async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { owner: req.user.id }
  const list = await Student.find(filter).sort({ createdAt: -1 })
  res.json(list)
})

router.post('/', async (req, res) => {
  const { name, age, avatar } = req.body
  if (!name || !age) return res.status(400).json({ message: 'Nome e idade obrigatórios' })
  const created = await Student.create({ name, age, avatar: avatar || 'boy', owner: req.user.id })
  res.status(201).json(created)
})

router.put('/:id', async (req, res) => {
  const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, owner: req.user.id }
  const upd = await Student.findOneAndUpdate(filter, req.body, { new: true })
  if (!upd) return res.status(404).json({ message: 'Paciente não encontrado' })
  res.json(upd)
})

router.delete('/:id', async (req, res) => {
  const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, owner: req.user.id }
  const del = await Student.findOneAndDelete(filter)
  if (!del) return res.status(404).json({ message: 'Paciente não encontrado' })
  res.json({ ok: true })
})

module.exports = router
