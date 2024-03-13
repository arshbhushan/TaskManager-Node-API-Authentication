const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');
const subTaskRouter=require('./routes/subtask');

const app = express();
const port = process.env.PORT || 3100;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(subTaskRouter);


// Connect to MongoDB using the credentials from .env
// Connect to MongoDB using the credentials from .env
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is up on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

