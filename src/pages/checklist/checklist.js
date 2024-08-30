import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import Menu from "../../components/menu";

import '../../assets/css/checklist.css';
import city from '../../assets/images/city.png';
import left_arrow from '../../assets/images/left_arrow.png';
import right_arrow from '../../assets/images/right_arrow.png';

// 루틴 팝업 컴포넌트
const Popup = ({ onClose, onArrowClick, onSubmit }) => {
  const [routines, setRoutines] = useState([
    {
      title: '',
      content: '',
      toggle: false // 토글 상태 추가
    }
  ]);

  // 새로운 루틴 항목 추가 함수
  const handleAddRoutine = () => {
    if (routines.length < 3) {
      setRoutines([
        ...routines, 
        { title: '', content: '', toggle: false } // 새 항목에도 토글 상태 추가
      ]);
    }
  };

  // 루틴 항목 수정 함수
  const handleRoutineChange = (index, field, value) => {
    const updatedRoutines = routines.map((routine, i) => 
      i === index ? { ...routine, [field]: value } : routine
    );
    setRoutines(updatedRoutines);
  };

  // 토글 상태 변경 함수
  const handleToggleChange = (index) => {
    const updatedRoutines = routines.map((routine, i) =>
      i === index ? { ...routine, toggle: !routine.toggle } : routine
    );
    setRoutines(updatedRoutines);
  };

  // 루틴 항목 삭제 함수
  const handleDeleteRoutine = (index) => {
    const updatedRoutines = routines.filter((_, i) => i !== index);
    setRoutines(updatedRoutines);
  };

  // 저장 핸들러
  const handleSave = () => {
    console.log("루틴 목록:");
    routines.forEach((routine, index) => {
      console.log(`루틴 번호: ${index},
        루틴 토글: ${routine.toggle},
        루틴 제목: ${routine.title},
        루틴 내용: ${routine.content}`);
    });
    onSubmit(routines); // 루틴 데이터를 부모로 전달
  };

  return (
    <div className="routine-popup-overlay">
      <div className="routine-popup-background">
        <div className="routine-popup-content">
          <div className="routine-popup-header">
            <h2>Check List</h2>
            <button className="routine-popup-close" onClick={onClose}>X</button>
          </div>
          <div className="routine-popup-routine">
            <div className="routine-popup-routine-top">
              <div className="routine-popup-routine-top-title">
                <div className="routine-popup-routine-top-title-circle"></div>
                <div className="routine-popup-routine-top-title-name">Routine</div>
              </div>
              <img 
                src={right_arrow} 
                className="routine-popup-routine-top-arrow" 
                alt="right_arrow"
                onClick={onArrowClick} 
              />
            </div>
            <hr/>
            <div className="routine-popup-routine-middle">
              {routines.map((routine, index) => (
                <div className="routine-popup-routine-middle-box" key={index}>
                  <div className="routine-popup-routine-middle-box-1">
                    <input 
                      type="checkbox" 
                      id={`routine-toggle-${index}`} 
                      hidden 
                      checked={routine.toggle} // 토글 상태를 반영
                      onChange={() => handleToggleChange(index)} // 토글 변경 핸들러
                    /> 
                    <label htmlFor={`routine-toggle-${index}`} className="routine-popup-routine-middle-box-toggleSwitch">
                      <span className="routine-popup-routine-middle-box-toggleButton"></span>
                    </label>
                  </div>
                  <div className="routine-popup-routine-middle-box-2">
                    <input 
                      className="routine-popup-routine-middle-box-title" 
                      type="text" 
                      placeholder="Routine"
                      value={routine.title}
                      onChange={(e) => handleRoutineChange(index, 'title', e.target.value)}
                      spellCheck="false"
                    />
                  </div>
                  <div className="routine-popup-routine-middle-box-3">
                    <input 
                      className="routine-popup-routine-middle-box-content" 
                      type="text" 
                      placeholder="내용을 입력하시오."
                      value={routine.content}
                      onChange={(e) => handleRoutineChange(index, 'content', e.target.value)}
                    />
                  </div>
                  <div 
                    className="routine-popup-routine-middle-box-delete"
                    onClick={() => handleDeleteRoutine(index)} // 삭제 버튼 클릭 시 해당 항목 삭제
                  >
                    삭제
                  </div>
                </div>
              ))}
              {routines.length < 3 && ( // 루틴이 3개 미만일 때만 추가 버튼 표시
                <div className="routine-popup-routine-middle-plusbtn" onClick={handleAddRoutine}>
                  루틴 추가하기
                </div>
              )}
            </div>
            <div className="routine-popup-routine-savebtn" onClick={handleSave}>저장</div>
          </div>
        </div>
      </div>
    </div>
  );
};


