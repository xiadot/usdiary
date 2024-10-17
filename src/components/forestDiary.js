import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Viewer, Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import axios from 'axios'; // axios 임포트

import tree from '../assets/images/tree.png';
import DateSelector from './dateSelector'; // DateSelector 컴포넌트 불러오기
import RevealOptions from './revealOptions'; // RevealOptions 컴포넌트 불러오기

const ForestComponent = () => {
    const location = useLocation();
    const { diary } = location.state || {};

    const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜
    const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜
    const [diary_title, setTitle] = useState(''); // 제목
    const [diary_content, setEditorData] = useState(''); // 에디터 내용
    const [access_level, setSelectedDiv] = useState(0); // 공개범위
    const [diaryData, setDiaryData] = useState(null);
    const [post_photo, setFirstImageUrl] = useState(null);
    const editorRef = useRef(); // 에디터 ref

    // Axios로 다이어리 데이터 fetch
    const fetchDiaryData = useCallback(async () => {
      try {
        const response = await axios.get(`/api/diaries`, {
          params: { date: selectedDate.toISOString().split('T')[0] } // 날짜를 query parameter로 전달
        });
        setDiaryData(response.data); // 불러온 데이터 설정
        setTitle(response.data.diary_title); // 제목 업데이트
        if (editorRef.current) {
          editorRef.current.getInstance().setHTML(response.data.diary_content); // 에디터 내용 설정
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
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem('token');
    
      const diaryData = {
        createdAt: selectedDate,
        diary_title: diary_title,
        diary_content: diary_content,
        access_level: access_level,
        post_photo: post_photo,
        board_id: 1
      };
  
      try {
        const response = await axios.post('/diaries', diaryData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        console.log('저장 완료:', response.data);
      } catch (error) {
        console.error("Error submitting diary:", error);
      }
    };

    return (
        <div className="forest__diary">
            <div className='forestDiary_top'>
                <img src={tree} className="forest__diary-tree" alt="tree" />
                <div className="forest__diary-title">Today's Forest</div>
            </div>
            <div className="forest__diary-date">
                <DateSelector 
                    currentDate={currentDate} 
                    selectedDate={selectedDate} 
                    onDateClick={handleDateClick} 
                    theme="forest"
                />
            </div>
            <div className="forest__diary-title-edit">
                <input
                    type="text"
                    value={diary_title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={diaryData ? diaryData.diary_title : "제목"}
                    className="forest__diary-title-edit-input"
                    spellCheck={false}
                    readOnly={!!diary}
                />
            </div>
            <div className="forest__diary-actions">
                <RevealOptions selectedDiv={access_level} onDivClick={handleDivClick} /> {/* RevealOptions 컴포넌트 사용 */}
                {!diary && ( // diary가 없는 경우에만 제출 버튼을 보여줌
                <div className="forest__diary-another-submit" onClick={handleSubmit}>발행</div>
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
    );
};

export default ForestComponent;
