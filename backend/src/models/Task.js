import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'review', 'done'],
      default: 'todo',
    },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date },
    order: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

taskSchema.index({ project: 1, status: 1, order: 1 });

export default mongoose.model('Task', taskSchema);
