import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Viewer, Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import axios from 'axios'; // axios import

import sea from '../assets/images/sea.png';
import DateSelector from './dateSelector'; // DateSelector 컴포넌트 import
import RevealOptions from './revealOptions'; // RevealOptions 컴포넌트 import
import DropdownMenu from './dropdownMenu';

const SeaComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { diary } = location.state || {};

  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜
  const [diary_title, setTitle] = useState(''); // 제목
  const [diary_content, setEditorData] = useState(''); // 에디터 내용
  const [access_level, setSelectedDiv] = useState(0); // 공개범위
  const [diaryData, setDiaryData] = useState(null);
  const [post_photo, setFirstImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef(); // 에디터 ref

  const fetchDiaryData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/diaries?date=${selectedDate.toISOString().split('T')[0]}`); // axios로 API 요청
      const data = response.data;
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
      const createdAtDate = new Date(diary.createdAt);
      setSelectedDate(createdAtDate); // 선택된 날짜 업데이트
      setCurrentDate(createdAtDate);
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
      diary_title: diary_title,
      diary_content: diary_content,
      access_level: access_level,
      post_photo: post_photo,
      board_id: 3
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

  const handleEdit = () => {
    setIsEditing(true); // 편집 모드로 전환
  };

  const handleUpdate = async () => {
    if (!diary) return;

    const updatedDiary = {
      diary_title,
      diary_content: editorRef.current.getInstance().getHTML(),
      access_level,
      post_photo,
    };

    try {
      const formData = new FormData();
      formData.append('diary_title', updatedDiary.diary_title);
      formData.append('diary_content', updatedDiary.diary_content);
      formData.append('access_level', updatedDiary.access_level);
      formData.append('post_photo', updatedDiary.post_photo);

      const response = await fetch(`/diaries/${diary.diary_id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        console.log('수정 완료:', await response.json());
        setIsEditing(false); // 수정 후 편집 모드 해제
      } else {
        console.error('수정 실패:', response.statusText);
      }
    } catch (error) {
      console.error("Error editing diary:", error);
    }
  };


  const handleDelete = async () => {
    try {
      const response = await fetch(`/diaries/${diary.diary_id}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        console.log('삭제 완료');
        navigate('/mypage/myRate');
        // 삭제 후 처리 (예: 목록으로 돌아가기)
      } else {
        console.error('Error deleting diary');
      }
    } catch (error) {
      console.error("Error deleting diary:", error);
    }
  };

  return (
    <div className="sea__diary">
      <div className='seaDiary_top'>
        <img src={sea} className="sea__diary-image" alt="sea" />
        <div className="sea__diary-title">Today's Sea</div>
      </div>
      <div className="sea__diary-date">
        <DateSelector
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
          theme="sea"
        />
      </div>
      <div className="sea__diary-title-edit">
        <input
          type="text"
          value={diary_title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={diaryData ? diaryData.diary_title : "제목"}
          className="sea__diary-title-edit-input"
          spellCheck={false}
          readOnly={!!diary && !isEditing}
        />
      </div>
      <div className="sea__diary-another">
        <RevealOptions selectedDiv={access_level} onDivClick={handleDivClick} />
        {!diary && (
          <div className="sea__diary-another-submit" onClick={handleSubmit}>발행</div>
        )}
        {diary && (
          <>
            {isEditing ? (
              <div className="sea__diary-another-submit" onClick={handleUpdate}>수정 완료</div>
            ) : (
              <DropdownMenu onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </>
        )}
      </div>
      <div className="sea__diary-texts">
        {isEditing || !diary ? (
          <Editor
            toolbarItems={[['heading', 'bold', 'italic', 'strike'], ['image', 'link']]}
            height="100%"
            initialEditType="wysiwyg"
            initialValue={diary ? diary.diary_content : ''} // 다이어리 내용이 없을 경우 빈 문자열
            ref={editorRef}
            onChange={onChangeGetHTML}
            hideModeSwitch={true}
          />
        ) : (
          <Viewer
            initialValue={`<div style="padding: 20px; font-size: large;">${diary ? diary.diary_content : ''}</div>`} // 다이어리 데이터가 있을 때 Viewer로 내용만 표시
          />
        )}
      </div>
    </div>
  );
};

export default SeaComponent;
