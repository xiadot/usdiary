import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../assets/css/diaryCard.css';
import axios from 'axios';

const DiaryCard = ({ title, date, summary, imageUrl, nickname, boardName, isFriendPage, diaryId, onClick}) => {
    const [liked, setLiked] = useState(false);

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Intl.DateTimeFormat('ko-KR', options).format(new Date(date));
    };

    const formattedDate = formatDate(date);

    useEffect(() => {
        // Fetch initial liked status
        const fetchLikeStatus = async () => {
            try {
                const response = await axios.get(`/diaries/${diaryId}/like`);
                setLiked(response.data.liked);
            } catch (error) {
                console.error('Failed to fetch like status', error);
            }
        };
        fetchLikeStatus();
    }, [diaryId]);

    const toggleLike = (e) => {
        e.stopPropagation();
        setLiked(!liked);
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
        switch (boardName) {
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
        <div className={`diary-card ${getBorderClass()}`} onClick={() => onClick(diaryId, boardName)}>
            <div className="diary-header">
                <span className="diary-nickname">{nickname} 님</span>
                <span className="diary-like" onClick={toggleLike}>
                    {liked ? <FilledHeart /> : <EmptyHeart />}
                </span>
            </div>
            <img src={imageUrl || '/path/to/default-image.jpg'} alt={title} className="diary-image" />
            <div className="diary-content">
                <h2 className="diary-title">{title}</h2>
                <p className="diary-date">{formattedDate}</p>
                <p className="diary-summary">{summary.length > 20 ? summary.substring(0, 20) + ' ...' : summary}</p>
            </div>
        </div>
    );
};

DiaryCard.propTypes = {
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    boardName: PropTypes.string,
    nickname: PropTypes.string.isRequired,
    isFriendPage: PropTypes.bool,
    diaryId: PropTypes.number.isRequired,
};

export default DiaryCard;
