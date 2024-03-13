const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/check-auth.js');

const router = new express.Router();

// Create a new task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    });
  
    try {
      await task.save();
      res.status(201).send(task);
    } catch (e) {
      res.status(400).send(e);
    }
  });
  
  // Create a new subtask for a task

  


// Get all tasks
router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id, status: 'active' });
    res.send(tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Get a task by id
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Update a task by id
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed', 'status'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    // Find the task by ID and owner
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
      status: { $ne: 'deleted' }, // Exclude soft-deleted tasks
    }).populate('subtasks');

    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }

    // Log the current state of the task before the update
    console.log('Task before update:', task);

    // Update the task with the provided body
    task.set(req.body);

    // Optionally, handle soft deletion here
    if (task.status === 'deleted') {
      // Additional logic for handling soft deletion
      task.softDeleted = true;
    }

    await task.save();

    // Log the updated task
    console.log('Task after update:', task);

    res.send(task);
  } catch (e) {
    console.error('Error in patch route:', e);
    res.status(400).send({ error: 'Failed to update task' });
  }
});

// Delete a task by id
// router.delete('/tasks/:id', auth, async (req, res) => {
  router.delete('/tasks/:id', auth, async (req, res) => {
    try {
      console.log('Task deletion request. Task ID:', req.params.id, 'User ID:', req.user._id);

        // Attempt to find and update the task
        const task = await Task.findOneAndUpdate(
          { _id: req.params.id, owner: req.user._id },
          { $set: { status: 'deleted' } },
          { new: true }
      );

        console.log('Task found:', task);

        // If the task is not found, return a 404 response
        if (!task) {
          console.log('Task not found or already deleted. Params:', req.params.id, 'User ID:', req.user._id);
          return res.status(404).send();
        }

        // Log success and send the updated task
        console.log('Task deleted successfully. Task:', task);
        res.send(task);
    } catch (error) {
        console.error('Error deleting task:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).send({ error: 'Validation error. Check your request data.' });
        }

        // Handle other errors and send a 500 response
        res.status(500).send(error);
    }
});


module.exports = router;
