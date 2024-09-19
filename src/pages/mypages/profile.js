import React, { useState } from 'react';
import '../../assets/css/profile.css';
import Menu from '../../components/menu';

const ProfilePage = () => {
  const [activeButton, setActiveButton] = useState('Profile');

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  return (
    <div className="pro_page">
      <Menu />
      <div className="pro_page-container">
        <div className="pro_content-box">
          {activeButton === 'Profile' && (
            <div className="pro_profile-section">
              <div className="pro_profile-image-space">
                {/* Placeholder for circular image */}
              </div>
              <div className="pro_additional-circle"></div>
              <div className="pro_password-container">
                <input 
                  type="password" 
                  className="pro_password-input" 
                  placeholder="비밀번호 확인" 
                />
                <button className="pro_confirm-button">확인</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
