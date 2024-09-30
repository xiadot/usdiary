import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/follow.css';
import '../../assets/css/myRate.css';
import Menu from '../../components/menu';
import ProfileMenu from '../../components/profileMenu';
import 'react-datepicker/dist/react-datepicker.css';
import defalut from '../../assets/images/default.png'

const dummyUser = {
    profileImage: 'https://via.placeholder.com/100',
    nickname: '홍길동',
    user_tendency: '숲',
};

const dummyDiaries = [
    { diary_id: 1, user_id: 1, board_id: 1, board_name: '숲', diary_title: '일기 1', diary_content: "<p>오늘은 정말 멋진 날이었다.<strong>볼드처리</strong></p><img src='https://example.com/image1.png' alt='image1'/><p>나무가 아름답게 보였다.</p><img src='https://example.com/image2.png' alt='image2'/><p>하늘도 정말 맑았다.</p>", createdAt: '2024-09-01T10:00:00Z', post_photo: 'https://via.placeholder.com/300' },
    { diary_id: 2, user_id: 1, board_id: 2, board_name: '도시', diary_title: '일기 2', diary_content: '내용 2', createdAt: '2024-09-02T10:00:00Z', post_photo: 'https://via.placeholder.com/300' },
    { diary_id: 3, user_id: 1, board_id: 3, board_name: '바다', diary_title: '일기 3', diary_content: '내용 3', createdAt: '2024-09-03T10:00:00Z', post_photo: 'https://via.placeholder.com/300' },
    { diary_id: 4, user_id: 2, board_id: 1, board_name: '숲', diary_title: '일기 4', diary_content: '내용 4', createdAt: '2024-09-04T11:00:00Z', post_photo: 'https://via.placeholder.com/300' },
    { diary_id: 5, user_id: 2, board_id: 2, board_name: '도시', diary_title: '일기 5', diary_content: '내용 5', createdAt: '2024-09-05T12:00:00Z', post_photo: 'https://via.placeholder.com/300 ' },
    { diary_id: 6, user_id: 2, board_id: 3, board_name: '바다', diary_title: '일기 6', diary_content: '내용 6', createdAt: '2024-09-06T13:00:00Z', post_photo: 'https://via.placeholder.com/300 ' },
    { diary_id: 7, user_id: 3, board_id: 1, board_name: '숲', diary_title: '일기 7', diary_content: '내용 7', createdAt: '2024-09-07T14:00:00Z', post_photo: 'https://via.placeholder.com/300 ' },
    { diary_id: 8, user_id: 3, board_id: 2, board_name: '도시', diary_title: '일기 8', diary_content: '내용 8', createdAt: '2024-09-08T15:00:00Z', post_photo: 'https://via.placeholder.com/300 ' },
    { diary_id: 9, user_id: 3, board_id: 1, board_name: '바다', diary_title: '일기 9', diary_content: '내용 9', createdAt: '2024-09-09T16:00:00Z', post_photo: 'https://via.placeholder.com/300 ' },
    { diary_id: 10, user_id: 1, board_id: 1, board_name: '숲', diary_title: '일기 10', diary_content: '내용 10 나는 오늘 아침에 오후 3시에 일어나서 민서와 같이 햄버거를 시켜먹었다 그리고 나서 뭐햇더라 좀 누워있으니까 애기 옴 그리고 코딩 하기 전에 육바연에서 육연덮밥 시켜 먹었음', createdAt: '2024-09-10T17:00:00Z', post_photo: 'https://via.placeholder.com/300 ' },
    { diary_id: 11, user_id: 1, board_id: 2, board_name: '도시', diary_title: '일기 11', diary_content: '내용 11', createdAt: '2024-09-11T18:00:00Z', post_photo: 'https://via.placeholder.com/300 ' },
    { diary_id: 12, user_id: 4, board_id: 3, board_name: '바다', diary_title: '일기 12', diary_content: '내용 12', createdAt: '2024-09-12T19:00:00Z', post_photo: 'https://via.placeholder.com/300 ' }
];


