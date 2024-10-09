import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../assets/css/alarm.css';  // 스타일을 위한 CSS 파일을 임포트

const Alarm = ({ isOpen, onClose }) => {
    const [isOn, setIsOn] = useState(false);
    const [notifications, setNotifications] = useState([]);  // 좋아요, 댓글 데이터 저장
    const [userId, setUserId] = useState(null);  // 유저 ID 저장
    const location = useLocation();  // 현재 경로 가져오기

    const handleToggle = () => {
        setIsOn(!isOn);
    };

    // 1. 유저 ID 가져오기
    const fetchUserId = async () => {
        const token = localStorage.getItem('token');  // JWT 토큰 가져오기

        if (!token) {
            console.log('토큰이 없습니다. 로그인 필요');
            return;
        }

        const response = await fetch('/user', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        });

        if (response.ok) {
            const data = await response.json();
            setUserId(data.userId);  // 유저 ID 설정
        } else {
            console.log('유저 정보를 가져오지 못했습니다.');
        }
    };

    // 2. 유저 다이어리 데이터 가져오기
    const fetchDiaryData = async (userId) => {
        const response = await fetch(`/diary/${userId}`, {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            return data.diaries;  // 다이어리 목록 반환
        } else {
            console.log('다이어리 데이터를 가져오지 못했습니다.');
            return [];
        }
    };

    // 3. 다이어리 좋아요와 댓글 가져오기
    const fetchLikesAndComments = async (diaries) => {
        const allNotifications = [];

        for (const diary of diaries) {
            const response = await fetch(`/diary/${diary.id}/notifications`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                allNotifications.push(...data.notifications);  // 다이어리별 좋아요, 댓글 추가
            } else {
                console.log(`다이어리 ${diary.id}의 알림을 가져오지 못했습니다.`);
            }
        }

        setNotifications(allNotifications);  // 모든 알림을 상태에 저장
    };

    useEffect(() => {
        if (isOpen) {
            // 유저 ID -> 다이어리 -> 좋아요와 댓글 데이터 가져오기
            const fetchData = async () => {
                await fetchUserId();  // 유저 ID 가져오기
            };

            fetchData();
        }
    }, [isOpen]);

    useEffect(() => {
        // 유저 ID가 있을 때만 다이어리와 알림을 가져옴
        if (userId) {
            const getDiaryData = async () => {
                const diaries = await fetchDiaryData(userId);  // 다이어리 가져오기
                if (diaries.length > 0) {
                    await fetchLikesAndComments(diaries);  // 좋아요와 댓글 가져오기
                }
            };
            getDiaryData();
        }
    }, [userId]);

    // 페이지 경로에 따른 알림 항목 배경색 설정
    const getNotificationBackgroundColor = () => {
        switch (location.pathname) {
            case '/forest':
            case '/forestquestion':
            case '/diaries/diaries_forest':
            case '/forest_diary':
                return '#E8F3DA';  // 연한 초록색
            case '/city':
            case '/checklist/checklist':
            case '/diaries/diaries_city':
            case '/city_diary':
                return '#FFFDB9';  // 연한 노란색
            case '/sea':
            case '/diaries/diaries_sea':
            case '/diaries/special_day':
            case '/sea_diary':
                return '#EAF0FF';  // 연한 파란색
            case '/friend':
                return '#F9EAFE';  // 연한 보라색
            default:
                return '#FFFFFF';  // 기본 배경색
        }
    };

    if (!isOpen) return null;  // 팝업이 열려있지 않으면 아무것도 렌더링하지 않음

    return (
        <div className={`popup-container ${isOpen ? 'show' : ''}`}>
            <div className="popup-header">
                <h3>알림설정</h3>
                <div className="onoff-switch">
                    <input 
                        type="checkbox" 
                        checked={isOn} 
                        onChange={handleToggle} 
                    />
                </div>
            </div>
            <div className="popup-body">
                <h3>알람내역</h3>
                <ul>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <li key={index} style={{ backgroundColor: getNotificationBackgroundColor() }}>
                                <div className="rounded-img">
                                    <img src={notification.profileImageUrl} alt="User" />
                                </div>
                                <div className="notification-message">
                                    {notification.type === 'like' ? (
                                        <p>{notification.username}님이 회원님의 게시글을 좋아합니다.</p>
                                    ) : (
                                        <p>{notification.username}님이 회원님의 게시글에 댓글을 달았습니다.</p>
                                    )}
                                    <span className="notification-date">{notification.date}</span>
                                </div>
                                <div className="square-img">
                                    <img src={notification.diaryImageUrl} alt="Diary" />
                                </div>
                            </li>
                        ))
                    ) : (
                        <li>알림이 없습니다.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Alarm;
