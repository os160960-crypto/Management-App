import React, { useState } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = (todoData) => {
    const newTodo = {
      id: Date.now(),
      title: todoData.title,
      description: todoData.description,
      date: todoData.date,
      completed: false
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <a href="#" className="logo">Schedule</a>
            <button className="hamburger-menu">☰</button>
          </div>
          <div className="header-right">
            <button className="create-button">만들기</button>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="todo-container">
          <div className="list-title">내 할 일 목록</div>
          <TodoInput onAdd={addTodo} />
          <TodoList 
            todos={todos} 
            onToggle={toggleTodo} 
            onDelete={deleteTodo} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;


