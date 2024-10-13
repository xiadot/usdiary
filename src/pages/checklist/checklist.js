import React, { useState, useRef, useEffect } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';

import '../../assets/css/checklist.css';

import Routine from './routine';
import Todo from './todo';

import axios from 'axios';

// API 호출 함수들
export const postDiary = async (diary) => {
  try {
    const response = await axios.post('/diaries', diary);
    return response.data;
  } catch (error) {
    console.error('Failed to post diary:', error);
    throw error;
  }
};

export const putRoutine = async (id, updatedRoutine) => {
  try {
    const response = await axios.put(`/routines/${id}`, updatedRoutine);
    return response.data;
  } catch (error) {
    console.error('Failed to update routine:', error);
    throw error;
  }
};

export const deleteRoutine = async (id) => {
  try {
    await axios.delete(`/routines/${id}`);
  } catch (error) {
    console.error('Failed to delete routine:', error);
    throw error;
  }
};

export const putTodo = async (id, updatedTodo) => {
  try {
    const response = await axios.put(`/todos/${id}`, updatedTodo);
    return response.data;
  } catch (error) {
    console.error('Failed to update todo:', error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    await axios.delete(`/todos/${id}`);
  } catch (error) {
    console.error('Failed to delete todo:', error);
    throw error;
  }
};

// 체크리스트 페이지 전체화면 컴포넌트
const CheckList = ({ onBack }) => {
  const [showRoutine, setShowRoutine] = useState(false); // Popup을 Routine으로 변경
  const [showTodo, setShowTodo] = useState(false); // NewPopup을 Todo로 변경
  const [routines, setRoutines] = useState([]); // 전체 루틴 리스트 상태
  const [todos, setTodos] = useState([]); // 전체 투두 리스트 상태

  // 스크롤 잠금
  useEffect(() => {
    if (showRoutine || showTodo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showRoutine, showTodo]);

  // 루틴 팝업 열기 핸들러
  const handleRoutineArrowClick = () => {
    setShowRoutine(false);
    setShowTodo(true);
  };

  // 투두 팝업 열기 핸들러
  const handleTodoArrowClick = () => {
    setShowRoutine(true);
    setShowTodo(false);
  };

  // 팝업 닫기 핸들러
  const handlePopupClose = () => {
    setShowRoutine(false);
    setShowTodo(false);
  };

  // 루틴 제출 핸들러
  const handleRoutineSubmit = async (newRoutines) => {
    try {
      await postDiary(newRoutines);
      const updatedRoutines = await axios.get('/routines');
      setRoutines(updatedRoutines.data);
    } catch (error) {
      console.error('Failed to update routines:', error);
    }
  };

  // 투두 제출 핸들러
  const handleTodoSubmit = async (newTodos) => {
    try {
      await postDiary(newTodos);
      const updatedTodos = await axios.get('/todos');
      setTodos(updatedTodos.data);
    } catch (error) {
      console.error('Failed to update todos:', error);
    }
  };

  return (
    <div>
        <div className="city_back-button" onClick={onBack}>&lt;&lt;&nbsp;&nbsp;Hide</div>
        <div className="checklist">
          <div className="checklist-title">
            <div className="checklist-title-name">Check List</div>
            <div
              className="checklist-title-plusbtn"
              onClick={() => setShowRoutine(true)} // Popup을 Routine으로 변경
            >
              +
            </div>
          </div>

          <div className="checklist-routine">
            <div className="checklist-routine-top">
              <div className="checklist-routine-top-circle"></div>
              <div className="checklist-routine-top-name">Routine</div>
              <div className="checklist-routine-top-num">{routines.length}</div>
            </div>
            <hr/>
            <div className="checklist-routine-bottom">
              {routines.map((routine, index) => (
                <div className="checklist-routine-bottom-box" key={routine.id}>
                  <div className="checklist-routine-bottom-box-toggleSwitch">
                    <input 
                      type="checkbox" 
                      id={`routine-toggle-${index}`} 
                      hidden 
                      checked={routine.toggle} 
                      readOnly // 읽기 전용으로 설정
                    />
                    <label htmlFor={`routine-toggle-${index}`}>
                      <span></span>
                    </label>
                  </div>
                  <div className="checklist-routine-bottom-box-title">{routine.title}</div>
                  <div className="checklist-routine-bottom-box-content">{routine.content}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="checklist-todo">
            <div className="checklist-todo-top">
              <div className="checklist-todo-top-circle"></div>
              <div className="checklist-todo-top-name">To Do</div>
              <div className="checklist-todo-top-num">{todos.length}</div>
            </div>
            <hr/>
            <div className="checklist-todo-bottom">
              {todos.map((todo, index) => (
                <div className="checklist-todo-bottom-box" key={todo.id}>
                  <div className="checklist-todo-bottom-box-toggleSwitch">
                    <input 
                      type="checkbox" 
                      id={`todo-toggle-${index}`} 
                      hidden 
                      checked={todo.toggle} 
                      readOnly // 읽기 전용으로 설정
                    />
                    <label htmlFor={`todo-toggle-${index}`}>
                      <span></span>
                    </label>
                  </div>
                  <div className="checklist-todo-bottom-box-title">{todo.title}</div>
                  <div className="checklist-todo-bottom-box-content">{todo.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      {showRoutine && <Routine onClose={handlePopupClose} onArrowClick={handleRoutineArrowClick} onSubmit={handleRoutineSubmit} />}
      {showTodo && <Todo onClose={handlePopupClose} onArrowClick={handleTodoArrowClick} onSubmit={handleTodoSubmit} />}
    </div>
  );
};

export default CheckList;
