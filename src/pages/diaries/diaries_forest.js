import { useNavigate, useLocation } from 'react-router-dom';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Viewer, Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import Menu from "../../components/menu";
import DateSelector from "../../components/dateSelector";
import RevealOptions from "../../components/revealOptions";

import '../../assets/css/diaries_forest.css';
import tree from '../../assets/images/tree.png';
import todays_question from '../../assets/images/Todays_Question_forest.png';

const ForestDiary = () => {
  // 서버 이동 코드
  const navigate = useNavigate();
  const location = useLocation();
  const { diary } = location.state || {};

  const handleClick = () => {
    navigate('/forestquestion');
  };

  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜
  const [title, setTitle] = useState(''); // 제목
  const [editorData, setEditorData] = useState(''); // 에디터 내용
  const [selectedDiv, setSelectedDiv] = useState(0); // 공개범위
  const [diaryData, setDiaryData] = useState(null);
  const [firstImageUrl, setFirstImageUrl] = useState(null);
  const editorRef = useRef(); // 에디터 ref

  const fetchDiaryData = useCallback(async () => {
    try {
      const response = await fetch(`/api/diaries?date=${selectedDate.toISOString().split('T')[0]}`); // API 엔드포인트에 날짜를 기반으로 요청
      const data = await response.json();
      setDiaryData(data); // 불러온 데이터 설정
      setTitle(data.diary_title); // 제목 업데이트
      if (editorRef.current) {
        editorRef.current.getInstance().setHTML(data.diary_content); // 에디터 내용 설정
      }
    } catch (error) {
      console.error("Error fetching diary data:", error);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (diary) {
      setTitle(diary.diary_title); // 제목 업데이트
      if (editorRef.current) {
        editorRef.current.getInstance().setHTML(diary.diary_content); // 내용 설정
      }
    } else {
      fetchDiaryData(); // 다이어리가 없을 때만 데이터 fetch
    }
  }, [diary, fetchDiaryData]);

  // 선택된 날짜로 currentDate 업데이트
  const handleDateClick = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1); // 전날을 계산

    // 날짜 비교를 위해 선택된 날짜, 전날, 오늘을 문자열로 변환
    const selectedDate = new Date(date).toDateString(); // 클릭한 날짜
    const todayDate = today.toDateString(); // 오늘 날짜
    const yesterdayDate = yesterday.toDateString(); // 전날 날짜

    // 선택된 날짜가 전날이거나 오늘이면 업데이트
    if (selectedDate === todayDate || selectedDate === yesterdayDate) {
      setSelectedDate(date);
      setCurrentDate(new Date(date)); // 클릭한 날짜를 가운데로 위치
      fetchDiaryData();
    }
  };

  // 공개범위 클릭 핸들러
  const handleDivClick = (index) => {
    setSelectedDiv(index);
  };

  const extractFirstImageUrl = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const img = doc.querySelector('img'); // 첫 번째 이미지 요소 선택
    return img ? img.src : null; // 이미지가 있으면 src 속성을 반환
  };

  // 에디터 내용 HTML로 변환하여 상태에 저장
  const onChangeGetHTML = () => {
    if (editorRef.current) {
        const data = editorRef.current.getInstance().getHTML();
        const updatedHTML = data.replace(/<img.*?>/g, (imgTag) => {
            return `
                <div style="display: flex; align-items: flex-start; margin-bottom: 10px;">
                    ${imgTag}
                    <div contenteditable="true" style="margin-left: 10px; border: 1px solid #ccc; padding: 5px; min-height: 50px; width: 100%;">
                        <p>여기에 글을 입력하세요...</p>
                    </div>
                </div>
            `;
        });
        setEditorData(updatedHTML);
        const firstImageUrl = extractFirstImageUrl(updatedHTML);
        setFirstImageUrl(firstImageUrl);
    }
};


  // 제출 핸들러
  const handleSubmit = async () => {
    const diaryData = {
      createdAt: selectedDate,
      diary_title: title,
      diary_content: editorData,
      post_photo: firstImageUrl // 첫 번째 이미지 URL 저장
    };

    try {
      const response = await fetch('/diaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diaryData), // 서버로 데이터 전송
      });
      const result = await response.json();
      console.log('저장 완료:', result);
    } catch (error) {
      console.error("Error submitting diary:", error);
    }
  };

  return (
    <div className="wrap">
      <Menu />

      {/* 다이어리 */}
      <div className="forest">
        {/* 오늘의 질문 */}
        <div className="forest__question" onClick={handleClick}>
          <img src={todays_question} className="forest__question-image" alt="todays_question" />
        </div>
        {/* 일기작성 */}
        <div className="forest__diary">
          <img src={tree} className="forest__diary-tree" alt="tree" />
          <div className="forest__diary-title">Today's Forest</div>
          <div className="forest__diary-date">
            <div className="forest__diary-date-container">
              <DateSelector
                currentDate={currentDate}
                selectedDate={selectedDate}
                onDateClick={handleDateClick}
                theme="forest"
              />
            </div>
          </div>
          <div className="forest__diary-title-edit">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={diaryData ? diaryData.diary_title : "제목"}
              className="forest__diary-title-edit-input"
              spellCheck={false}
              readOnly={!!diary}
            />
          </div>
          <div className="forest__diary-actions">
            <RevealOptions selectedDiv={selectedDiv} onDivClick={handleDivClick} />
            {!diary && ( // diary가 없는 경우에만 제출 버튼을 보여줌
              <div className="forest__diary-submit" onClick={handleSubmit}>발행</div>
            )}
          </div>
          <div className="forest__diary-texts">
            {diary ? (
              <Viewer initialValue={`<div style="padding: 20px; font-size: large;">${diary.diary_content}</div>`} /> // 다이어리 데이터가 있을 때 Viewer로 내용만 표시
            ) : (
              <Editor
                toolbarItems={[['heading', 'bold', 'italic', 'strike'], ['image', 'link']]}
                height="100%"
                initialEditType="wysiwyg"
                ref={editorRef}
                onChange={onChangeGetHTML}
                hideModeSwitch={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>

  );
};



export default ForestDiary;