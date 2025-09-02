const { Schema, model, Types } = require('mongoose');
const ActivityProgressSchema = new Schema({
  student: { type: Types.ObjectId, ref: 'Student', required: true },
  activityKey: { type: String, required: true },
  details: { type: Schema.Types.Mixed, default: {} },
  score: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  owner: { type: Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
ActivityProgressSchema.index({ owner:1, student:1, activityKey:1 }, { unique: true });
module.exports = model('ActivityProgress', ActivityProgressSchema);
