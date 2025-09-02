const { Schema, model, Types } = require('mongoose')

const SessionSchema = new Schema({
  student: { type: Types.ObjectId, ref: 'Student', required: true },
  owner:   { type: Types.ObjectId, ref: 'User', required: true }, // quem atendeu
  startAt: { type: Date, required: true },
  endAt:   { type: Date },                    // definido ao encerrar
  notes:   { type: String, default: '' },     // anotações livres do atendimento
  durationSec: { type: Number, default: 0 },  // calculado ao encerrar
}, { timestamps: true })

module.exports = model('Session', SessionSchema)
