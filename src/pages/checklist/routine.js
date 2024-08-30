import React, { useState, useEffect } from 'react';
import '../../assets/css/checklist.css';
import right_arrow from '../../assets/images/right_arrow.png';
import axios from 'axios';

// API 호출 함수들
const getRoutines = async () => {
  try {
    const response = await axios.get('/routines');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch routines:', error);
    throw error;
  }
};

const postRoutines = async (routines) => {
  try {
    const response = await axios.post('/routines', { routines });
    return response.data;
  } catch (error) {
    console.error('Failed to post routines:', error);
    throw error;
  }
};

const Routine = ({ onClose, onArrowClick, onSubmit }) => {
  const [routines, setRoutines] = useState([
    { title: '', content: '', toggle: false }
  ]);

  // Fetch routines when component mounts
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const data = await getRoutines();
        setRoutines(data || [{ title: '', content: '', toggle: false }]);
      } catch (error) {
        console.error('Failed to fetch routines:', error);
      }
    };

    fetchRoutines();
  }, []);

  const handleAddRoutine = () => {
    if (routines.length < 3) {
      setRoutines([...routines, { title: '', content: '', toggle: false }]);
    }
  };

  const handleRoutineChange = (index, field, value) => {
    const updatedRoutines = routines.map((routine, i) =>
      i === index ? { ...routine, [field]: value } : routine
    );
    setRoutines(updatedRoutines);
  };

  const handleToggleChange = (index) => {
    const updatedRoutines = routines.map((routine, i) =>
      i === index ? { ...routine, toggle: !routine.toggle } : routine
    );
    setRoutines(updatedRoutines);
  };

  const handleDeleteRoutine = (index) => {
    const updatedRoutines = routines.filter((_, i) => i !== index);
    setRoutines(updatedRoutines);
  };

  const handleSave = async () => {
    try {
      await postRoutines(routines);
      console.log("루틴 목록이 성공적으로 저장되었습니다.");
      onSubmit(routines);
    } catch (error) {
      console.error('Failed to save routines:', error);
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
          <div className="ck-popup-routine">
            <div className="ck-popup-routine-top">
              <div className="ck-popup-routine-top-title">
                <div className="ck-popup-routine-top-title-circle"></div>
                <div className="ck-popup-routine-top-title-name">Routine</div>
              </div>
              <img 
                src={right_arrow} 
                className="ck-popup-routine-top-arrow" 
                alt="right_arrow"
                onClick={onArrowClick} 
              />
            </div>
            <hr/>
            <div className="ck-popup-routine-middle">
              {routines.map((routine, index) => (
                <div className="ck-popup-routine-middle-box" key={index}>
                  <div className="ck-popup-routine-middle-box-1">
                    <input 
                      type="checkbox" 
                      id={`toggle-${index}`} 
                      hidden 
                      checked={routine.toggle} 
                      onChange={() => handleToggleChange(index)} 
                    /> 
                    <label htmlFor={`toggle-${index}`} className="ck-popup-routine-middle-box-toggleSwitch">
                      <span className="ck-popup-routine-middle-box-toggleButton"></span>
                    </label>
                  </div>
                  <div className="ck-popup-routine-middle-box-2">
                    <input 
                      className="ck-popup-routine-middle-box-title" 
                      type="text" 
                      placeholder="Routine"
                      value={routine.title}
                      onChange={(e) => handleRoutineChange(index, 'title', e.target.value)}
                      spellCheck="false"
                    />
                  </div>
                  <div className="ck-popup-routine-middle-box-3">
                    <input 
                      className="ck-popup-routine-middle-box-content" 
                      type="text" 
                      placeholder="내용을 입력하시오."
                      value={routine.content}
                      onChange={(e) => handleRoutineChange(index, 'content', e.target.value)}
                    />
                  </div>
                  <div 
                    className="ck-popup-routine-middle-box-delete"
                    onClick={() => handleDeleteRoutine(index)}
                  >
                    삭제
                  </div>
                </div>
              ))}
              {routines.length < 3 && (
                <div className="ck-popup-routine-middle-plusbtn" onClick={handleAddRoutine}>
                  루틴 추가하기
                </div>
              )}
            </div>
            <div className="ck-popup-routine-savebtn" onClick={handleSave}>저장</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routine;

// 루틴 관련 API 호출
export const deleteRoutine = async (id) => {
  try {
    await axios.delete(`/routines/${id}`);
  } catch (error) {
    console.error('Failed to delete routine:', error);
    throw error;
  }
};

export const updateRoutine = async (id, routine) => {
  try {
    const response = await axios.put(`/routines/${id}`, routine);
    return response.data;
  } catch (error) {
    console.error('Failed to update routine:', error);
    throw error;
  }
};
