import React from 'react';

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="todo-item">
      <input 
        type="checkbox" 
        checked={todo.completed} 
        onChange={() => onToggle(todo.id)} 
      />
      <span className={todo.completed ? 'completed' : ''}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>삭제</button>
    </li>
  );
}

export default TodoItem;

