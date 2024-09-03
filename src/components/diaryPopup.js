import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/diaryPopup.css';
import miniTreeImage from '../assets/images/minitree.png'

const DiaryPopup = ({ diary_id, onClose }) => {
    const [diary, setDiary] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState(""); // 새 댓글 상태
    const [editingcomment_id, setEditingcomment_id] = useState(null);
    const commentRefs = useRef({});

    const currentUser = "CurrentUser"

    useEffect(() => {
        // 일기 데이터 가져오기
        const fetchDiary = async () => {
            try {
                const response = await fetch(`/diaries/${diary_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch diary');
                }
                const diaryData = await response.json();
                setDiary(diaryData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        // 댓글 데이터 가져오기
        const fetchComments = async () => {
            try {
                const response = await fetch(`/comments/${diary_id}/comments`);
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const commentsData = await response.json();
                setComments(commentsData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchDiary();
        fetchComments();

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

    const handleCommentSubmit = async () => {
        if (newComment.trim()) {
            const newCommentData = {
                user_nick: currentUser,
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

    return (
        <div className="diary-popup" onClick={handleBackgroundClick}>
            <div className="diary-popup__content">
                <div className='diary-popup__title'>
                    <img src={miniTreeImage} alt="Mini Tree" className="diary-popup__mini-tree-image" />
                    <h1 className='diary-popup__forest'>Today's Forest</h1>
                </div>
                <div className='diary-popup__title-container'>
                    <p className='diary-popup__diary-title'>{diary.diary_title}</p>
                    <div className="diary-popup__title-line"></div>
                </div>
                <div className="diary-popup__diary-content">
                    <p>{diary.diary_content}</p>
                </div>

                <div className="diary-popup__comment-input-section">
                    <img src={diary.userProfileImage} alt="User Profile" className="diary-popup__user-profile-image" />
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
                                <img src={comment.profile_img} alt="Profile" className="diary-popup__comment-profile-image" />
                                <div className="diary-popup__comment-details">
                                    <p className="diary-popup__comment-nickname">{comment.nickname}님</p>
                                    <p
                                        className={`diary-popup__comment-content ${editingcomment_id === comment.comment_id ? 'diary-popup__comment-content--editable' : ''}`}
                                        contentEditable={editingcomment_id === comment.comment_id}
                                        onBlur={() => handleEditBlur(comment.comment_id)}
                                        ref={(el) => commentRefs.current[comment.comment_id] = el}
                                        suppressContentEditableWarning={true}
                                    >
                                        {comment.comment_text}
                                    </p>
                                </div>
                                {comment.User.user_nick === currentUser && (
                                    <div className="diary-popup__comment-actions">
                                        {editingcomment_id === comment.comment_id ? (
                                            <button
                                                className="diary-popup__edit-button"
                                                onClick={() => setEditingcomment_id(null)}
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
                                )}
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
