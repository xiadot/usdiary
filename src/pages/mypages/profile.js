import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/profile.css';
import Menu from '../../components/menu';
import ProfileMenu from '../../components/profileMenu';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    if (password) {
      // 비밀번호가 입력되면 /profilefix 페이지로 이동
      navigate('/profilefix');
    }
  };

  return (
    <div className="pro_page">
      <Menu />
      <div className="pro_page-container">
        <ProfileMenu />
        <div className="pro_content-box">
          <div className="pro_profile-section">
            <div className="pro_profile-image-space">
              {/* 로그인 사용자 프로필 불러오기 추가 예정 */}
            </div>
            <div className="pro_additional-circle"></div>
            <div className="pro_password-container">
              <input 
                type="password" 
                className="pro_password-input" 
                placeholder="비밀번호 확인" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="pro_confirm-button" onClick={handleConfirm}>확인</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
