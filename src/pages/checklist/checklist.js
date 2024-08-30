import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import Menu from "../../components/menu";

import '../../assets/css/checklist.css';
import city from '../../assets/images/city.png';
import left_arrow from '../../assets/images/left_arrow.png';
import right_arrow from '../../assets/images/right_arrow.png';

import Routine from './routine';
import Todo from './todo';

import axios from 'axios';

// API 호출 함수들
export const getDiaries = async () => {
  try {
    const response = await axios.get('/diaries');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch diaries:', error);
    throw error;
  }
};

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [editorData, setEditorData] = useState('');
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [showRoutine, setShowRoutine] = useState(false); // Popup을 Routine으로 변경
  const [showTodo, setShowTodo] = useState(false); // NewPopup을 Todo로 변경
  const [routines, setRoutines] = useState([]); // 전체 루틴 리스트 상태
  const [todos, setTodos] = useState([]); // 전체 투두 리스트 상태
  const editorRef = useRef();

  // Data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDiaries(); // API 호출
        setRoutines(data.routines || []);
        setTodos(data.todos || []);
      } catch (error) {
        console.error('Failed to fetch diaries:', error);
      }
    };
    fetchData();
  }, []);

  // 날짜 변경
  const changeDate = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else if (direction === 'next') {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setCurrentDate(new Date(date));
  };

  // 제목 변경 핸들러
  const handleTitleChange = (event) => {
    setTitle(event.target.innerText);
  };

  // 공개 범위 클릭 핸들러
  const handleDivClick = (index) => {
    setSelectedDiv(index);
  };

  // 에디터 데이터 변경 핸들러
  const onChangeGetHTML = () => {
    if (editorRef.current) {
      const data = editorRef.current.getInstance().getHTML();
      setEditorData(data);
    }
  };

  // 발행 버튼 클릭 핸들러
  const handleSubmit = async () => {
    console.log("발행 시 날짜: ", selectedDate);
    console.log("발행 시 제목: ", title);
    console.log("발행 시 공개범위: ", selectedDiv);
    console.log("발행 시 에디터 내용: ", editorData);

    // POST 요청에 포함할 데이터 구성
    const diaryData = {
      board_id: 2, // 추가된 board_id
      date: selectedDate.toISOString(), // 현재 선택된 날짜
      title,
      content: editorData,
      visibility: selectedDiv // 공개 범위
    };

    try {
      await postDiary(diaryData); // POST 요청 보내기
      console.log('Diary posted successfully');
      // 요청이 성공적으로 완료된 후의 처리 (예: 상태 초기화, 사용자 알림 등)
      setTitle('');
      setEditorData('');
      setSelectedDiv(0);
    } catch (error) {
      console.error('Failed to post diary:', error);
      // 오류 처리
    }
  };

  // 에디터 초기화
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML('');
    }
  }, []);

  // 날짜 형식 가져오기
  const getDay = (date) => date.getDate(); 

  const getDaysArray = () => {
    const today = new Date(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() - 3 + i);
      return day;
    });
  };

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

  // 루틴 수정 핸들러
  const handleRoutineUpdate = async (id, updatedRoutine) => {
    try {
      const result = await putRoutine(id, updatedRoutine);
      setRoutines((prevRoutines) =>
        prevRoutines.map((routine) =>
          routine.id === id ? result : routine
        )
      );
    } catch (error) {
      console.error('Failed to update routine:', error);
    }
  };

  // 루틴 삭제 핸들러
  const handleRoutineDelete = async (id) => {
    try {
      await deleteRoutine(id);
      setRoutines((prevRoutines) =>
        prevRoutines.filter((routine) => routine.id !== id)
      );
    } catch (error) {
      console.error('Failed to delete routine:', error);
    }
  };

  // 투두 수정 핸들러
  const handleTodoUpdate = async (id, updatedTodo) => {
    try {
      const result = await putTodo(id, updatedTodo);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? result : todo
        )
      );
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  // 투두 삭제 핸들러
  const handleTodoDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== id)
      );
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  return (
    <div className="wrap">
      <Menu/>
      
      <div className="city__checklist">
        <div className="city__checklist__check">
          <div className="city__checklist__check-title">
            <div className="city__checklist__check-title-name">Check List</div>
            <div
              className="city__checklist__check-title-plusbtn"
              onClick={() => setShowRoutine(true)} // Popup을 Routine으로 변경
            >
              +
            </div>
          </div>

          <div className="city__checklist__check-routine">
            <div className="city__checklist__check-routine-top">
              <div className="city__checklist__check-routine-top-circle"></div>
              <div className="city__checklist__check-routine-top-name">Routine</div>
              <div className="city__checklist__check-routine-top-num">{routines.length}</div>
            </div>
            <hr/>
            <div className="city__checklist__check-routine-bottom">
              {routines.map((routine, index) => (
                <div className="city__checklist__check-routine-bottom-box" key={routine.id}>
                  <div className="city__checklist__check-routine-bottom-box-toggleSwitch">
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
                  <div className="city__checklist__check-routine-bottom-box-title">{routine.title}</div>
                  <div className="city__checklist__check-routine-bottom-box-content">{routine.content}</div>
                  <button onClick={() => handleRoutineUpdate(routine.id, { ...routine, toggle: !routine.toggle })}>수정</button>
                  <button onClick={() => handleRoutineDelete(routine.id)}>삭제</button>
                </div>
              ))}
            </div>
          </div>

          <div className="city__checklist__check-todo">
            <div className="city__checklist__check-todo-top">
              <div className="city__checklist__check-todo-top-circle"></div>
              <div className="city__checklist__check-todo-top-name">To Do</div>
              <div className="city__checklist__check-todo-top-num">{todos.length}</div>
            </div>
            <hr/>
            <div className="city__checklist__check-todo-bottom">
              {todos.map((todo, index) => (
                <div className="city__checklist__check-todo-bottom-box" key={todo.id}>
                  <div className="city__checklist__check-todo-bottom-box-toggleSwitch">
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
                  <div className="city__checklist__check-todo-bottom-box-title">{todo.title}</div>
                  <div className="city__checklist__check-todo-bottom-box-content">{todo.content}</div>
                  <button onClick={() => handleTodoUpdate(todo.id, { ...todo, toggle: !todo.toggle })}>수정</button>
                  <button onClick={() => handleTodoDelete(todo.id)}>삭제</button>
                </div>
              ))}
            </div>
          </div>      
        </div>

        <div className="city__checklist__diary">
          <div className="city__checklist__diary-top">
            <img src={city} className="city__checklist__diary-top-image" alt="city" />
            <div className="city__checklist__diary-top-title">Today's City</div>
          </div>
          <div className="city__checklist__diary-date">
            <img src={left_arrow} className="city__checklist__diary-date-arrow" alt="left_arrow" onClick={() => changeDate('prev')}/>
            <div className="city__checklist__diary-date-container">
              {getDaysArray().map((day, i) => (
                <div
                  key={i}
                  className={`city__checklist__diary-date-round ${day.toDateString() === selectedDate.toDateString() ? 'city__checklist__diary-date-round--today' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  {getDay(day)} 
                </div>
              ))}
            </div>
            <img src={right_arrow} className="city__checklist__diary-date-arrow" alt="right_arrow" onClick={() => changeDate('next')}/>
          </div>
          <div className="city__checklist__diary-title-edit">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              className="city__checklist__diary-title-edit-input"
              spellCheck={false}
            />
          </div>
          <div className="city__checklist__diary-another">
            <div className="city__checklist__diary-another-reveal">
              {['only', 'subscribe', 'all'].map((className, index) => (
                <div
                  key={index}
                  className={`city__checklist__diary-another-reveal-btn city__checklist__diary-another-reveal-btn--${className} ${selectedDiv === index ? 'city__checklist__diary-another-reveal-btn--selected' : ''}`}
                  onClick={() => handleDivClick(index)}
                >
                  {className}
                </div>
              ))}
            </div>
            <div className="city__checklist__diary-another-submit" onClick={handleSubmit}>발행</div>
          </div>
          <div className="city__checklist__diary-texts">
            <Editor
              toolbarItems={[
                ['heading', 'bold', 'italic', 'strike'],
                ['image', 'link']
              ]}
              height="100%"
              initialEditType="wysiwyg"
              ref={editorRef}
              onChange={onChangeGetHTML}
              hideModeSwitch={true}
            />
          </div>
        </div>
      </div>

      {showRoutine && <Routine onClose={handlePopupClose} onArrowClick={handleRoutineArrowClick} onSubmit={handleRoutineSubmit} />}
      {showTodo && <Todo onClose={handlePopupClose} onArrowClick={handleTodoArrowClick} onSubmit={handleTodoSubmit} />}
    </div>
  );
};

export default CheckList;
