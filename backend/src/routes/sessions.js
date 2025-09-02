const router   = require('express').Router()
const auth     = require('../middleware/auth')
const Session  = require('../models/Session')

router.use(auth)

// Iniciar atendimento (cria sessão em andamento)
router.post('/start', async (req, res) => {
  const { studentId } = req.body
  if (!studentId) return res.status(400).json({ message: 'studentId é obrigatório' })
  // fecha uma sessão antiga aberta do mesmo owner/Paciente (edge-case)
  await Session.updateMany({ owner: req.user.id, student: studentId, endAt: null }, { $set: { endAt: new Date() } })
  const s = await Session.create({ student: studentId, owner: req.user.id, startAt: new Date() })
  res.status(201).json(s)
})

// Salvar/atualizar anotações durante o atendimento
router.put('/:id/notes', async (req, res) => {
  const { notes } = req.body
  const upd = await Session.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    { $set: { notes: notes || '' } },
    { new: true }
  )
  if (!upd) return res.status(404).json({ message: 'Sessão não encontrada' })
  res.json(upd)
})

// Encerrar atendimento (calcula duração)
router.post('/:id/stop', async (req, res) => {
  const s = await Session.findOne({ _id: req.params.id, owner: req.user.id })
  if (!s) return res.status(404).json({ message: 'Sessão não encontrada' })
  if (s.endAt) return res.status(400).json({ message: 'Sessão já encerrada' })
  s.endAt = new Date()
  s.durationSec = Math.max(0, Math.floor((s.endAt - s.startAt) / 1000))
  await s.save()
  res.json(s)
})

// Histórico por Paciente (apenas do owner; admin enxerga todos)
router.get('/by-student/:studentId', async (req, res) => {
  const filter = req.user.role === 'admin'
    ? { student: req.params.studentId }
    : { student: req.params.studentId, owner: req.user.id }
  const list = await Session.find(filter).sort({ startAt: -1 })
  res.json(list)
})

// Obter uma sessão específica
router.get('/:id', async (req, res) => {
  const s = await Session.findOne(
    req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, owner: req.user.id }
  )
  if (!s) return res.status(404).json({ message: 'Sessão não encontrada' })
  res.json(s)
})

module.exports = router
