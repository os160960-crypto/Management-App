import React, { useState } from 'react';
import './CustomCalendar.css';

function CustomCalendar({ selectedDate, onDateSelect, onClose }) {
  const [currentDate, setCurrentDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
  
  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // 이전 달의 빈 칸들
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    // 항상 6주(42개 셀)로 고정하기 위해 나머지를 빈 칸으로 채움
    while (days.length < 42) {
      days.push(null);
    }
    
    return days;
  };
  
  const isToday = (day) => {
    const today = new Date();
    return (
      day &&
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      day === today.getDate()
    );
  };
  
  const isSelected = (day) => {
    if (!selectedDate || !day) return false;
    const selected = new Date(selectedDate);
    return (
      currentDate.getFullYear() === selected.getFullYear() &&
      currentDate.getMonth() === selected.getMonth() &&
      day === selected.getDate()
    );
  };
  
  const handleDateClick = (day) => {
    if (day) {
      const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onDateSelect(formattedDate);
      onClose();
    }
  };
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const days = getDaysInMonth(currentDate);
  
  return (
    <div className="custom-calendar-overlay">
      <div className="custom-calendar">
        <div className="calendar-header">
          <button className="nav-button" onClick={goToPreviousMonth}>
            ‹
          </button>
          <h3 className="month-year">
            {currentDate.getFullYear()}년 {months[currentDate.getMonth()]}
          </h3>
          <button className="nav-button" onClick={goToNextMonth}>
            ›
          </button>
        </div>
        
        <div className="calendar-weekdays">
          {weekDays.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-grid">
          {days.map((day, index) => (
            <button
              key={index}
              className={`calendar-day ${!day ? 'empty' : ''} ${isToday(day) ? 'today' : ''} ${isSelected(day) ? 'selected' : ''}`}
              onClick={() => handleDateClick(day)}
              disabled={!day}
            >
              {day}
            </button>
          ))}
        </div>
        
        <div className="calendar-footer">
          <button className="cancel-button" onClick={onClose}>
            취소
          </button>
          <button className="confirm-button" onClick={onClose}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomCalendar;
