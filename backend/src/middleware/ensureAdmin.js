// Permite acessar rota apenas se o usuário logado for admin
module.exports = function ensureAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso restrito a administradores' })
  }
  next()
}