// 투두 팝업 컴포넌트
const NewPopup = ({ onClose, onArrowClick, onSubmit }) => {
  const [todos, setTodos] = useState([
    {
      toggle: false,
      title: '',
      content: ''
    }
  ]);

  // 투두 항목 추가 함수
  const handleAddTodo = () => {
    if (todos.length < 5) {
      setTodos([
        ...todos,
        { toggle: false, title: '', content: '' }
      ]);
    }
  };

  // 투두 항목 수정 함수
  const handleTodoChange = (index, field, value) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, [field]: value } : todo
    );
    setTodos(updatedTodos);
  };

  // 토글 상태 변경 함수
  const handleToggleChange = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, toggle: !todo.toggle } : todo
    );
    setTodos(updatedTodos);
  };

  // 투두 항목 삭제 함수
  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  // 저장 핸들러
  const handleSave = () => {
    console.log("루틴 목록:");
    todos.forEach((todo, index) => {
      console.log(`루틴 번호: ${index},
        루틴 토글: ${todo.toggle},
        루틴 제목: ${todo.title},
        루틴 내용: ${todo.content}`);
    });
    onSubmit(todos); // 투두 데이터를 부모로 전달
  };

  return (
    <div className="popup-overlay">
      <div className="popup-background">
        <div className="popup-content">
          <div className="popup-header">
            <h2>Check List</h2>
            <button className="popup-close" onClick={onClose}>X</button>
          </div>
          <div className="popup-todo">
            <div className="popup-todo-top">
              <div className="popup-todo-top-title">
                <div className="popup-todo-top-title-circle"></div>
                <div className="popup-todo-top-title-name">To Do</div>
              </div>
              <img 
                src={right_arrow} 
                className="popup-todo-top-arrow" 
                alt="right_arrow"
                onClick={onArrowClick} 
              />
            </div>
            <hr />
            <div className="popup-todo-middle">
              {todos.map((todo, index) => (
                <div className="popup-todo-middle-box" key={index}>
                  <div className="popup-todo-middle-box-1">
                    <input 
                      type="checkbox" 
                      id={`toggle-${index}`} 
                      hidden 
                      checked={todo.toggle} 
                      onChange={() => handleToggleChange(index)} 
                    /> 
                    <label htmlFor={`toggle-${index}`} className="popup-todo-middle-box-toggleSwitch">
                      <span className="popup-todo-middle-box-toggleButton"></span>
                    </label>
                  </div>
                  <div className="popup-todo-middle-box-2">
                    <input 
                      className="popup-todo-middle-box-title" 
                      type="text" 
                      placeholder="To Do"
                      value={todo.title}
                      onChange={(e) => handleTodoChange(index, 'title', e.target.value)}
                      spellCheck="false"
                    />
                  </div>
                  <div className="popup-todo-middle-box-3">
                    <input 
                      className="popup-todo-middle-box-content" 
                      type="text" 
                      placeholder="내용을 입력하시오."
                      value={todo.content}
                      onChange={(e) => handleTodoChange(index, 'content', e.target.value)}
                    />
                  </div>
                  <div 
                    className="popup-todo-middle-box-delete"
                    onClick={() => handleDeleteTodo(index)}
                  >
                    삭제
                  </div>
                </div>
              ))}
              {todos.length < 5 && ( 
                <div className="popup-todo-middle-plusbtn" onClick={handleAddTodo}>
                  투두 추가하기
                </div>
              )}
            </div>
            <div className="popup-todo-savebtn" onClick={handleSave}>저장</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 체크리스트 페이지 전체화면 컴포넌트
const CheckList = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [editorData, setEditorData] = useState('');
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showNewPopup, setShowNewPopup] = useState(false);
  const [routines, setRoutines] = useState([]); // 전체 루틴 리스트 상태
  const [todos, setTodos] = useState([]); // 전체 투두 리스트 상태
  const editorRef = useRef();

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

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setCurrentDate(new Date(date));
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.innerText);
  };

  const handleDivClick = (index) => {
    setSelectedDiv(index);
  };

  const onChangeGetHTML = () => {
    if (editorRef.current) {
      const data = editorRef.current.getInstance().getHTML();
      setEditorData(data);
    }
  };

  const handleSubmit = () => {
    console.log("발행 시 날짜: ", selectedDate);
    console.log("발행 시 제목: ", title);
    console.log("발행 시 공개범위: ", selectedDiv);
    console.log("발행 시 에디터 내용: ", editorData);
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML('');
    }
  }, []);

  const getDay = (date) => date.getDate(); 

  const getDaysArray = () => {
    const today = new Date(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() - 3 + i);
      return day;
    });
  };

  useEffect(() => {
    if (showPopup || showNewPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showPopup, showNewPopup]);

  const handleRoutineArrowClick = () => {
    setShowPopup(false);
    setShowNewPopup(true);
  };

  const handleTodoArrowClick = () => {
    setShowPopup(true);
    setShowNewPopup(false);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setShowNewPopup(false);
  };

  const handleRoutineSubmit = (newRoutines) => {
    setRoutines(newRoutines);
  };

  const handleTodoSubmit = (newTodos) => {
    setTodos(newTodos);
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
              onClick={() => setShowPopup(true)}
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
                <div className="city__checklist__check-routine-bottom-box" key={index}>
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
                <div className="city__checklist__check-todo-bottom-box" key={index}>
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

      {showPopup && <Popup onClose={handlePopupClose} onArrowClick={handleRoutineArrowClick} onSubmit={handleRoutineSubmit} />}
      {showNewPopup && <NewPopup onClose={handlePopupClose} onArrowClick={handleTodoArrowClick} onSubmit={handleTodoSubmit} />}
    </div>
  );
};

export default CheckList;
