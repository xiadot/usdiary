import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import Menu from "../../components/menu";

import '../../assets/css/special_day.css';
import sea from '../../assets/images/sea.png';
import left_arrow from '../../assets/images/left_arrow.png';
import right_arrow from '../../assets/images/right_arrow.png';

import place_nature from '../../assets/images/place_nature.png';
import place_city from '../../assets/images/place_city.png';
import back_arrow from '../../assets/images/back_arrow.png';

import sea_illustration from '../../assets/images/sea_illustration.png';
import mountain from '../../assets/images/mountain.png';
import park from '../../assets/images/park.png';
import river from '../../assets/images/river.png';
import stream from '../../assets/images/stream.png';
import valley from '../../assets/images/valley.png';

import cafe from '../../assets/images/cafe.png';
import library from '../../assets/images/library.png';
import restaurant from '../../assets/images/restaurant.png';
import theater from '../../assets/images/theater.png';
import gallery from '../../assets/images/gallery.png';
import shoppingmall from '../../assets/images/shoppingmall.png';
import themepark from '../../assets/images/themepark.png';
import stadium from '../../assets/images/stadium.png';
import auditorium from '../../assets/images/auditorium.png';

import coffee from '../../assets/images/coffee.png';
import seashell from '../../assets/images/seashell.png';
import umbrage from '../../assets/images/umbrage.png';
import flower from '../../assets/images/flower.png';
import duck from '../../assets/images/duck.png';
import bicycle from '../../assets/images/bicycle.png';
import watermelon from '../../assets/images/watermelon.png';
import book from '../../assets/images/book.png';
import plate from '../../assets/images/plate.png';
import film from '../../assets/images/film.png';
import palette from '../../assets/images/palette.png';
import shoppingbag from '../../assets/images/shoppingbag.png';
import balloon from '../../assets/images/balloon.png';
import uniform from '../../assets/images/uniform.png';
import ticket from '../../assets/images/ticket.png';

import PlaceList from './PlaceList';

