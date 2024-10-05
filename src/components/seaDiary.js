import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import sea from '../assets/images/sea.png';

const SeaComponent = () => {
    const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜
    const [createdAt, setSelectedDate] = useState(new Date()); // 선택된 날짜
    const [diary_title, setTitle] = useState(''); // 제목
    const [diary_content, setEditorData] = useState(''); // 에디터 내용
    const [access_level, setSelectedDiv] = useState(0); // 공개범위
    const editorRef = useRef(); // 에디터 ref

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
    }
  };

  // 오늘 날짜와 전날 날짜만 hover 지정을 위해 id를 부여하는 핸들러
  const getIdForDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // 전날 계산
  
    const todayDateStr = today.toDateString();
    const yesterdayDateStr = yesterday.toDateString();
    const dateStr = new Date(date).toDateString();
  
    if (dateStr === todayDateStr) {
      return 'today';
    } else if (dateStr === yesterdayDateStr) {
      return 'yesterday';
    }
    return ''; // 오늘과 전날이 아니면 빈 문자열 반환
  };

  // 공개범위 클릭 핸들러
  const handleDivClick = (index) => {
    setSelectedDiv(index);
  };

  // 에디터 내용 HTML로 변환하여 상태에 저장
  const onChangeGetHTML = () => {
    if (editorRef.current) {
      const data = editorRef.current.getInstance().getHTML();
      setEditorData(data);
    }
  };

  // 에디터 내용에서 이미지 URL만 추출하는 함수
  const getImageUrlsFromEditor = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const images = doc.querySelectorAll('img');
    
    const imageUrls = [];
    images.forEach((img, index) => {
      imageUrls.push({ index, src: img.getAttribute('src') });
    });

    return imageUrls.length === 0 ? [] : imageUrls;
  };


  // 제출 핸들러
  const handleSubmit = async () => {
    const images = getImageUrlsFromEditor(diary_content);
    const img_index = images.length === 0 ? null : images;

    const diaryData = {
      createdAt,      // 발행 시 날짜
      diary_title,    // 발행 시 제목
      access_level,   // 발행 시 공개범위
      diary_content,  // 발행 시 에디터 내용
      img_index,  // 에디터 내용의 이미지 인덱스
      board_id: 3 // 바다
    };
  
    try {
      // 서버로 POST 요청
      const response = await axios.post('http://localhost:3001/diaries', diaryData);
      console.log('서버 응답: ', response.data); // 서버 응답 확인
    } catch (error) {
      console.error('서버로 데이터 전송 실패: ', error);
    }
  };

  // 초기 렌더링 시 에디터 초기화
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML(''); // 에디터 초기화
    }
  }, []);

  // 현재 날짜를 문자열로 반환
  const getDay = (date) => date.getDate(); // 일(day)만 반환

  // 오늘 날짜를 기준으로 7일 간의 날짜 배열 생성
  const getDaysArray = () => {
    const today = new Date(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() - 3 + i); // 오늘 날짜를 가운데로 위치시키기 위해 조정
      return day;
    });
  };
    
  return (
  <div className="sea__diary">
    <div className='seaDiary_top'>
      <img src={sea} className="sea__diary-image" alt="sea" />
      <div className="sea__diary-title">Today's Sea</div>
    </div>
    <div className="sea__diary-date">
      <div className="sea__diary-date-container">
        {getDaysArray().map((day, i) => (
          <div
            key={i}
            id={getIdForDate(day)}
            className={`sea__diary-date-round ${day.toDateString() === createdAt.toDateString() ? 'sea__diary-date-round--today' : ''}`}
            onClick={() => handleDateClick(day)}
          >
            {getDay(day)}
          </div>
        ))}
      </div>
    </div>
    <div className="sea__diary-title-edit">
      <input
          type="text"
          value={diary_title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="sea__diary-title-edit-input"
          spellCheck={false}
      />
    </div>
    <div className="sea__diary-another">
    <div className="sea__diary-another-reveal">
        {['only', 'subscribe', 'all'].map((className, index) => (
          <div
            key={index}
            className={`sea__diary-another-reveal-btn sea__diary-another-reveal-btn--${className} ${access_level === index ? 'sea__diary-another-reveal-btn--selected' : ''}`}
            onClick={() => handleDivClick(index)}
          >
            {className}
          </div>
        ))}
      </div>
      <div className="sea__diary-another-submit" onClick={handleSubmit}>발행</div>
    </div>
    <div className="sea__diary-texts">
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
  );
};

export default SeaComponent;
