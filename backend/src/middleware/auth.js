const jwt = require('jsonwebtoken');
module.exports = function auth(req,res,next){
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Token ausente' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch(e){
    return res.status(401).json({ message: 'Token inválido' });
  }
}
