const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Todo = require('./models/Todo'); // Adjust the path if needed

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/todo'; 
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// API endpoints
// Create a new todo
app.post('/', (req, res) => {
    const { task, priority, isCompleted, dueDate } = req.body;
    Todo.create({ task, priority, isCompleted, dueDate })
        .then(result => res.json(result))
        .catch(err => res.status(500).json({ message: err.message }));
});

// Get all todos
app.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a todo by ID
app.delete('/:id', (req, res) => {
    const { id } = req.params;
    Todo.findByIdAndDelete(id)
        .then(deletedTodo => {
            if (!deletedTodo) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            res.status(200).json({ message: 'Todo deleted successfully' });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Update a todo by ID
app.put('/:id', (req, res) => {
    const { id } = req.params;
    const { task, priority, isCompleted, dueDate } = req.body;

    Todo.findByIdAndUpdate(id, { task, priority, isCompleted, dueDate }, { new: true })
        .then(updatedTodo => {
            if (!updatedTodo) {
                return res.status(404).json({ error: 'Todo not found' });
            }
            res.status(200).json(updatedTodo);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
