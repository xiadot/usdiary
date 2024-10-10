import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../../assets/css/forestquestion.css';

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

export default TodayQuestionPopup;
