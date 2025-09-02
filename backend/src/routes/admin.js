const router = require('express').Router()
const auth = require('../middleware/auth')
const ensureAdmin = require('../middleware/ensureAdmin')
const User = require('../models/User')

// Todas as rotas aqui exigem admin
router.use(auth, ensureAdmin)

// Listar usuários
router.get('/users', async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select('_id name email role createdAt')
  res.json(users)
})

// Alterar papel do usuário
router.put('/users/:id/role', async (req, res) => {
  const { role } = req.body
  if (!['therapist', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Papel inválido' })
  }
  const upd = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('_id name email role')
  if (!upd) return res.status(404).json({ message: 'Usuário não encontrado' })
  res.json(upd)
})

module.exports = router
