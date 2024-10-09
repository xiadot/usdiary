import React, { useState } from 'react';
import '../../assets/css/follow.css';
import '../../assets/css/notification.css';
import Menu from '../../components/menu';
import ProfileMenu from '../../components/profileMenu';
import { Link } from 'react-router-dom';

const Notification = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 7;

    // 공지사항 데이터
    const notifications = [
        { id: '1', title: 'Lorem Ipsum is simply dummy text of the printing.', createdAt: '2024.01.01', views: 100 },
        { id: '2', title: 'Second Notification Title', createdAt: '2024.01.02', views: 150 },
        // 다른 공지사항 추가
    ];

    // 현재 페이지에 맞는 공지사항 추출
    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(notifications.length / notificationsPerPage);

    return (
        <div className='wrap'>
            <Menu />
            <div className='notification'>
                <ProfileMenu />
                <div className='notification-contents'>
                    <h2>공지사항</h2>
                    <div className='notification-list'>
                        <div className='notification-header'>
                            <span>번호</span>
                            <span>제목</span>
                            <span>등록일</span>
                            <span>조회수</span>
                        </div>
                        <hr className='divider' />
                        {currentNotifications.map((notification, index) => (
                            <div key={index} className='notification-item'>
                                <span>{notification.id}</span>
                                <Link to={`/notification/${notification.id}`} className='notification-title'>
                                    {notification.title}
                                </Link>
                                <span>{notification.createdAt}</span>
                                <span>{notification.views}</span>
                            </div>
                        ))}
                    </div>

                    <div className='pagination'>
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            &lt;
                        </button>
                        {[...Array(totalPages).keys()].map(pageNumber => (
                            <button
                                key={pageNumber + 1}
                                onClick={() => handlePageChange(pageNumber + 1)}
                                className={currentPage === pageNumber + 1 ? 'active' : ''}
                            >
                                {pageNumber + 1}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
