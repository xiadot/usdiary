import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../../assets/css/notification_detail.css';
import '../../assets/css/follow.css';
import Menu from '../../components/menu';
import ProfileMenu from '../../components/profileMenu';

const NotificationDetail = () => {
    const { id } = useParams();

    // 공지사항 데이터
    const notifications = {
        '1': {
            title: 'Lorem Ipsum is simply dummy text of the printing',
            createdAt: '2024.01.01',
            views: 100,
            content: `Lorem Ipsum is simply dummy text of the printing. 
                      Suspendisse metus mauris, semper pharetra diam quis, 
                      auctor ornare nisl. Aenean pellentesque, metus at sollicitudin tempor, 
                      lectus metus pulvinar libero, nec euismod sapien purus at nunc. 
                      Maecenas feugiat diam et ante auctor vulputate. Pellentesque 
                      vel consequat tellus. Nulla maximus justo eu sapien accumsan consequat. 
                      Fusce ornare mauris, eu luctus ligula dignissim aliquet. Sed quis mauris tempor, 
                      consectetur magna ac, sodales nulla. 

                      Mauris id scelerisque urna, ut cursus dolor.

                      Praesent gravida lorem sed lorem tempor, eu volutpat lacus luctus. 
                      Integer varius lorem ac dolor consectetur iaculis. 
                      Nullam tristique, urna vel ultrices mattis, nibh mi consectetur nibh, 
                      eget mattis quam metus id purus. Pellentesque nec justo purus. 
                      Pellentesque a placerat urna. Donec mauris, tincidunt eu leo vel, 
                      lobortis porttitor sem. Nunc rutrum nisi id mi mattis, 
                      sed gravida ante faucibus.`,
        },
        '2': {
            title: 'Second Notification Title',
            createdAt: '2024.01.02',
            views: 150,
            content: `This is the content for the second notification.`,
        },
        // 다른 공지사항도 여기에 추가할 수 있습니다.
    };

    const notification = notifications[id];

    if (!notification) {
        return <div>공지사항을 찾을 수 없습니다.</div>;
    }

    return (
        <div className='wrap'>
            <Menu />
            <div className='notification'>
                <ProfileMenu />
                <div className='notification-contents'>
                    <h2>공지사항 상세</h2>
                    <div className='notification-detail'>
                        <h2>{notification.title}</h2>
                        <hr />
                        <div className='notification-meta'>
                            <span>작성일 | {notification.createdAt}</span>
                            <span>조회 | {notification.views}</span>
                        </div>
                        <hr />
                        <p>{notification.content}</p>
                        <div className='navigation'>
                            <Link to='/notification' className='back-button'>목록</Link>
                        </div>
                        <hr />
                        <div className='next-prev-links'>
                            <Link to={`/notification/${Number(id) + 1}`} className='next-link'>▲ 다음글</Link>
                            <Link to={`/notification/${Number(id) - 1}`} className='prev-link'>▲ 이전글</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationDetail;
