import React from 'react';

function TodoItem({ todo, onToggle, onDelete, members = [], currentUser }) {
  const getDateDisplay = (dateType) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // 커스텀 날짜인 경우 (YYYY-MM-DD 형식)
    if (dateType && dateType.includes('-') && dateType.length === 10) {
      const customDate = new Date(dateType);
      const month = customDate.getMonth() + 1;
      const day = customDate.getDate();
      return `선택한 날짜 (${month}/${day})`;
    }
    
    switch (dateType) {
      case 'today':
        return `오늘 (${today.getMonth() + 1}/${today.getDate()})`;
      case 'tomorrow':
        return `내일 (${tomorrow.getMonth() + 1}/${tomorrow.getDate()})`;
      default:
        return dateType || '날짜 미설정';
    }
  };

  const getAssignedUser = (assignedTo) => {
    if (!assignedTo) return null;
    return members.find(member => member.uid === assignedTo);
  };

  const assignedUser = getAssignedUser(todo.assignedTo);
  const createdByUser = members.find(member => member.uid === todo.createdBy);

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input 
        type="checkbox" 
        checked={todo.completed} 
        onChange={() => onToggle(todo.id)} 
      />
      <div className="todo-content">
        <div className="todo-title">{todo.title}</div>
        {todo.description && <div className="todo-description">{todo.description}</div>}
        <div className="todo-meta">
          <div className="todo-date">{getDateDisplay(todo.date)}</div>
          {assignedUser && (
            <div className="todo-assigned">
              👤 {assignedUser.displayName || assignedUser.email}
            </div>
          )}
          {createdByUser && todo.createdBy !== currentUser?.uid && (
            <div className="todo-created-by">
              📝 {createdByUser.displayName || createdByUser.email}
            </div>
          )}
        </div>
      </div>
      <button 
        className="delete-button"
        onClick={() => onDelete(todo.id)}
        title="삭제"
      >
        ✕
      </button>
    </li>
  );
}

export default TodoItem;


