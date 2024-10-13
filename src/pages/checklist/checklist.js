import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
const CheckList = () => {
  const location = useLocation();
  const { diary } = location.state || {};

  const [routines, setRoutines] = useState([]); // 초기 루틴 상태
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // 다이어리 객체가 있는 경우에만 초기 데이터를 설정
    if (diary) {
      // 여기에 다이어리의 user_id와 diary_id를 이용하여 API 호출하여 데이터를 가져오거나
      // 더미 데이터를 설정할 수 있습니다.
      
      // 더미 루틴 데이터
      const allRoutines = [
        { routine_id: 1, title: "아침 운동", content: "혈당 관리용", is_completed: true, user_id: 1 },
        { routine_id: 2, title: "아침 식사", is_completed: false, user_id: 2 },
        { routine_id: 3, title: "일일 목표 설정", is_completed: false, user_id: 1 },
      ];
    
      const allTodos = [
        { todo_id: 1, title: "레포트 작성", is_completed: true, diary_id: 11 },
        { todo_id: 2, title: "회의 준비", is_completed: false, diary_id: 2 },
        { todo_id: 3, title: "장보기", is_completed: false, diary_id: 11 },
      ];

      // 다이어리의 user_id 및 diary_id를 바탕으로 초기 데이터 설정
      const initialRoutines = allRoutines.filter(routine => routine.user_id === diary.user_id);
      const initialTodos = allTodos.filter(todo => todo.diary_id === diary.diary_id);

      setRoutines(initialRoutines);
      setTodos(initialTodos);
    }
  }, [diary]);


  const [showRoutine, setShowRoutine] = useState(false); // Popup을 Routine으로 변경
  const [showTodo, setShowTodo] = useState(false); // NewPopup을 Todo로 변경
  
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
      setRoutines(newRoutines);
    } catch (error) {
      console.error('Failed to update routines:', error);
    }
  };

  // 투두 제출 핸들러
  const handleTodoSubmit = async (newTodos) => {
    try {
      setTodos(newTodos);
    } catch (error) {
      console.error('Failed to update todos:', error);
    }
  };

  return (
    <div>
      <div className="checklist">
        <div className="checklist-title">
          <div className="checklist-title-name">Check List</div>
          <div
            className="checklist-title-plusbtn"
            onClick={() => diary ? null : setShowRoutine(true)} // diary가 있으면 클릭할 수 없음
            style={{ cursor: diary ? 'not-allowed' : 'pointer', opacity: diary ? 0.5 : 1 }} // 비활성화 스타일
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
          <hr />
          <div className="checklist-routine-bottom">
            {routines.map((routine, index) => (
              <div className="checklist-routine-bottom-box" key={routine.id}>
                <div className="checklist-routine-bottom-box-toggleSwitch">
                  <input
                    type="checkbox"
                    id={`routine-toggle-${index}`}
                    hidden
                    checked={routine.is_completed}
                    readOnly
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
          <hr />
          <div className="checklist-todo-bottom">
            {todos.map((todo, index) => (
              <div className="checklist-todo-bottom-box" key={todo.id}>
                <div className="checklist-todo-bottom-box-toggleSwitch">
                  <input
                    type="checkbox"
                    id={`todo-toggle-${index}`}
                    hidden
                    checked={todo.is_completed}
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
