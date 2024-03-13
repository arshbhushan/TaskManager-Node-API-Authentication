const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    enum: [0, 1], // 0- Incomplete, 1- Complete
    default: 0, // Default status is Incomplete
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Task', // Reference to the Task model
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted_at: {
    type: Date,
    default: null, // Initially set to null, indicating not deleted
  },
}, {
  timestamps: true,
});

const SubTask = mongoose.model('SubTask', subtaskSchema);

module.exports = SubTask;
