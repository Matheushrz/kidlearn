const { Schema, model, Types } = require('mongoose');
const StudentSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  avatar: { type: String, enum: ['boy','girl'], default: 'boy' },
  owner: { type: Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
module.exports = model('Student', StudentSchema);
