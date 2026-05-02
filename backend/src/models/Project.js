import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [memberSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
