// src/components/ProfileMenu.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import profile from '../assets/images/profile.png';
import my_rate from '../assets/images/my_rate.png';
import contect_us from '../assets/images/contect_us.png';
import follow from '../assets/images/follow.png';
import level from '../assets/images/level.png';
import log_out from '../assets/images/log_out.png';
import '../assets/css/follow.css';

const ProfileMenu = () => {
    const location = useLocation();
    
    return (
        <div className='profile-menu'>
            <div className='profile-menu_content'>
                <div className='profile-menu_content_img'><img src={profile} alt="Profile Icon" /></div>
                <div className='profile-menu_content_name'>Profile</div>
            </div>
            <Link to="/mypage/myRate" className={`profile-menu_content ${location.pathname === '/mypage/myRate' ? 'active' : ''}`}>
                <div className='profile-menu_content_img'><img src={my_rate} alt="My Rate Icon" /></div>
                <div className='profile-menu_content_name'>My rate</div>
            </Link>
            <div className='profile-menu_content'>
                <div className='profile-menu_content_img'><img src={contect_us}  alt="Contact Us Icon" /></div>
                <div className='profile-menu_content_name'>Contact Us</div>
            </div>
            <Link to="/mypage/follow" className={`profile-menu_content ${location.pathname === '/mypage/follow' ? 'active' : ''}`}>
                <div className='profile-menu_content_img'><img src={follow} alt="Follow Icon" /></div>
                <div className='profile-menu_content_name'>Follow</div>
            </Link>
            <Link to="/mypage/level" className={`profile-menu_content ${location.pathname === '/mypage/level' ? 'active' : ''}`}>
                <div className='profile-menu_content_img'><img src={level} alt="Level Icon" /></div>
                <div className='profile-menu_content_name'>Level & Benefits</div>
            </Link>
            <Link to="/" className={`profile-menu_content ${location.pathname === '/' ? 'active' : ''}`}>
            <div className='profile-menu_content_img'><img src={log_out} alt="Log Out Icon" /></div>
            <div className='profile-menu_content_name'>Log out</div>
            </Link>
        </div>
    );
};

export default ProfileMenu;
