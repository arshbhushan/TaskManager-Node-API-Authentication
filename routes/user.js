const express = require('express');
const User = require('../models/user');
const checkAuth = require("../middleware/check-auth.js");  // Change this line


const router = new express.Router();

// Create a new user
router.post('/users', async (req, res) => {
    const user = new User(req.body);
  
    try {
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  });
  

// Login user
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Logout user
router.post('/users/logout', checkAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
