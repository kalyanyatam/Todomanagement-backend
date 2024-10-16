import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoList from './TodoList';

const App = () => {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false); // Added state for completion

  // Fetch todos from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then((res) => {
        setTodos(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Handler for task input
  const changeHandler = (e) => {
    setTask(e.target.value);
  };

  // Handler for priority selection
  const priorityChangeHandler = (e) => {
    setPriority(e.target.value);
  };

  // Handler for due date input
  const dueDateChangeHandler = (e) => {
    setDueDate(e.target.value);
  };

  // Handler for task search
  const searchHandler = (e) => {
    setSearch(e.target.value);
  };

  // Handler for adding or updating a task
  const submitHandler = (e) => {
    e.preventDefault();

    const taskData = { task, priority, dueDate, isCompleted };

    if (isEditing) {
      axios.put(`http://localhost:5000/${currentId}`, taskData)
        .then((res) => {
          const updatedTodos = todos.map((todo) =>
            todo._id === currentId ? res.data : todo
          );
          setTodos(updatedTodos);
          setIsEditing(false);
        })
        .catch((err) => console.error(err));
    } else {
      axios.post('http://localhost:5000/', taskData)
        .then((res) => {
          setTodos([...todos, res.data]);
        })
        .catch((err) => console.error(err));
    }

    setTask('');
    setPriority('Medium');
    setDueDate('');
    setIsCompleted(false);
  };

  // Handler for deleting a task
  const deleteHandler = (id) => {
    axios.delete(`http://localhost:5000/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((err) => console.error(err));
  };

  // Handler for toggling task completion
  const toggleComplete = (id) => {
    const todo = todos.find((t) => t._id === id);
    axios.put(`http://localhost:5000/${id}`, { ...todo, isCompleted: !todo.isCompleted })
      .then((res) => {
        const updatedTodos = todos.map((t) => (t._id === id ? res.data : t));
        setTodos(updatedTodos);
      })
      .catch((err) => console.error(err));
  };

  // Handler for editing a task
  const editHandler = (id) => {
    const todo = todos.find((t) => t._id === id);
    setTask(todo.task);
    setPriority(todo.priority);
    setDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().substr(0, 10) : '');
    setIsCompleted(todo.isCompleted);
    setIsEditing(true);
    setCurrentId(id);
  };

  // Filter tasks based on search input
  const filteredTodos = todos.filter((todo) =>
    todo && todo.task && todo.task.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <center>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">TODO Management Application</h5>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search tasks"
              value={search}
              onChange={searchHandler}
            />
            <br />

            {/* Task Form */}
            <form onSubmit={submitHandler}>
              <input
                size="30"
                type="text"
                placeholder="Enter task"
                value={task}
                onChange={changeHandler}
              />
              <br />
              <label>Priority:</label>
              <select value={priority} onChange={priorityChangeHandler}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <br />
              <label>Due Date:</label>
              <input
                type="date"
                value={dueDate}
                onChange={dueDateChangeHandler}
              />
              <br />
              <button type="submit">{isEditing ? 'Update Task' : 'Add Task'}</button>
            </form>

            {/* Display Todos */}
            <TodoList
              todos={filteredTodos}
              deleteHandler={deleteHandler}
              toggleComplete={toggleComplete}
              editHandler={editHandler}
            />
          </div>
        </div>
      </center>
    </div>
  );
};

export default App;
