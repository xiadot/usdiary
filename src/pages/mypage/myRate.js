import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/follow.css';
import '../../assets/css/myRate.css';
import Menu from '../../components/menu';
import ProfileMenu from '../../components/profileMenu';

const MyRate = () => {

    return (
        <div className='wrap'>
            <Menu/>
            
            <div className='profile'>
                <ProfileMenu />
                <div className='profile-contents'>
                
                </div>
            </div>
        </div>
    );
};

export default MyRate;
