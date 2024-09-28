import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo_US from '../assets/images/Logo_US.png';
import Logo_EARTH from '../assets/images/Logo_EARTH.png';
import alarm_white from '../assets/images/alarm_white.png';
import alarm_black from '../assets/images/alarm_black.png';
import '../assets/css/login.css';
import Alarm from '../components/alarm';

const Menu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAlarmOpen, setAlarmOpen] = useState(false);  // 알림 팝업 상태 추가
    const [activeButton, setActiveButton] = useState('');

    // 현재 경로에 따라 활성화된 버튼 결정
    useEffect(() => {
        if (location.pathname === '/forest' || location.pathname === '/city' || location.pathname === '/sea' || location.pathname === '/friend') {
            setActiveButton('home');
        } else if (location.pathname === '/forest_diary' || location.pathname === '/city_diary' || location.pathname === '/sea_diary'
            || location.pathname === '/forestquestion' || location.pathname === '/city_diary/checklist' || location.pathname === '/sea_diary/special_day') {
            setActiveButton('diary');
        } else if (location.pathname === '/map') {
            setActiveButton('map');
        } else if (location.pathname === '/forest_diary' || location.pathname === '/follow') {
            setActiveButton('profile');
        }
    }, [location.pathname]);

    const handleHomeClick = (e) => {
        e.preventDefault();
        const savedMenu = localStorage.getItem('selectedMenu');
        if (savedMenu === 'forest') {
            navigate('/forest');
        } else if (savedMenu === 'city') {
            navigate('/city');
        } else if (savedMenu === 'sea') {
            navigate('/sea');
        } else if (savedMenu === 'friend') {
            navigate('/friend');
        }
    };

    const handleDiaryClick = (e) => {
        e.preventDefault();
        const savedMenu = localStorage.getItem('selectedMenu');
        if (savedMenu === 'forest') {
            navigate('/forest_diary');
        } else if (savedMenu === 'city') {
            navigate('/city_diary');
        } else if (savedMenu === 'sea') {
            navigate('/sea_diary');
        }
    };

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
                <div className={`btn ${activeButton === 'home' ? 'active' : ''}`} onClick={handleHomeClick} id="home">HOME</div>
                <div className={`btn ${activeButton === 'diary' ? 'active' : ''}`} onClick={handleDiaryClick} id="diary">DIARY</div>
                <div className={`btn ${activeButton === 'map' ? 'active' : ''}`} onClick={handleMapClick} id="map">MAP</div>
                <div className={`btn ${activeButton === 'profile' ? 'active' : ''}`} id="profile">PROFILE</div>
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
