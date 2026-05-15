import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Completed'],
      default: 'To Do'
    },
    dueDate: {
      type: Date,
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    markedOverdue: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

taskSchema.virtual('isOverdue').get(function isOverdue() {
  return this.status !== 'Completed' && this.dueDate < new Date();
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedUser: 1, dueDate: 1 });

export const Task = mongoose.model('Task', taskSchema);
