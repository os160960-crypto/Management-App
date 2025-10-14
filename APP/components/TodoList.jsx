import React, { useState } from 'react' ;

function Todolnput({ onAdd }) {
    const [input, setlnput] = useState('');

    const handleChange = (e) => setlnput(e. target.value);

    const hamdleSubmut = (e) => {
        e.prevenDefault();
        if (input.trim() === '') return;
        onAdd(input);
        setlnput('');
    };
    return (
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={handleChange} placeholder="할 일을 입력하세요" />
      <button type="submit">추가</button>
    </form>
  );
}

export default TodoInput;