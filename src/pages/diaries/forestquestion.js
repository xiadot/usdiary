import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import TodayQuestionPopup from "./todayQuestionPopup";

import '../../assets/css/forestquestion.css';

const ForestQuestion = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [editorData, setEditorData] = useState('');
  const [selectedDiv, setSelectedDiv] = useState(0);
  const [showTodayQuestionPopup, setShowTodayQuestionPopup] = useState(false);
  const [todayQuestionContent, setTodayQuestionContent] = useState('');
  const [todayQuestion, setTodayQuestion] = useState('Question');
  const [question_id, setQuestionId] = useState(null);
  const [initialAnswer, setInitialAnswer] = useState('');
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [diary_id, setDiaryId] = useState(null);  // 변경된 변수
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
        setInitialAnswer(latestAnswer.answer_text || ''); // 변경된 변수
        setInitialPhoto(latestAnswer.answer_photo || null); // 변경된 변수
        setDiaryId(latestAnswer.diary_id || null);  // 변경된 변수

      } catch (error) {
        console.error('Error fetching the question:', error);
        setTodayQuestion('질문을 가져오는 데 실패했습니다.');
      }
    };

    fetchTodayQuestion();
  }, []);

  const handleUpdateAnswer = async () => {
    try {
      const formData = new FormData();
      formData.append('answer_text', initialAnswer);  // 변경된 변수
      if (initialPhoto) {
        formData.append('answer_photo', initialPhoto);  // 변경된 변수
      }

      await axios.patch(`http://localhost:3001/contents/questions/${question_id}/answers/${diary_id}`, formData, {
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
      await axios.delete(`http://localhost:3001/contents/questions/${question_id}/answers/${diary_id}`);  // 변경된 API 경로

      alert('답변이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting the answer:', error);
      alert('답변 삭제에 실패했습니다.');
    }
  };

  return (
    <div>   
      <div className="forest__forestquestion">
        <div className="forest__forestquestion__check">
          <div className="forest__forestquestion__check-title">
            <div className="forest__forestquestion__check-title-name">Today's Question</div>
            <div
              className="forest__forestquestion__check-title-plusbtn"
              onClick={() => setShowTodayQuestionPopup(true)}
            >
              +
            </div>
          </div>
          <div className="forest__forestquestion__check-today-question">
            <div className="today-question-box">
              <div className="today-question-content" dangerouslySetInnerHTML={{ __html: todayQuestionContent }}></div>
              {initialPhoto && (
                <div className="forest__forestquestion__check-today-photo-box">
                  <img src={initialPhoto} alt="answer" className="forest__forestquestion__check-today-photo" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showTodayQuestionPopup && (
        <TodayQuestionPopup
          question={todayQuestion}
          question_id={question_id}
          initialAnswer={initialAnswer}
          initialPhoto={initialPhoto}
          onClose={() => setShowTodayQuestionPopup(false)}
          onDelete={handleDeleteAnswer}
        />
      )}
    </div>
  );
};

export default ForestQuestion;
