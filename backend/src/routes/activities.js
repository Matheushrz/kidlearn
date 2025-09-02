const router = require('express').Router()
const auth = require('../middleware/auth')
const ActivityProgress = require('../models/ActivityProgress')

router.use(auth)

// Salvar/Upsert
router.post('/save', async (req, res) => {
  const { studentId, activityKey, details, score, attempts } = req.body
  if (!studentId || !activityKey) return res.status(400).json({ message: 'Parâmetros obrigatórios' })
  const doc = await ActivityProgress.findOneAndUpdate(
    { owner: req.user.id, student: studentId, activityKey },
    { $set: { details: details || {}, score: score || 0, attempts: attempts || 0 } },
    { upsert: true, new: true }
  )
  res.json(doc)
})

// Buscar por Paciente (admin vê tudo; therapist só dele)
router.get('/by-student/:id', async (req, res) => {
  const filter = req.user.role === 'admin'
    ? { student: req.params.id }
    : { owner: req.user.id, student: req.params.id }
  const list = await ActivityProgress.find(filter)
  res.json(list)
})

module.exports = router
