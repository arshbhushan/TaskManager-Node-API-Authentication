const express = require('express');
const Task = require('../models/task');
const SubTask = require('../models/subtask'); // Import the SubTask model
const auth = require('../middleware/check-auth.js');

const router = new express.Router();

// Create a new subtask for a task
router.post('/tasks/:id/subtasks', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    const subtask = new SubTask({
      ...req.body,
      task: task._id, // Set the task reference
      owner: req.user._id,
    });

    await subtask.save();
    res.status(201).send(subtask);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update a subtask by id
router.patch('/subtasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['status'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const subtask = await SubTask.findOne({ _id: req.params.id, owner: req.user._id });

    if (!subtask) {
      return res.status(404).send();
    }

    updates.forEach((update) => (subtask[update] = req.body[update]));
    await subtask.save();
    res.send(subtask);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get a subtask by id
router.get('/subtasks/:id', auth, async (req, res) => {
  try {
    const subtask = await SubTask.findOne({ _id: req.params.id, owner: req.user._id });

    if (!subtask) {
      return res.status(404).send();
    }

    res.send(subtask);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Delete a subtask by id
router.delete('/subtasks/:id', auth, async (req, res) => {
  try {
    const subtask = await SubTask.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!subtask) {
      return res.status(404).send();
    }

    res.send(subtask);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
