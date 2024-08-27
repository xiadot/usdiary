import React from 'react';
import Logo_US from '../assets/images/Logo_US.png';
import Logo_EARTH from '../assets/images/Logo_EARTH.png';
import alarm_white from '../assets/images/alarm_white.png';
import alarm_black from '../assets/images/alarm_black.png';
import '../assets/css/login.css';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const navigate = useNavigate();

    const handleMapClick = (e) => {
        e.preventDefault();
        navigate('/map')
    }

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
                <div className="btn" id="alarm">
                    <img src={alarm_white} className="alarm_white" alt="Alarm White" />
                    <img src={alarm_black} className="alarm_black" alt="Alarm Black" />
                </div>
            </div> 
        </div>
    );
};

export default Menu;
