import React, { useState } from 'react';
import '../assets/css/alarm.css';  // 스타일을 위한 CSS 파일을 임포트

const Alarm = ({ isOpen, onClose }) => {
    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        setIsOn(!isOn);
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
                    <li>
                        <div className="rounded-img">
                            {/* 동그란 이미지 넣기 */}
                        </div>
                        OO님이 회원님의 게시글을 좋아합니다.
                        <div className="square-img">
                            {/* 네모난 이미지 넣기 */}
                        </div>
                    </li>
                    <li>
                        <div className="rounded-img">
                            {/* 동그란 이미지 넣기 */}
                        </div>
                        OO님이 회원님의 게시글을 좋아합니다.
                        <div className="square-img">
                            {/* 네모난 이미지 넣기 */}
                        </div>
                    </li>
                    <li>
                        <div className="rounded-img">
                            {/* 동그란 이미지 넣기 */}
                        </div>
                        OO님이 회원님의 게시글을 좋아합니다.
                        <div className="square-img">
                            {/* 네모난 이미지 넣기 */}
                        </div>
                    </li>
                    <li>
                        <div className="rounded-img">
                            {/* 동그란 이미지 넣기 */}
                        </div>
                        OO님이 회원님의 게시글을 좋아합니다.
                        <div className="square-img">
                            {/* 네모난 이미지 넣기 */}
                        </div>
                    </li>
                    <li>
                        <div className="rounded-img">
                            {/* 동그란 이미지 넣기 */}
                        </div>
                        OO님이 회원님의 게시글을 좋아합니다.
                        <div className="square-img">
                            {/* 네모난 이미지 넣기 */}
                        </div>
                    </li>
                    <li>
                        <div className="rounded-img">
                            {/* 동그란 이미지 넣기 */}
                        </div>
                        OO님이 회원님의 게시글을 좋아합니다.
                        <div className="square-img">
                            {/* 네모난 이미지 넣기 */}
                        </div>
                    </li>
                    <li>
                        <div className="rounded-img">
                            {/* 동그란 이미지 넣기 */}
                        </div>
                        OO님이 회원님의 게시글을 좋아합니다.
                        <div className="square-img">
                            {/* 네모난 이미지 넣기 */}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Alarm;
