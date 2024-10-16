import React from "react";

const TodoList = ({ todos, deleteHandler, toggleComplete, editHandler }) => {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index} style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}>
          {/* Display task details instead of the entire object */}
          <div>
            <strong>Task:</strong> {todo.task}
          </div>
          <div>
            <strong>Priority:</strong> {todo.priority}
          </div>
          <div>
            <strong>Due Date:</strong> {todo.dueDate}
          </div>

          {/* Buttons for task actions */}
          <button onClick={() => toggleComplete(index)}>
            {todo.isCompleted ? "Undo" : "Complete"}
          </button>
          <button onClick={() => editHandler(index)}>Edit</button>
          <button onClick={() => deleteHandler(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;