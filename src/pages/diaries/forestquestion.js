import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import Menu from "../../components/menu";
import '../../assets/css/forestquestion.css';
import city from '../../assets/images/tree.png';
import left_arrow from '../../assets/images/left_arrow.png';
import right_arrow from '../../assets/images/right_arrow.png';

const TodayQuestionPopup = ({ onClose, question, question_id, initialAnswer, initialPhoto, onDelete }) => {
  const [answer, setAnswer] = useState(initialAnswer || '');
  const [photo, setPhoto] = useState(initialPhoto || null);
  const fileInputRef = useRef(null);

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('answer', answer);
      if (photo) {
        formData.append('photo', photo);
      }

      await axios.post(`http://localhost:3001/questions/${question_id}/answers`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('답변이 성공적으로 저장되었습니다.');
      onClose(); // 상태 업데이트와 팝업 닫기
    } catch (error) {
      console.error('Error saving the answer:', error);
      alert('답변 저장에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/questions/${question_id}/answers`);
      alert('답변이 성공적으로 삭제되었습니다.');
      onDelete(); // 삭제 후 팝업 닫기
    } catch (error) {
      console.error('Error deleting the answer:', error);
      alert('답변 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="forestquestion_popup-overlay">
      <div className="forestquestion_popup-background">
        <div className="forestquestion_popup-content">
          <div className="forestquestion_popup-header">
            <h2>Today's Question</h2>
            <button className="forestquestion_popup-close" onClick={onClose}>X</button>
          </div>
          <div className="forestquestion_popup-question-box">
            <div className="forestquestion_popup-question-text">{question}</div>
            <textarea 
              className="forestquestion_popup-answer-box" 
              value={answer}
              onChange={handleAnswerChange}
            />
            <input 
              type="file" 
              className="forestquestion_popup-photo-input" 
              accept="image/*"
              onChange={handlePhotoChange}
              ref={fileInputRef}
            />
            {photo && <img src={photo} className="forestquestion_popup-photo-display" alt="selected" />}
            <button className="forestquestion_popup-save-button" onClick={handleSave}>저장</button>
            <button className="forestquestion_popup-delete-button" onClick={handleDelete}>삭제</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ForestQuestion = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState('제목');
  const [editorData, setEditorData] = useState('');
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [showTodayQuestionPopup, setShowTodayQuestionPopup] = useState(false);
  const [todayQuestionContent, setTodayQuestionContent] = useState('');
  const [todayQuestion, setTodayQuestion] = useState('Question');
  const [question_id, setQuestionId] = useState(null);
  const [initialAnswer, setInitialAnswer] = useState('');
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [answer_id, setAnswerId] = useState(null);
  const editorRef = useRef();

  useEffect(() => {
    const fetchTodayQuestion = async () => {
      try {
        const response = await axios.get('http://localhost:3001/questions/random');
        setTodayQuestion(response.data.question);
        setQuestionId(response.data.id);

        // 기존 답변과 사진 가져오기
        const answersResponse = await axios.get(`http://localhost:3001/questions/${response.data.id}/answers`);
        const latestAnswer = answersResponse.data[0] || {};
        setInitialAnswer(latestAnswer.answer || '');
        setInitialPhoto(latestAnswer.photo || null);
        setAnswerId(latestAnswer.id || null);

      } catch (error) {
        console.error('Error fetching the question:', error);
        setTodayQuestion('질문을 가져오는 데 실패했습니다.');
      }
    };

    fetchTodayQuestion();
  }, []);

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

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3001/questions', {
        title,
        content: editorData,
        date: selectedDate.toISOString(),
        visibility: selectedDiv
      });

      alert('문서가 성공적으로 발행되었습니다.');
    } catch (error) {
      console.error('Error submitting the question:', error);
      alert('문서 발행에 실패했습니다.');
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      await axios.patch(`http://localhost:3001/questions/${question_id}`, {
        title,
        content: editorData,
      });

      alert('질문이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('Error updating the question:', error);
      alert('질문 수정에 실패했습니다.');
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      await axios.delete(`http://localhost:3001/questions/${question_id}`);

      alert('질문이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting the question:', error);
      alert('질문 삭제에 실패했습니다.');
    }
  };

  const handleUpdateAnswer = async () => {
    try {
      const formData = new FormData();
      formData.append('answer', initialAnswer);
      if (initialPhoto) {
        formData.append('photo', initialPhoto);
      }

      await axios.patch(`http://localhost:3001/questions/${question_id}/answers/${answer_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('답변이 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('Error updating the answer:', error);
      alert('답변 수정에 실패했습니다.');
    }
  };

  const handleDeleteAnswer = async () => {
    try {
      await axios.delete(`http://localhost:3001/questions/${question_id}/answers/${answer_id}`);

      alert('답변이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting the answer:', error);
      alert('답변 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML('');
    }
  }, []);

  useEffect(() => {
    const savedAnswer = localStorage.getItem('todayAnswer');
    setTodayQuestionContent(savedAnswer 
      ? `<div class="today-question-text">${todayQuestion}</div><div class="today-answer-text">${savedAnswer}</div>` 
      : `<div class="today-question-text">${todayQuestion}</div><div class="today-answer-text">answer</div>`);
  }, [showTodayQuestionPopup, todayQuestion]);

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
    if (showTodayQuestionPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showTodayQuestionPopup]);

  const handleTodayQuestionButtonClick = () => {
    setShowTodayQuestionPopup(true);
  };

  const handleTodayQuestionPopupClose = () => {
    setShowTodayQuestionPopup(false);
    setInitialAnswer('');
    setInitialPhoto(null);
  };

  const handleSaveAnswer = () => {
    handleTodayQuestionPopupClose();
  };

  const handleDeleteAnswerFromPopup = () => {
    handleDeleteAnswer();
    handleTodayQuestionPopupClose();
  };

  return (
    <div className="wrap">  
      <Menu />    
      <div className="forest__forestquestion">
        <div className="forest__forestquestion__check">
          <div className="forest__forestquestion__check-title">
            <div className="forest__forestquestion__check-title-name">Today's Question</div>
            <div
              className="forest__forestquestion__check-title-plusbtn"
              onClick={handleTodayQuestionButtonClick}
            >
              +
            </div>
          </div>
          <div className="forest__forestquestion__check-today-question">
            <div className="today-question-box">
              <div className="today-question-content" dangerouslySetInnerHTML={{ __html: todayQuestionContent }}></div>
              {/* 박스가 있어야 할 위치에 조건부 렌더링 추가 */}
              {initialPhoto && (
                <div className="forest__forestquestion__check-today-photo-box">
                  <img src={initialPhoto} alt="answer" className="forest__forestquestion__check-today-photo" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="forest__forestquestion__diary">
          <div className="forest__forestquestion__diary-top">
            <img src={city} className="forest__forestquestion__diary-top-image" alt="forest" />
            <div className="forest__forestquestion__diary-top-title">Today's Forest</div>
          </div>
          <div className="forest__forestquestion__diary-date">
            <img src={left_arrow} className="forest__forestquestion__diary-date-arrow" alt="left_arrow" onClick={() => changeDate('prev')}/>
            <div className="forest__forestquestion__diary-date-container">
              {getDaysArray().map((day, i) => (
                <div
                  key={i}
                  className={`forest__forestquestion__diary-date-round ${day.toDateString() === selectedDate.toDateString() ? 'forest__forestquestion__diary-date-round--today' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  {getDay(day)} 
                </div>
              ))}
            </div>
            <img src={right_arrow} className="forest__forestquestion__diary-date-arrow" alt="right_arrow" onClick={() => changeDate('next')}/>
          </div>
          <div className="forest__forestquestion__diary-title-edit"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
          >
            {title}
          </div>
          <div className="forest__forestquestion__diary-another">
            <div className="forest__forestquestion__diary-another-reveal">
              {['only', 'subscribe', 'all'].map((className, index) => (
                <div
                  key={index}
                  className={`forest__forestquestion__diary-another-reveal-btn forest__forestquestion__diary-another-reveal-btn--${className} ${selectedDiv === index ? 'forest__checklist__diary-another-reveal-btn--selected' : ''}`}
                  onClick={() => handleDivClick(index)}
                >
                  {className}
                </div>
              ))}
            </div>
            <div className="forest__forestquestion__diary-another-submit" onClick={handleSubmit}>발행</div>
          </div>
          <div className="forest__forestquestion__diary-texts">
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

      {showTodayQuestionPopup && (
        <TodayQuestionPopup 
          question={todayQuestion} 
          question_id={question_id} 
          initialAnswer={initialAnswer} 
          initialPhoto={initialPhoto} 
          onClose={handleSaveAnswer}
          onDelete={handleDeleteAnswerFromPopup}
        />
      )}
    </div>
  );
};

export default ForestQuestion;
