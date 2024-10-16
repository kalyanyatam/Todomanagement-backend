const mongoose = require('mongoose');

// Create a schema for Todo
const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  dueDate: {
    type: Date,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

// Create the model from the schema
module.exports = mongoose.model('Todo', todoSchema);
