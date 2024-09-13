import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo_US from '../assets/images/Logo_US.png';
import Logo_EARTH from '../assets/images/Logo_EARTH.png';
import alarm_white from '../assets/images/alarm_white.png';
import alarm_black from '../assets/images/alarm_black.png';
import '../assets/css/login.css';
import Alarm from '../components/alarm';

const Menu = () => {
    const navigate = useNavigate();
    const [isAlarmOpen, setAlarmOpen] = useState(false);  // 알림 팝업 상태 추가

    const handleMapClick = (e) => {
        e.preventDefault();
        navigate('/map');
    };

    // 알림 팝업 상태를 토글하는 함수
    const handleAlarmClick = () => {
        setAlarmOpen(!isAlarmOpen);  // 현재 상태의 반대값으로 설정
    };

    return (
        <div className="menu">
            <div className="logo">
                <img src={Logo_US} className="logo_us" alt="Logo US" />
                <img src={Logo_EARTH} className="logo_earth" alt="Logo Earth" />
            </div>
            <div className="button">
                <div className="btn" id="home">HOME</div>
                <div className="btn" id="diary">DIARY</div>
                <div className="btn" onClick={handleMapClick} id="map">MAP</div>
                <div className="btn" id="profile">PROFILE</div>
                <div className="btn" onClick={handleAlarmClick} id="alarm">
                    <img src={alarm_white} className="alarm_white" alt="Alarm White" />
                    <img src={alarm_black} className="alarm_black" alt="Alarm Black" />
                </div>
            </div> 

            {/* 알림 팝업 */}
            <Alarm isOpen={isAlarmOpen} onClose={handleAlarmClick} />
        </div>
    );
};

export default Menu;
