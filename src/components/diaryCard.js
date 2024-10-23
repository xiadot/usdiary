import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../assets/css/diaryCard.css';
import axios from 'axios';

const DiaryCard = ({ diary_title, createdAt, diary_content, post_photo, user_nick, board_name, isFriendPage, diary_id, like_count, onClick }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(like_count);  // 초기 값으로 props로 받은 like_count 사용

    const formatDate = (date) => {
        if (!date) return 'Invalid date';  // date가 없으면 기본 메시지 반환
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return 'Invalid date';  // 유효하지 않은 날짜일 경우 메시지 반환
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Intl.DateTimeFormat('ko-KR', options).format(parsedDate);
    };

    const formattedDate = formatDate(createdAt);

    // 좋아요 토글 함수
    const toggleLike = async (e) => {
        e.stopPropagation();
        try {
            // 서버로 좋아요 상태 전송
            const response = await axios.post(`/diaries/${diary_id}/like`, { liked: !liked });
            if (response.status === 200) {
                // 좋아요 상태 변경 및 좋아요 개수 업데이트
                setLiked(!liked);
                setLikeCount(likeCount + (liked ? -1 : 1));  // 좋아요 취소 시 -1, 추가 시 +1
            }
        } catch (error) {
            console.error('Failed to update like status', error);
        }
    };

    const EmptyHeart = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );

    const FilledHeart = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );

    const getBorderClass = () => {
        if (isFriendPage) return 'friend-border';
        switch (board_name) {
            case '숲':
                return 'forest-border';
            case '도시':
                return 'city-border';
            case '바다':
                return 'sea-border';
            default:
                return '';
        }
    };

    return (
        <div className={`diary-card ${getBorderClass()}`} onClick={() => onClick(diary_id, board_name)}>
            <div className="diary-header">
                <span className="diary-user_nick">{user_nick} 님</span>
                <span className="diary-like" onClick={toggleLike}>
                    {liked ? <FilledHeart /> : <EmptyHeart />}
                </span>
                <span className="diary-like-count">{likeCount}</span> {/* 좋아요 개수 표시 */}
            </div>
            <img src={post_photo || '../assets/images/default.png'} alt={diary_title} className="diary-image" />
            <div className="diary-content">
                <h2 className="diary-title">{diary_title}</h2>
                <p className="diary-date">{formattedDate}</p>
                <p className="diary-summary">{diary_content.replace(/<[^>]+>/g, '').length > 20
                    ? diary_content.replace(/<[^>]+>/g, '').substring(0, 20) + ' ...'
                    : diary_content.replace(/<[^>]+>/g, '')}</p>
            </div>
        </div>
    );
};

DiaryCard.propTypes = {
    diary_title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    diary_content: PropTypes.string.isRequired,
    post_photo: PropTypes.string,
    user_nick: PropTypes.string.isRequired,
    isFriendPage: PropTypes.bool,
    diary_id: PropTypes.number.isRequired,
    like_count: PropTypes.number.isRequired,  // like_count 추가
    onClick: PropTypes.func.isRequired,
};

export default DiaryCard;

