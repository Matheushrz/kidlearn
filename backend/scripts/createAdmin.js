/**
 * Script rápido para criar um admin inicial.
 * Uso:
 *  node scripts/createAdmin.js "Nome Admin" "admin@admin.com" "SenhaForte123!"
 */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../src/models/User')

async function main() {
  const [ , , name, email, password ] = process.argv
  if (!name || !email || !password) {
    console.log('Uso: node scripts/createAdmin.js "Nome" "email" "senha"')
    process.exit(1)
  }
  if (!process.env.MONGO_URI) {
    console.error('Defina MONGO_URI no .env antes de rodar o script.')
    process.exit(1)
  }
  await mongoose.connect(process.env.MONGO_URI)
  const exists = await User.findOne({ email })
  if (exists) {
    console.log('Já existe usuário com este e-mail.')
    process.exit(0)
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash, role: 'admin' })
  console.log('✅ Admin criado:', { id: user._id, email: user.email })
  await mongoose.disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
