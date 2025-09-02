const mongoose = require('mongoose');
module.exports = async function connectDB(){
  const uri = process.env.MONGO_URI;
  if (!uri) { console.error('❌ Defina MONGO_URI'); process.exit(1); }
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB conectado');
  } catch (e) {
    console.error('❌ Erro MongoDB:', e.message);
    process.exit(1);
  }
}
