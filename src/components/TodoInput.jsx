import React, { useState } from 'react';

function TodoInput({ onAdd }) {
  const [input, setInput] = useState('');

  const handleChange = (e) => setInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    onAdd(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={handleChange} placeholder="할 일을 입력하세요" />
      <button type="submit">추가</button>
    </form>
  );
}

export default TodoInput;

