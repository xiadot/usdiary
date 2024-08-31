import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/diaryPopup.css';
import userProfileImage from '../assets/images/example1.png';

const DiaryPopup = ({ diary_id, onClose }) => {
    const [diary, setDiary] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState(""); // 새 댓글 상태
    const [editingCommentId, setEditingCommentId] = useState(null);
    const commentRefs = useRef({});

    useEffect(() => {
        // 하드코딩된 다이어리 및 댓글 데이터
        const hardcodedData = {
            forest: {
                diary: {
                    diary_id: 1,
                    diary_title: "A Walk in the Forest",
                    diary_content: "Today, I walked through the forest and saw many beautiful trees and flowers. The air was fresh, and I felt at peace.",
                    board_id: 1,
                    user_id: 1,
                    access_level: 0,
                    view_count: 123,
                    like_count: 45,
                    post_photo: "../assets/images/tree.png",
                    diary_emotion: "Peaceful",
                    cate_num: null,
                },

                comments: []
            },
            forest2: {
                diary: {
                    diary_id: 4,
                    diary_title: "Evening in the Forest",
                    diary_content: "I went back to the forest in the evening, and it was even more serene. The sunset through the trees was breathtaking.",
                    board_id: 1,
                    user_id: 1,
                    access_level: 0,
                    view_count: 95,
                    like_count: 30,
                    post_photo: "../assets/images/sunset_forest.png",
                    diary_emotion: "Tranquil",
                    cate_num: null,
                },

                comments: [
                    {
                        comment_id: 7,
                        nickname: "SunsetWatcher",
                        comment_content: "Sunsets in the forest are so calming!",
                    },
                    {
                        comment_id: 8,
                        nickname: "NatureLover",
                        comment_content: "Sounds like a peaceful time.",
                    },
                ]
            },
            sea: {
                diary_id: 2,
                diary_title: "A Day at the Beach",
                diary_content: "The sea was calm today, and the waves gently lapped at the shore. I spent the day relaxing under the sun.",
                board_id: 2,
                user_id: 2,
                access_level: 0,
                view_count: 150,
                like_count: 60,
                post_photo: "/path/to/sea-photo.jpg",
                diary_emotion: "Relaxed",
                cate_num: 1,
            },

            city: {
                diary: {
                    diary_id: 3,
                    diary_title: "Exploring the City",
                    diary_content: "The city is full of life and energy. I visited a museum and had a coffee at a small café.",
                    board_id: 3,
                    user_id: 3,
                    access_level: 0,
                    view_count: 200,
                    like_count: 80,
                    post_photo: "/path/to/city-photo.jpg",
                    diary_emotion: null,
                    cate_num: 3, // 예를 들어 카페 카테고리
                },
                comments: [
                    {
                        comment_id: 5,
                        nickname: "UrbanExplorer",
                        comment_content: "Cities have so much to offer!",
                    },
                    {
                        comment_id: 6,
                        nickname: "CoffeeLover",
                        comment_content: "That café sounds cozy.",
                    },
                ]
            }
        };

        const diaryData = Object.values(hardcodedData).find(data => data.diary.diary_id === diary_id);

        if (diaryData) {
            setDiary(diaryData.diary);
            setComments(diaryData.comments);
            setLoading(false);
        } else {
            setError('Diary not found');
            setLoading(false);
        }

        // 팝업이 뜨면 배경 스크롤 방지
        document.body.style.overflow = 'hidden';

        // 팝업이 닫히면 배경 스크롤 복원
        return () => {
            document.body.style.overflow = '';
        };
    }, [diary_id]);

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

    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            const newCommentData = {
                comment_id: comments.length + 1, // 새 댓글의 ID는 현재 댓글 수 +1
                nickname: "CurrentUser", // 실제 사용자 닉네임으로 대체해야 함
                comment_content: newComment,
            };
            setComments([...comments, newCommentData]);
            setNewComment("");
        }
    };

    const handleEditClick = (commentId) => {
        setEditingCommentId(commentId);
    };


    const handleEditBlur = (commentId) => {
        const commentEl = commentRefs.current[commentId];
        if (commentEl) {
            setComments(comments.map(comment =>
                comment.comment_id === commentId
                    ? { ...comment, comment_content: commentEl.innerText }
                    : comment
            ));
        }
        setEditingCommentId(null);
    };

    const handleDeleteClick = (commentId) => {
        setComments(comments.filter(comment => comment.comment_id !== commentId));
    };

    const hasComments = comments.length > 0;

    return (
        <div className="diary-popup" onClick={handleBackgroundClick}>
            <div className="diary-popup__content">
                <h2>{diary.diary_title}</h2>
                <img src={diary.post_photo} alt="Diary" className="diary-popup__photo" />
                <p>{diary.diary_content}</p>
                <p><strong>Views:</strong> {diary.view_count}</p>
                <p><strong>Likes:</strong> {diary.like_count}</p>
                {diary.diary_emotion && <p><strong>Emotion:</strong> {diary.diary_emotion}</p>}
                {diary.cate_num && <p><strong>Category:</strong> {diary.cate_num}</p>}

                <div className="diary-popup__comment-input-section">
                    <img src={userProfileImage} alt="User Profile" className="diary-popup__user-profile-image" />
                    <input
                        type="text"
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="댓글 달기 ..."
                        className="diary-popup__comment-input"
                    />
                    <button onClick={handleCommentSubmit} className="diary-popup__comment-submit-button">댓글 작성</button>
                </div>

                <div className={`diary-popup__comments-section ${!hasComments ? 'diary-popup__comments-section--no-comments' : ''}`}>
                    {hasComments ? (
                        comments.map((comment) => (
                            <div key={comment.comment_id} className="diary-popup__comment">
                                <img src={userProfileImage} alt="Profile" className="diary-popup__comment-profile-image" />
                                <div className="diary-popup__comment-details">
                                    <p className="diary-popup__comment-nickname">{comment.nickname}님</p>
                                    <p
                                        className={`diary-popup__comment-content ${editingCommentId === comment.comment_id ? 'diary-popup__comment-content--editable' : ''}`}
                                        contentEditable={editingCommentId === comment.comment_id}
                                        onBlur={() => handleEditBlur(comment.comment_id)}
                                        ref={(el) => commentRefs.current[comment.comment_id] = el}
                                        suppressContentEditableWarning={true}
                                    >
                                        {comment.comment_content}
                                    </p>
                                </div>
                                <div className="diary-popup__comment-actions">
                                    {editingCommentId === comment.comment_id ? (
                                        <button
                                            className="diary-popup__edit-button"
                                            onClick={() => setEditingCommentId(null)}
                                        >
                                            저장
                                        </button>
                                    ) : (
                                        <button
                                            className="diary-popup__edit-button"
                                            onClick={() => handleEditClick(comment.comment_id)}
                                        >
                                            수정
                                        </button>
                                    )}
                                    <button
                                        className="diary-popup__delete-button"
                                        onClick={() => handleDeleteClick(comment.comment_id)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="diary-popup__no-comments-message">첫 번째 댓글을 남겨보세요!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiaryPopup;
