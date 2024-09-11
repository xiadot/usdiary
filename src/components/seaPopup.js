import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/seaPopup.css';
import miniseaImage from '../assets/images/minicity.png';
import sirenIcon from '../assets/images/siren_city.png';
import ReportPopup from './reportPopup';
import axios from 'axios';

const SeaPopup = ({ diary_id, onClose }) => {
    const [diary, setDiary] = useState({
        diary_id: 1,
        diary_title: 'A Day at the Sea',
        diary_content: 'It was a peaceful day by the sea, with a light breeze and clear skies.',
        user: {
            profile: { profile_img: miniseaImage },
            user_nick: 'OceanLover'
        }
    });

    const [comments, setComments] = useState([
        {
            comment_id: 1,
            comment_text: 'Sounds like a perfect day!',
            user: {
                user_nick: 'SeaBreeze',
                profile: { profile_img: miniseaImage }
            }
        },
        {
            comment_id: 2,
            comment_text: 'Wish I was there!',
            user: {
                user_nick: 'WaveWatcher',
                profile: { profile_img: miniseaImage }
            }
        }
    ]);

    const [todos, setTodos] = useState([
        {
            todo_id: 1,
            title: 'Collect shells',
            description: 'Find some unique seashells on the beach.',
            is_completed: false
        },
        {
            todo_id: 2,
            title: 'Build sandcastles',
            description: 'Create a beautiful sandcastle with towers.',
            is_completed: true
        }
    ]);

    const [routines, setRoutines] = useState([
        {
            routine_id: 1,
            title: 'Morning Swim',
            description: 'Take a swim in the calm morning sea.',
            is_completed: true
        },
        {
            routine_id: 2,
            title: 'Evening Walk',
            description: 'Walk along the shore during sunset.',
            is_completed: false
        }
    ]);

    const [loading, setLoading] = useState(false); // 로딩 상태 초기화
    const [liked, setLiked] = useState(false); // 좋아요 상태
    const [newComment, setNewComment] = useState(''); // 새 댓글 입력 상태
    const [error, setError] = useState(null);
    const [editingcomment_id, setEditingcomment_id] = useState(null);
    const commentRefs = useRef({});
    const [currentUserProfile, setCurrentUserProfile] = useState({
        profile_img: miniseaImage,
        user_nick: 'CurrentUser'
    });

    // 더미 데이터 호출 함수
    useEffect(() => {
        const fetchDummyData = () => {
            setLoading(true);

            // 더미 다이어리 데이터
            const dummyDiary = {
                diary_id: diary_id,
                diary_title: `A Day at the Sea - Diary ${diary_id}`,
                diary_content: 'Enjoying the beautiful sea and nature around.',
                user: {
                    profile: { profile_img: miniseaImage },
                    user_nick: 'OceanLover'
                }
            };
            setDiary(dummyDiary);

            // 더미 댓글 데이터
            const dummyComments = [
                {
                    comment_id: 1,
                    comment_text: 'What a beautiful day!',
                    user: {
                        user_nick: 'SeaBreeze',
                        profile: { profile_img: miniseaImage }
                    }
                },
                {
                    comment_id: 2,
                    comment_text: 'Can’t wait to visit the sea!',
                    user: {
                        user_nick: 'WaveWatcher',
                        profile: { profile_img: miniseaImage }
                    }
                }
            ];
            setComments(dummyComments);

            // 더미 할 일 데이터
            const dummyTodos = [
            ];
            setTodos(dummyTodos);

            // 더미 루틴 데이터
            const dummyRoutines = [
            ];
            setRoutines(dummyRoutines);

            // 더미 사용자 프로필
            setCurrentUserProfile({
                profile_img: miniseaImage,
                user_nick: 'CurrentUser'
            });

            setLoading(false);
        };

        fetchDummyData();

        // 팝업이 뜨면 배경 스크롤 방지
        document.body.style.overflow = 'hidden';

        // 팝업이 닫히면 배경 스크롤 복원
        return () => {
            document.body.style.overflow = '';
        };
    }, [diary_id]);

    useEffect(() => {
        // Fetch initial liked status
        const fetchLikeStatus = async () => {
            try {
                const response = await axios.get(`/diaries/${diary_id}/like`);
                setLiked(response.data.liked);
            } catch (error) {
                console.error('Failed to fetch like status', error);
            }
        };
        fetchLikeStatus();
    }, [diary_id]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/user/profile'); // 사용자 프로필 정보를 가져오는 API 엔드포인트
                setCurrentUserProfile({
                    profileImage: response.data.profile_img,
                    nickname: response.data.user_nick
                });
            } catch (err) {
                console.error('Failed to fetch user profile', err);
            }
        };

        fetchUserProfile();
    }, []);

    const [reportPopupVisible, setReportPopupVisible] = useState(false);

    const handleReportButtonClick = () => {
        setReportPopupVisible(true);
    };

    const handleCloseReportPopup = () => {
        setReportPopupVisible(false);
    };

    if (loading) return <div className="diary-popup">Loading...</div>;
    if (error) return <div className="diary-popup">{error}</div>;

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async () => {
        if (newComment.trim()) {
            const newCommentData = {
                user_nick: currentUserProfile.user_nick,
                comment_text: newComment,
                diary_id: diary_id,
            };

            try {
                const response = await fetch(`/comments/${diary_id}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newCommentData),
                });

                if (!response.ok) {
                    throw new Error('Failed to submit comment');
                }

                const createdComment = await response.json();
                setComments([...comments, createdComment]);
                setNewComment("");
            } catch (err) {
                setError(err.message);
            }
        }
    };


    const handleEditClick = (comment_id) => {
        setEditingcomment_id(comment_id);
    };

    const handleEditBlur = async (comment_id) => {
        const commentEl = commentRefs.current[comment_id];
        if (commentEl) {
            const updatedComment = {
                ...comments.find(comment => comment.comment_id === comment_id),
                comment_text: commentEl.innerText,
            };

            try {
                const response = await fetch(`/comments/${diary_id}/comments/${comment_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedComment),
                });

                if (!response.ok) {
                    throw new Error('Failed to update comment');
                }

                setComments(comments.map(comment =>
                    comment.comment_id === comment_id ? updatedComment : comment
                ));
            } catch (err) {
                setError(err.message);
            }
        }
        setEditingcomment_id(null);
    };

    const handleDeleteClick = async (comment_id) => {
        try {
            const response = await fetch(`/comments/${comment_id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }

            setComments(comments.filter(comment => comment.comment_id !== comment_id));
        } catch (err) {
            setError(err.message);
        }
    };

    const hasComments = comments.length > 0;
    const hasTodos = todos.length > 0;
    const hasRoutines = routines.length > 0;

    const showChecklistSection = hasTodos || hasRoutines;

    // 좋아요 토글 함수
    const toggleLike = (e) => {
        e.stopPropagation();
        setLiked(!liked);
    };

    const EmptyHeart = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9EA3AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );

    const FilledHeart = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#D8D8D8" stroke="#9EA3AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );



    if (loading) return <div className="sea-popup">Loading...</div>;

    return (
        <div>
            <div className="sea-popup" onClick={handleBackgroundClick}>
                <div className="sea-popup__content">
                    <div className='sea-popup__header'>
                        <div className='sea-popup__header-left'>
                            <img src={diary.user.profile.profile_img} alt="Diary Author" className="sea-popup__author-profile-image" />
                            <p className="sea-popup__author-nickname">{diary.user.user_nick}님</p>
                        </div>
                        <div className="sea-popup__header-right">
                            <button className="sea-popup__report-button" onClick={handleReportButtonClick}>
                                <img src={sirenIcon} alt="Report" />
                            </button>
                            <span className="sea-popup__like-button" onClick={toggleLike}>
                                {liked ? <FilledHeart /> : <EmptyHeart />}
                            </span>
                        </div>
                    </div>

                    <div className={`sea-popup__main-content ${!(hasRoutines || hasTodos) ? 'sea-popup__main-content--centered' : ''}`}>
                        {showChecklistSection && (
                            <div className='sea-popup__checklist-section'>
                                <h2 className="city-popup__checklist-title">Today's Checklist</h2>
                                <div className="city-popup__checklist__check-routine">
                                    <div className="sea-popup__checklist__check-routine-top">
                                        <div className="city__checklist__check-routine-top-circle"></div>
                                        <div className="city__checklist__check-routine-top-name">Routine</div>
                                        <div className="city__checklist__check-routine-top-num">{routines.length}</div>
                                    </div>
                                    <hr />
                                    <div className="sea-popup__checklist__check-routine-bottom">
                                        {routines.map((routine, index) => (
                                            <div className="city__checklist__check-routine-bottom-box" key={routine.routine_id}>
                                                <div className="city__checklist__check-routine-bottom-box-toggleSwitch">
                                                    <input
                                                        type="checkbox"
                                                        id={`routine-toggle-${index}`}
                                                        hidden
                                                        checked={routine.is_completed}
                                                        readOnly
                                                    />
                                                    <label htmlFor={`routine-toggle-${index}`}>
                                                        <span></span>
                                                    </label>
                                                </div>
                                                <div className="city__checklist__check-routine-bottom-box-title">{routine.title}</div>
                                                <div className="city__checklist__check-routine-bottom-box-content">{routine.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="sea-popup__checklist__check-todo">
                                    <div className="sea-popup__checklist__check-todo-top">
                                        <div className="city__checklist__check-todo-top-circle"></div>
                                        <div className="city__checklist__check-todo-top-name">To Do</div>
                                        <div className="city__checklist__check-todo-top-num">{todos.length}</div>
                                    </div>
                                    <hr />
                                    <div className="sea-popup__checklist__check-todo-bottom">
                                        {todos.map((todo, index) => (
                                            <div className="city__checklist__check-todo-bottom-box" key={todo.todo_id}>
                                                <div className="city__checklist__check-todo-bottom-box-toggleSwitch">
                                                    <input
                                                        type="checkbox"
                                                        id={`todo-toggle-${index}`}
                                                        hidden
                                                        checked={todo.is_completed}
                                                        readOnly
                                                    />
                                                    <label htmlFor={`todo-toggle-${index}`}>
                                                        <span></span>
                                                    </label>
                                                </div>
                                                <div className="city__checklist__check-todo-bottom-box-title">{todo.title}</div>
                                                <div className="city__checklist__check-todo-bottom-box-content">{todo.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="sea-popup__diary-section">
                            <div className='sea-popup__title'>
                                <img src={miniseaImage} alt="Mini sea" className="sea-popup__mini-sea-image" />
                                <h1 className='sea-popup__sea'>Today's sea</h1>
                            </div>
                            <div className='sea-popup__title-container'>
                                <p className='sea-popup__diary-title'>{diary.diary_title}</p>
                                <div className="sea-popup__title-line"></div>
                            </div>
                            <div className="sea-popup__diary-content">
                                <p>{diary.diary_content}</p>
                            </div>
                        </div>
                    </div>

                    <div className="sea-popup__comment-input-section">
                        <img src={currentUserProfile.profile_img} alt="User Profile" className="sea-popup__user-profile-image" />
                        <input
                            type="text"
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="댓글 달기 ..."
                            className="sea-popup__comment-input"
                        />
                        <button onClick={handleCommentSubmit} className="sea-popup__comment-submit-button">댓글 작성</button>
                    </div>

                    <div className={`sea-popup__comments-section ${!hasComments ? 'sea-popup__comments-section--no-comments' : ''}`}>
                        {hasComments ? (
                            comments.map((comment) => (
                                <div key={comment.comment_id} className="sea-popup__comment">
                                    <img src={comment.user.profile.profile_img} alt="Profile" className="sea-popup__comment-profile-image" />
                                    <div className="sea-popup__comment-details">
                                        <p className="sea-popup__comment-nickname">{comment.user.user_nick}님</p>
                                        <p
                                            className={`sea-popup__comment-content ${editingcomment_id === comment.comment_id ? 'sea-popup__comment-content--editable' : ''}`}
                                            contentEditable={editingcomment_id === comment.comment_id}
                                            onBlur={() => handleEditBlur(comment.comment_id)}
                                            ref={(el) => commentRefs.current[comment.comment_id] = el}
                                            suppressContentEditableWarning={true}
                                        >
                                            {comment.comment_text}
                                        </p>
                                    </div>
                                    {comment.user.user_nick === currentUserProfile.user_nick && (
                                        <div className="sea-popup__comment-actions">
                                            {editingcomment_id === comment.comment_id ? (
                                                <button
                                                    className="sea-popup__edit-button"
                                                    onClick={() => setEditingcomment_id(null)}
                                                >
                                                    저장
                                                </button>
                                            ) : (
                                                <button
                                                    className="sea-popup__edit-button"
                                                    onClick={() => handleEditClick(comment.comment_id)}
                                                >
                                                    수정
                                                </button>
                                            )}
                                            <button
                                                className="sea-popup__delete-button"
                                                onClick={() => handleDeleteClick(comment.comment_id)}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="sea-popup__no-comments-message">첫 번째 댓글을 남겨보세요!</p>
                        )}
                    </div>
                </div>
            </div>
            {reportPopupVisible && <ReportPopup onClose={handleCloseReportPopup} />}
        </div>
    );
};

export default SeaPopup;
