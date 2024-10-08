// cityDiary.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Viewer, Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import city from '../assets/images/city.png';
import DateSelector from './dateSelector'; // DateSelector 컴포넌트 import
import RevealOptions from './revealOptions'; // RevealOptions 컴포넌트 import

const CityComponent = () => {
    const location = useLocation();
    const { diary } = location.state || {};

    const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜
    const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜
    const [title, setTitle] = useState(''); // 제목
    const [editorData, setEditorData] = useState(''); // 에디터 내용
    const [access_level, setSelectedDiv] = useState(0); // 공개범위
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

        const selectedDate = new Date(date).toDateString();
        const todayDate = today.toDateString();
        const yesterdayDate = yesterday.toDateString();

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

    const onChangeGetHTML = () => {
        if (editorRef.current && !diary) {
            const data = editorRef.current.getInstance().getHTML();
            setEditorData(data);
            const firstImageUrl = extractFirstImageUrl(data);
            setFirstImageUrl(firstImageUrl);
        }
    };

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
        <div className="city__diary">
            <div className='cityDiary_top'>
                <img src={city} className="city__diary-image" alt="city" />
                <div className="city__diary-title">Today's City</div>
            </div>
            <div className="city__diary-date">
                <DateSelector
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    onDateClick={handleDateClick}
                    theme="city"
                />
            </div>
            <div className="city__diary-title-edit">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={diaryData ? diaryData.diary_title : "제목"}
                    className="city__diary-title-edit-input"
                    spellCheck={false}
                    readOnly={!!diary}
                />
            </div>
            <div className="city__diary-another">
              <RevealOptions selectedDiv={access_level} onDivClick={handleDivClick} />
              {!diary && ( // diary가 없는 경우에만 제출 버튼을 보여줌
                <div className="city__diary-another-submit" onClick={handleSubmit}>발행</div>
              )}
            </div>
            <div className="city__diary-texts">
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
    );
};

export default CityComponent;
