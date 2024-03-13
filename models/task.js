// task.js

const mongoose = require('mongoose');
const SubTask = require('./subtask.js')
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  priority: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'TODO',
  },
  subtasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubTask',
  }],
}, {
  timestamps: true,
});

// Middleware to update priority based on due date and status based on subtask completion
taskSchema.pre('save', async function (next) {
    const task = this;
  
    // Update priority based on due date
    if (task.isModified('dueDate')) {
      const currentDate = new Date();
      const dueDate = new Date(task.dueDate);
  
      const timeDifferenceInDays = Math.floor((dueDate - currentDate) / (1000 * 60 * 60 * 24));
  
      if (timeDifferenceInDays === 0) {
        task.priority = 0;
        console.log('Priority updated to 0 (due today):', task.priority);
      } else if (timeDifferenceInDays > 0 && timeDifferenceInDays <= 2) {
        task.priority = 1;
        console.log('Priority updated to 1 (due in 1-2 days):', task.priority);
      } else if (timeDifferenceInDays > 2 && timeDifferenceInDays <= 4) {
        task.priority = 2;
        console.log('Priority updated to 2 (due in 3-4 days):', task.priority);
      } else if (timeDifferenceInDays > 4) {
        task.priority = 3;
        console.log('Priority updated to 3 (due in more than 4 days):', task.priority);
      }
    }
  
    // Update status based on subtask completion
    if (task.isModified('completed') || (task.subtasks && task.subtasks.length > 0)) {
      const allSubtasksCompleted = (task.subtasks || []).every(subtask => subtask.status === 'completed');
  
      if (allSubtasksCompleted) {
        task.status = 'DONE';
        console.log('Status updated to DONE:', task.status);
      } else if ((task.subtasks || []).some(subtask => subtask.status === 'completed')) {
        task.status = 'IN_PROGRESS';
        console.log('Status updated to IN_PROGRESS:', task.status);
      } else {
        task.status = 'TODO';
        console.log('Status updated to TODO:', task.status);
      }
    }
  
    next();
  });
  
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
