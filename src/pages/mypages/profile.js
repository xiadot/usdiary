import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/profile.css';
import Menu from '../../components/menu';
import ProfileMenu from '../../components/profileMenu';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // 저장된 JWT 토큰 가져오기

      if (!token) {
        console.log('토큰이 없습니다. 로그인 필요');
        return;
      }

      const response = await fetch('/mypage', {
        method: 'GET',
        headers: {
          'Authorization': token, // JWT 토큰을 헤더에 포함
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data); // 유저 정보를 상태로 저장
      } else {
        console.log('유저 정보를 가져오지 못했습니다.');
      }
    };

    fetchUserData();
  }, []);

  // 비밀번호 확인 함수
  const handleConfirm = async () => {
    if (!password) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('token'); // 저장된 JWT 토큰 가져오기

    if (!token) {
      setErrorMessage('로그인이 필요합니다.');
      return;
    }

    // 서버에 비밀번호 확인 요청
    const response = await fetch('/api/verify-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token, // JWT 토큰을 헤더에 포함
      },
      body: JSON.stringify({ password }), // 비밀번호 전송
    });

    if (response.ok) {
      navigate('/profilefix'); // 비밀번호가 맞으면 페이지 이동
    } else {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
    }
  };

  if (!userData) {
    return <div>Loading...</div>; // 사용자 데이터 로딩 중
  }

  return (
    <div className="pro_page">
      <Menu />
      <div className="pro_page-container">
        <ProfileMenu />
        <div className="pro_content-box">
          <div className="pro_profile-section">
            <div className="pro_profile-image-space">
              {/* 프로필 이미지와 닉네임 표시 */}
              <img 
                src={userData.profile_img || '/default-profile.png'} 
                alt="Profile" 
                className="pro_profile-img"
              />
              <p className="pro_profile-username">{userData.user_nick}</p>
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
              {errorMessage && <p className="pro_error-message">{errorMessage}</p>}
              <button className="pro_confirm-button" onClick={handleConfirm}>확인</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