const MyRate = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [diaryCards, setDiaryCards] = useState([]);
    const navigate = useNavigate();

    const handleDiaryClick = (diary) => {
        console.log(diary);
        switch (diary.board_id) {
            case 1:
                navigate('/forest_diary', { state: { from: 'myRate', diary } });
                break;
            case 2:
                navigate('/city_diary', { state: { from: 'myRate', diary } });
                break;
            case 3:
                navigate('/sea_diary', { state: { diary } });
                break;
            default:
                console.log('Unknown board_id');
        }
    };

    const filterDiariesByPreference = (user_tendency) => {
        // user_id가 1인 일기들로 먼저 필터링
        const userDiaries = dummyDiaries.filter(diary => diary.user_id === 1);

        return userDiaries.filter(diary => {
            const categories = {
                '숲': 1,
                '도시': 2,
                '바다': 3,
            };
            return diary.board_id === categories[user_tendency];
        });
    };

    const preferenceDiaries = filterDiariesByPreference(dummyUser.user_tendency);

    // user_id가 1인 일기들의 총 개수
    const totalDiaries = dummyDiaries.filter(diary => diary.user_id === 1).length;

    const percentage = ((preferenceDiaries.length / totalDiaries) * 100).toFixed(2);


    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];

        // 첫 번째 요일을 가져옴
        const firstDayOfWeek = date.getDay();

        // 그 달의 모든 날짜를 추가
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        // 마지막으로 빈 공간을 첫째 날 앞에 추가
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.unshift(null); // 빈 공간을 null로 표시
        }

        return days;
    };

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

    const getBackgroundColor = (day) => {
        const localDay = new Date(day);
        localDay.setHours(0, 0, 0, 0); // 날짜만 남기기

        const diary = dummyDiaries.find(d => {
            const diaryDate = new Date(d.createdAt);
            diaryDate.setHours(diaryDate.getHours() - 9);
            diaryDate.setHours(0, 0, 0, 0); // 날짜만 남기기

            return d.user_id === 1 && localDay.toDateString() === diaryDate.toDateString();
        });

        switch (diary ? diary.board_id : null) {
            case 1:
                return '#B8D8AD'; // 숲
            case 2:
                return '#D9D9D9'; // 도시
            case 3:
                return '#A5DFDF'; // 바다
            default:
                return '#FFFFFF'; // 일기 없음
        }
    };

    const handleDayClick = (day) => {
        if (day) {
            setSelectedDate(day);
            updateDiaryCards(day);
        }
    };

    const updateDiaryCards = (date) => {
        const diariesOnSelectedDate = dummyDiaries.filter(diary => {
            const diaryDate = new Date(diary.createdAt);
            diaryDate.setHours(diaryDate.getHours() - 9);
            return diaryDate.toDateString() === date.toDateString() && diary.user_id === 1;
        });
        setDiaryCards(diariesOnSelectedDate);
    };

    const handlePreviousDay = () => {
        const previousDate = new Date(selectedDate);
        previousDate.setDate(previousDate.getDate() - 1);
        setSelectedDate(previousDate);
        // 해당 날짜의 일기 필터링
        updateDiaryCards(previousDate);
    };

    const handleNextDay = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setSelectedDate(nextDate);
        // 해당 날짜의 일기 필터링
        updateDiaryCards(nextDate);
    };

    return (
        <div className='wrap'>
            <Menu />
            <div className='profile'>
                <ProfileMenu />
                <div className='myrate__profile-contents'>
                    <div className='profile-info'>
                        <img src={dummyUser.profileImage} alt='Profile' className='profile-image' />
                        <div className='profile-summary'>
                            <h3 className='profile-tendency'>{dummyUser.nickname}님은 {percentage}% {dummyUser.user_tendency} 성향이에요</h3>
                            <div className='progress-bar'>
                                <div
                                    className='progress-bar-fill'
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div className='calendar'>
                        <div className='calendar__header'>
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>&lt;</button>
                            <span>{currentDate.toLocaleString('ko-KR', { month: 'long', year: 'numeric' })}</span>
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>&gt;</button>
                        </div>
                        <div className='calendar__days'>
                            {daysInMonth.map((day, index) => (
                                <div
                                    key={index}
                                    className={`calendar__day ${day ? (day.getDate() === new Date().getDate() && day.getMonth() === new Date().getMonth() && day.getFullYear() === new Date().getFullYear() ? 'today' : '') : 'empty'}`}
                                    style={{ backgroundColor: day ? getBackgroundColor(day) : 'transparent' }}
                                    onClick={() => handleDayClick(day)}
                                >
                                    {day ? day.getDate() : ''}
                                </div>
                            ))}
                        </div>
                        <div className='category-indicator'>
                            <div className='indicator-box-forest'></div>
                            <span>숲</span>
                            <div className='indicator-box-city'></div>
                            <span>도시</span>
                            <div className='indicator-box-sea'></div>
                            <span>바다</span>
                            <div className='indicator-box-nothing'></div>
                            <span>일기 없음</span>
                        </div>
                    </div>
                    <div className='my-diaries'>
                        <div className='my-diaries-header'>
                            <div className='diary-box'>
                                <h4>내가 작성한 일기</h4>
                            </div>

                        </div>
                        {selectedDate && diaryCards.length > 0 && (
                            <div className='selected-date-box'>
                                {new Date(selectedDate).toLocaleDateString()}
                            </div>
                        )}
                        <div className='diary-cards'>
                            <button className='next-previous-button-left' onClick={handlePreviousDay}>&lt;</button>
                            {diaryCards.length > 0 ? diaryCards.map(diary => (
                                <div className='myrate__diary-card' key={diary.diary_id} onClick={() => handleDiaryClick(diary)}>
                                    {diary.post_photo && (
                                        <img
                                            src={diary.post_photo}
                                            alt={`${diary.diary_title} 이미지`}
                                            className='myrate__diary-card__image'
                                        />
                                    )}
                                    <h4>{diary.diary_title}</h4>
                                    <p className='myrate__diary-card__content'>{diary.diary_content.replace(/<[^>]+>/g, '').substring(0, 100)}</p>
                                </div>
                            )) : null}
                            <button className='next-previous-button-right' onClick={handleNextDay}>&gt;</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyRate;
