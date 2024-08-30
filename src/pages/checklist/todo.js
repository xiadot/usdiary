import React, { useState, useEffect } from 'react';
import '../../assets/css/checklist.css';
import right_arrow from '../../assets/images/right_arrow.png';
import axios from 'axios';

// API 호출 함수들
const getTodos = async () => {
  try {
    const response = await axios.get('/todos');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    throw error;
  }
};

const postTodos = async (todos) => {
  try {
    const response = await axios.post('/todos', { todos });
    return response.data;
  } catch (error) {
    console.error('Failed to post todos:', error);
    throw error;
  }
};

const Todo = ({ onClose, onArrowClick, onSubmit }) => {
  const [todos, setTodos] = useState([
    { toggle: false, title: '', content: '' }
  ]);

  // Fetch todos when component mounts
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodos();
        setTodos(data || [{ toggle: false, title: '', content: '' }]);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = () => {
    if (todos.length < 5) {
      setTodos([...todos, { toggle: false, title: '', content: '' }]);
    }
  };

  const handleTodoChange = (index, field, value) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, [field]: value } : todo
    );
    setTodos(updatedTodos);
  };

  const handleToggleChange = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, toggle: !todo.toggle } : todo
    );
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const handleSave = async () => {
    try {
      await postTodos(todos);
      console.log("투두 목록이 성공적으로 저장되었습니다.");
      onSubmit(todos);
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  };

  return (
    <div className="ck-popup-overlay">
      <div className="ck-popup-background">
        <div className="ck-popup-content">
          <div className="ck-popup-header">
            <h2>Check List</h2>
            <button className="ck-popup-close" onClick={onClose}>X</button>
          </div>
          <div className="ck-popup-todo">
            <div className="ck-popup-todo-top">
              <div className="ck-popup-todo-top-title">
                <div className="ck-popup-todo-top-title-circle"></div>
                <div className="ck-popup-todo-top-title-name">To Do</div>
              </div>
              <img 
                src={right_arrow} 
                className="ck-popup-todo-top-arrow" 
                alt="right_arrow"
                onClick={onArrowClick} 
              />
            </div>
            <hr />
            <div className="ck-popup-todo-middle">
              {todos.map((todo, index) => (
                <div className="ck-popup-todo-middle-box" key={index}>
                  <div className="ck-popup-todo-middle-box-1">
                    <input 
                      type="checkbox" 
                      id={`toggle-${index}`} 
                      hidden 
                      checked={todo.toggle} 
                      onChange={() => handleToggleChange(index)} 
                    /> 
                    <label htmlFor={`toggle-${index}`} className="ck-popup-todo-middle-box-toggleSwitch">
                      <span className="ck-popup-todo-middle-box-toggleButton"></span>
                    </label>
                  </div>
                  <div className="ck-popup-todo-middle-box-2">
                    <input 
                      className="ck-popup-todo-middle-box-title" 
                      type="text" 
                      placeholder="To Do"
                      value={todo.title}
                      onChange={(e) => handleTodoChange(index, 'title', e.target.value)}
                      spellCheck="false"
                    />
                  </div>
                  <div className="ck-popup-todo-middle-box-3">
                    <input 
                      className="ck-popup-todo-middle-box-content" 
                      type="text" 
                      placeholder="내용을 입력하시오."
                      value={todo.content}
                      onChange={(e) => handleTodoChange(index, 'content', e.target.value)}
                    />
                  </div>
                  <div 
                    className="ck-popup-todo-middle-box-delete"
                    onClick={() => handleDeleteTodo(index)}
                  >
                    삭제
                  </div>
                </div>
              ))}
              {todos.length < 5 && (
                <div className="ck-popup-todo-middle-plusbtn" onClick={handleAddTodo}>
                  투두 추가하기
                </div>
              )}
            </div>
            <div className="ck-popup-todo-savebtn" onClick={handleSave}>저장</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;

// 투두 관련 API 호출
export const deleteTodo = async (id) => {
  try {
    await axios.delete(`/todos/${id}`);
  } catch (error) {
    console.error('Failed to delete todo:', error);
    throw error;
  }
};

export const updateTodo = async (id, todo) => {
  try {
    const response = await axios.put(`/todos/${id}`, todo);
    return response.data;
  } catch (error) {
    console.error('Failed to update todo:', error);
    throw error;
  }
};