// 체크리스트 페이지 전체화면 컴포넌트
const SpecialDay = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [editorData, setEditorData] = useState('');
  const [selectedDiv, setSelectedDiv] = useState(0);
  const editorRef = useRef();
  const [emotion, setEmotion] = useState('');
  const [memo, setMemo] = useState('');
  const [visibleDiv, setVisibleDiv] = useState('totalPlace');
  const [places, setPlaces] = useState([]);

  const handleSave = () => {
    console.log('visibleDiv:', visibleDiv);
    console.log('오늘의 기분:', emotion);
    console.log('한 줄 메모:', memo);
  };

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

  const handleDivClick = (index) => {
    setSelectedDiv(index);
  };

  // HTML을 가져오는 기존 함수
  const onChangeGetHTML = () => {
    if (editorRef.current) {
      const data = editorRef.current.getInstance().getHTML();
      setEditorData(data); // 가져온 HTML 데이터를 상태에 저장
    }
  };

  // 커스텀 이미지 추가 핸들러
  const handleImageUpload = (blob, callback) => {
    const reader = new FileReader();
    reader.onload = () => {
      // 이미지 URL 생성
      const url = reader.result;
      callback(url, 'alt text'); // 에디터에 URL과 텍스트 삽입

      // ResizableImage 컴포넌트를 삽입할 수 있게 HTML로 삽입
      const editorInstance = editorRef.current.getInstance();
      const imgHtml = `<div class="custom-image-wrapper" style="position:relative; display:inline-block;"><img src="${url}" alt="custom" /></div>`;
      editorInstance.insertHTML(imgHtml); // HTML을 에디터에 삽입
    };
    reader.readAsDataURL(blob);
  };

  const handleSubmit = () => {
    console.log("발행 시 날짜: ", selectedDate);
    console.log("발행 시 제목: ", title);
    console.log("발행 시 공개범위: ", selectedDiv);
    console.log("발행 시 에디터 내용: ", editorData);
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML('');
    }
  }, []);

  const getDay = (date) => date.getDate(); 

  const getDaysArray = () => {
    const today = new Date(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() - 3 + i);
      return day;
    });
  };

  const handleToggleDiv = (currentDiv, targetDiv) => {
    setVisibleDiv(visibleDiv === currentDiv ? targetDiv : currentDiv);
  };

  // 자연 - 장소 이동 핸들러
  const handleToggleDiv1 = () => handleToggleDiv('totalPlace', 'naturePlace');

  // 도시 - 장소 이동 핸들러
  const handleToggleDiv2 = () => handleToggleDiv('totalPlace', 'cityPlace');

  // 장소 - 바다 이동 핸들러
  const handleToggleDiv3 = () => handleToggleDiv('naturePlace', 'sea');

  // 장소 - 산 이동 핸들러
  const handleToggleDiv4 = () => handleToggleDiv('naturePlace', 'mountain');

  // 장소 - 공원 이동 핸들러
  const handleToggleDiv5 = () => handleToggleDiv('naturePlace', 'park');

  // 장소 - 강 이동 핸들러
  const handleToggleDiv6 = () => handleToggleDiv('naturePlace', 'river');

  // 장소 - 하천 이동 핸들러
  const handleToggleDiv7 = () => handleToggleDiv('naturePlace', 'stream');

  // 장소 - 계곡 이동 핸들러
  const handleToggleDiv8 = () => handleToggleDiv('naturePlace', 'valley');

  // 장소 - 카페 이동 핸들러
  const handleToggleDiv9 = () => handleToggleDiv('cityPlace', 'cafe');

  // 장소 - 도서관 이동 핸들러
  const handleToggleDiv10 = () => handleToggleDiv('cityPlace', 'library');

  // 장소 - 식당 이동 핸들러
  const handleToggleDiv11 = () => handleToggleDiv('cityPlace', 'restaurant');

  // 장소 - 극장 이동 핸들러
  const handleToggleDiv12 = () => handleToggleDiv('cityPlace', 'theater');

  // 장소 - 미술관 이동 핸들러
  const handleToggleDiv13 = () => handleToggleDiv('cityPlace', 'gallery');

  // 장소 - 쇼핑몰 이동 핸들러
  const handleToggleDiv14 = () => handleToggleDiv('cityPlace', 'shoppingmall');

  // 장소 - 테마파크 이동 핸들러
  const handleToggleDiv15 = () => handleToggleDiv('cityPlace', 'themepark');

  // 장소 - 경기장 이동 핸들러
  const handleToggleDiv16 = () => handleToggleDiv('cityPlace', 'stadium');

  // 장소 - 공연장 이동 핸들러
  const handleToggleDiv17 = () => handleToggleDiv('cityPlace', 'auditorium');

  
  // 가정: 데이터를 서버에서 불러오는 경우
  useEffect(() => {
    if (visibleDiv === 'sea') {
      const seaData = [
        { emotion: "설렘", content: "바닷바람이 나를 설레게 해요." },
        { emotion: "기대감", content: "무언가 좋은 일이 일어날 것만 같은 느낌!" },
        { emotion: "평화로움", content: "파도 소리가 마음을 편안하게 해요." },
        { emotion: "행복", content: "햇살과 바다의 조화가 행복을 줘요." },
        { emotion: "흥분", content: "해변에서의 활동이 흥미진진해요!" },
      ];
      setPlaces(seaData);
    } else if (visibleDiv === 'mountain') {
      const mountainData = [
        { emotion: "즐거움", content: "여기는 버블처럼 30글자 제한있어요 참고바랍니다요용요요" },
        { emotion: "평화로움", content: "바람소리와 함께하는 편안한 시간입니다." },
        { emotion: "설렘", content: "산 정상에서의 경치가 정말 아름다워요." },
        { emotion: "기대감", content: "등산 후 보상으로 맛있는 음식을 기대해요." },
        { emotion: "상쾌함", content: "청량한 공기와 산의 향기가 상쾌해요." }
      ];
      setPlaces(mountainData);
    } else if (visibleDiv === 'park') {
      const parkData = [
        { emotion: "감정", content: "감정입니다" },
      ];
      setPlaces(parkData);
    } else if (visibleDiv === 'river') {
      const riverData = [
        { emotion: "감정", content: "감정입니다" },
      ];
      setPlaces(riverData);
    } else if (visibleDiv === 'stream') {
      const streamData = [
        { emotion: "감정", content: "감정입니다" },
      ];
      setPlaces(streamData);
    } else if (visibleDiv === 'valley') {
      const valleyData = [
        { emotion: "감정", content: "감정입니다" },
      ];
      setPlaces(valleyData);
    } else if (visibleDiv === 'cafe') {
      const cafeData = [
        { emotion: "감정", content: "감정입니다" },
      ];
      setPlaces(cafeData);
    } else if (visibleDiv === 'library') {
      const libraryData = [
        { emotion: "감정", content: "감정입니다" },
      ];
      setPlaces(libraryData);
    } else if (visibleDiv === 'restaurant') {
      const restaurantData = [
        { emotion: "감정", content: "감정입니다" },
      ];
      setPlaces(restaurantData);
    } else if (visibleDiv === 'theater') {
      const theaterData = [
        { emotion: "감정", content: "감정입니다" },
      ];
      setPlaces(theaterData);
    } else if (visibleDiv === 'gallery') {
      const galleryData = [
        { emotion: "감정", content: "감정입니다" },
      ];
      setPlaces(galleryData);
    } else if (visibleDiv === 'shoppingmall') {
      const shoppingmallData = [
        { emotion: "감정", content: "감정입니다" },
      ];
      setPlaces(shoppingmallData);
    } else if (visibleDiv === 'themepark') {
      const themeparkData = [
        { emotion: "감정", content: "감정입니다" },
      ];
      setPlaces(themeparkData);
    } else if (visibleDiv === 'stadium') {
      const stadiumData = [
        { emotion: "감정", content: "감정입니다" },
      ];
      setPlaces(stadiumData);
    } else if (visibleDiv === 'auditorium') {
      const auditoriumData = [
        { emotion: "감정", content: "감정입니다" },
      ];
      setPlaces(auditoriumData);
    } else {
      // 기본 데이터 또는 빈 데이터 설정
      setPlaces([]);
    }
  }, [visibleDiv]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // visibleDiv 값을 쿼리 파라미터로 포함하여 URL을 만듭니다.
  //       const response = await fetch(`/api/data?place=${visibleDiv}`);
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json();
  //       setPlaces(data);
  //     } catch (error) {
  //       console.error('Fetch error:', error);
  //       setPlaces([]);
  //     }
  //   };

  //   fetchData();
  // }, [visibleDiv]);
  
  const handleToggle = (divName) => () => {
    setVisibleDiv(visibleDiv === divName ? 'totalPlace' : divName);
  };
  
  return (
    <div className="wrap">
      <Menu/>
      
      <div className="sea__special">
        <div className="sea__special__place">
            <div className="sea__special__place-title">
                <div className="sea__special__place-title-name">Today’s Place</div>
            </div>

            {visibleDiv === 'totalPlace' && (
              <div className="sea__special__place-choice1">     
                <div className="sea__special__place-choice1-box" onClick={handleToggleDiv1}>
                  <img src={place_nature} alt='place_nature'/>
                  <div id="totalPlace" className="sea__special__place-choice1-box-name">자연</div>
                </div>
                <div className="sea__special__place-choice1-box" onClick={handleToggleDiv2}>
                  <img src={place_city} alt='place_city'/>
                  <div id="totalPlace" className="sea__special__place-choice1-box-name">도시</div>
                </div>
              </div>
            )}

            {visibleDiv === 'naturePlace' && (
              <div className="sea__special__place-choice2">
                <div className="sea__special__place-choice2-top">
                  <div onClick={handleToggleDiv1}>
                    <img src={back_arrow} alt='back_arrow' className="back_arrow"/>
                  </div>
                  <div className="sea__special__place-choice2-top-name">자연</div>
                </div>
                <hr/>
                <div className="sea__special__place-choice2-places">
                  <div className="sea__special__place-choice2-places-left" id='naturePlace'>
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv3}><img src={sea_illustration} alt='sea_illustration' id='sea_illustration'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv3}>바다</div>
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv5}><img src={park} alt='park' id='park'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv5}>공원</div>
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv7}><img src={stream} alt='stream' id='stream'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv7}>하천</div>
                  </div>
                  <div className="sea__special__place-choice2-places-right">
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv4}><img src={mountain} alt='mountain' id='mountain'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv4}>산</div>
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv6}><img src={river} alt='river' id='river'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv6}>강</div>
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv8}><img src={valley} alt='valley' id='valley'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv8}>계곡</div>
                  </div>
                </div>
              </div>
            )}      

            {visibleDiv === 'cityPlace' && (
              <div className="sea__special__place-choice2">
                <div className="sea__special__place-choice2-top">
                  <div onClick={handleToggleDiv2}>
                    <img src={back_arrow} alt='back_arrow' className="back_arrow"/>
                  </div>
                  <div className="sea__special__place-choice2-top-name">도시</div>
                </div>
                <hr/>
                <div className="sea__special__place-choice2-places">
                  <div className="sea__special__place-choice2-places-left" id='cityPlace'>
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv9}><img src={cafe} alt='cafe' id='cafe'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv9}>카페</div>
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv11}><img src={restaurant} alt='restaurant' id='restaurant'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv11}>식당</div>
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv13}><img src={gallery} alt='gallery' id='gallery'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv13}>미술관</div>
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv15}><img src={themepark} alt='themepark' id='themepark'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv15}>테마파크</div>
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv17}><img src={auditorium} alt='auditorium' id='auditorium'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv17}>공연장</div>
                  </div>
                  <div className="sea__special__place-choice2-places-right">
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv10}><img src={library} alt='library' id='library'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv10}>도서관</div>
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv12}><img src={theater} alt='theater' id='theater'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv12}>극장</div>
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv14}><img src={shoppingmall} alt='shoppingmall' id='shoppingmall'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv14}>쇼핑몰</div>
                    <div className="sea__special__place-choice2-places-left-thg" onClick={handleToggleDiv16}><img src={stadium} alt='stadium' id='stadium'/></div>
                    <div className="sea__special__place-choice2-places-left-name" onClick={handleToggleDiv16}>경기장</div>
                  </div>
                </div>
              </div>
            )}

            {visibleDiv === 'sea' && (
              <PlaceList
                places={places}
                image={seashell}
                handleToggle={handleToggle('naturePlace')}
                title="바다"
                imageId="seashell"
              />
            )}
            
            {visibleDiv === 'mountain' && (
              <PlaceList
                places={places}
                image={umbrage}
                handleToggle={handleToggle('naturePlace')}
                title="산"
                imageId="umbrage"
              />
            )}

            {visibleDiv === 'park' && (
              <PlaceList
                places={places}
                image={flower}
                handleToggle={handleToggle('naturePlace')}
                title="공원"
                imageId="flower"
              />
            )}

            {visibleDiv === 'river' && (
              <PlaceList
                places={places}
                image={duck}
                handleToggle={handleToggle('naturePlace')}
                title="강"
                imageId="duck"
              />
            )}
            
            {visibleDiv === 'stream' && (
              <PlaceList
                places={places}
                image={bicycle}
                handleToggle={handleToggle('naturePlace')}
                title="하천"
                imageId="bicycle"
              />
            )}

            {visibleDiv === 'valley' && (
              <PlaceList
                places={places}
                image={watermelon}
                handleToggle={handleToggle('naturePlace')}
                title="계곡"
                imageId="watermelon"
              />
            )}
            
            {visibleDiv === 'cafe' && (
              <PlaceList
                places={places}
                image={coffee}
                handleToggle={handleToggle('cityPlace')}
                title="카페"
                imageId="coffee"
              />
            )}

            {visibleDiv === 'library' && (
              <PlaceList
                places={places}
                image={book}
                handleToggle={handleToggle('cityPlace')}
                title="도서관"
                imageId="book"
              />
            )}

            {visibleDiv === 'restaurant' && (
              <PlaceList
                places={places}
                image={plate}
                handleToggle={handleToggle('cityPlace')}
                title="식당"
                imageId="plate"
              />
            )}

            {visibleDiv === 'theater' && (
              <PlaceList
                places={places}
                image={film}
                handleToggle={handleToggle('cityPlace')}
                title="극장"
                imageId="film"
              />
            )}  

            {visibleDiv === 'gallery' && (
              <PlaceList
                places={places}
                image={palette}
                handleToggle={handleToggle('cityPlace')}
                title="미술관"
                imageId="palette"
              />
            )} 
            
            {visibleDiv === 'shoppingmall' && (
              <PlaceList
                places={places}
                image={shoppingbag}
                handleToggle={handleToggle('cityPlace')}
                title="쇼핑몰"
                imageId="shoppingbag"
              />
            )} 
            
            {visibleDiv === 'themepark' && (
              <PlaceList
                places={places}
                image={balloon}
                handleToggle={handleToggle('cityPlace')}
                title="테마파크"
                imageId="balloon"
              />
            )} 

            {visibleDiv === 'stadium' && (
              <PlaceList
                places={places}
                image={uniform}
                handleToggle={handleToggle('cityPlace')}
                title="경기장"
                imageId="uniform"
              />
            )} 

            {visibleDiv === 'auditorium' && (
              <PlaceList
                places={places}
                image={ticket}
                handleToggle={handleToggle('cityPlace')}
                title="공연장"
                imageId="ticket"
              />
            )} 

            <div className="sea__special__place-emotion">
                <input placeholder='오늘의 기분 (10자 제한)' spellCheck="false" maxlength='10' value={emotion} onChange={(e) => setEmotion(e.target.value)}/>
            </div>
            
            <div className="sea__special__place-memo">
                <textarea placeholder='한 줄 메모 (30자 제한)' spellCheck="false" maxlength='30' value={memo} onChange={(e) => setMemo(e.target.value)}/>
            </div>

            <div className="sea__special__place-save" onClick={handleSave}>저장</div>
        </div>

        <div className="sea__special__diary">
            <div className="sea__special__diary-top">
            <img src={sea} className="sea__special__diary-top-image" alt="sea" />
            <div className="sea__special__diary-top-title">Today's Sea</div>
            </div>
            <div className="sea__special__diary-date">
            <img src={left_arrow} className="sea__special__diary-date-arrow" alt="left_arrow" onClick={() => changeDate('prev')}/>
            <div className="sea__special__diary-date-container">
                {getDaysArray().map((day, i) => (
                <div
                    key={i}
                    className={`sea__special__diary-date-round ${day.toDateString() === selectedDate.toDateString() ? 'sea__special__diary-date-round--today' : ''}`}
                    onClick={() => handleDateClick(day)}
                >
                    {getDay(day)} 
                </div>
                ))}
            </div>
            <img src={right_arrow} className="sea__special__diary-date-arrow" alt="right_arrow" onClick={() => changeDate('next')}/>
            </div>
            <div className="sea__special__diary-title-edit">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                className="sea__special__diary-title-edit-input"
                spellCheck={false}
            />
            </div>
            <div className="sea__special__diary-another">
            <div className="sea__special__diary-another-reveal">
                {['only', 'subscribe', 'all'].map((className, index) => (
                <div
                    key={index}
                    className={`sea__special__diary-another-reveal-btn sea__special__diary-another-reveal-btn--${className} ${selectedDiv === index ? 'sea__special__diary-another-reveal-btn--selected' : ''}`}
                    onClick={() => handleDivClick(index)}
                >
                    {className}
                </div>
                ))}
            </div>
            <div className="sea__special__diary-another-submit" onClick={handleSubmit}>발행</div>
            </div>
            <div className="sea__special__diary-texts">
            <Editor
                toolbarItems={[
                ['heading', 'bold', 'italic', 'strike'],
                ['image', 'link']
                ]}
                hooks={{
                  addImageBlobHook: handleImageUpload, // 이미지 업로드를 처리
                }}
                height="500px"
                initialEditType="wysiwyg"
                previewStyle="vertical"
                ref={editorRef}
                onChange={onChangeGetHTML}
                hideModeSwitch={true}
            />
            </div>   
        </div>
      </div>
    </div>
  );
};


export default SpecialDay;
