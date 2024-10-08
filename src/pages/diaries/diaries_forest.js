import React, { useState } from 'react';

import Menu from "../../components/menu";
import ForestComponent from "../../components/forestDiary";
import Question from './forestquestion';

import '../../assets/css/diaries_forest.css';
import todays_question from '../../assets/images/Todays_Question_forest.png';

const ForestDiary = () => {
  const [showQuestion, setShowQuestion] = useState(false);

  const switchToQuestion = () => {
    setShowQuestion(true);
  };

  return (
    <div className={`wrap ${showQuestion ? 'page2' : 'page1'}`}>
    <Menu/>
    {!showQuestion ? (
      <div>
        {/* 페이지1 */}
        <div className="forest">
          {/* 오늘의 질문 */}
          <div className="forest__question" onClick={switchToQuestion}>
            <img src={todays_question} className="forest__question-image" alt="todays_question"/>
          </div>
          {/* 일기작성 */}
          <ForestComponent />
        </div>
      </div>
    ) : (
      <div>
        {/* 페이지2 */}
        <div className="forest">
          {/* 오늘의 질문 */}
          <Question />
          {/* 일기작성 */}
          <ForestComponent />
        </div>
    </div>
    )}
  
  </div>
    
  );
};



export default ForestDiary;