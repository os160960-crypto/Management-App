import React, { useState } from 'react';
import CustomCalendar from './CustomCalendar';

function TodoInput({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('today');
  const [customDate, setCustomDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '') return;
    
    let finalDate = selectedDate;
    if (selectedDate === 'custom' && customDate) {
      finalDate = customDate;
    }
    
    const todoData = {
      title: title.trim(),
      description: description.trim(),
      date: finalDate
    };
    
    onAdd(todoData);
    setTitle('');
    setDescription('');
    setSelectedDate('today');
    setCustomDate('');
    setShowCalendar(false);
  };

  const handleDateSelect = (dateType) => {
    if (dateType === 'calendar') {
      setShowCalendar(!showCalendar);
      setSelectedDate('custom');
    } else {
      setShowCalendar(false);
      setSelectedDate(dateType);
    }
  };

  const handleCalendarDateSelect = (date) => {
    setCustomDate(date);
    setSelectedDate('custom');
  };

  const handleCustomDateChange = (e) => {
    setCustomDate(e.target.value);
  };

  const getDateLabel = (dateType) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    switch (dateType) {
      case 'today':
        return `오늘 (${today.getMonth() + 1}/${today.getDate()})`;
      case 'tomorrow':
        return `내일 (${tomorrow.getMonth() + 1}/${tomorrow.getDate()})`;
      case 'custom':
        return customDate ? `선택한 날짜 (${customDate})` : '날짜 선택';
      default:
        return dateType;
    }
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input 
          className="form-input"
          type="text"
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="제목 추가" 
        />
        <button type="submit" className="submit-button">할 일 추가</button>
      </div>
      <div className="form-row">
        <input 
          className="form-input"
          type="text"
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="세부사항 추가" 
        />
      </div>
      <div className="form-row">
        <div className="date-selector">
          <button 
            type="button"
            className={`date-button ${selectedDate === 'today' ? 'selected' : ''}`}
            onClick={() => handleDateSelect('today')}
          >
            오늘
          </button>
          <button 
            type="button"
            className={`date-button ${selectedDate === 'tomorrow' ? 'selected' : ''}`}
            onClick={() => handleDateSelect('tomorrow')}
          >
            내일
          </button>
          <button 
            type="button"
            className={`date-button ${selectedDate === 'custom' ? 'selected' : ''}`}
            onClick={() => handleDateSelect('calendar')}
          >
            📅
          </button>
        </div>
      </div>
      {showCalendar && (
        <CustomCalendar
          selectedDate={customDate}
          onDateSelect={handleCalendarDateSelect}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </form>
  );
}

export default TodoInput;


