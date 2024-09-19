import React, { useState } from 'react';
import '../../assets/css/profilefix.css';
import Menu from '../../components/menu';

const ProfileFix = () => {
  const [activeButton, setActiveButton] = useState('Profile');
  const [profileImage, setProfileImage] = useState(null);

  const handleButtonClick = (item) => {
    setActiveButton(item);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  return (
    <div className="page">
      <Menu />
      <div className="fix_page-container">
        <div className="fix_content-box">
          {activeButton === 'Profile' && (
            <div className="fix_profile-section">
              <h2 className="fix_profile-title">개인정보 수정</h2>
              <hr className="fix_divider" />
              <div className="fix_profile-form">
                <div className="fix_form-group">
                  <label htmlFor="profile-image">프로필 사진</label>
                  <div className="fix_profile-image-container">
                    <div className="fix_profile-image-wrapper">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="fix_profile-image" />
                      ) : (
                        <div className="fix_profile-image-placeholder" />
                      )}
                    </div>
                    <div className="fix_profile-image-info">
                      <span className="fix_profile-image-text">프로필 사진을 등록해주세요.</span>
                      <span className="fix_profile-image-note">이미지 파일 크기 최대 2MB 미만</span>
                    </div>
                  </div>
                  <div className="fix_profile-buttons">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="fix_upload-button"
                    />
                    <button className="fix_remove-button" onClick={handleRemoveImage}>삭제</button>
                  </div>
                </div>
                <div className="fix_form-group">
                  <label htmlFor="name">이름 *</label>
                  <input type="text" id="name" className="fix_form-input" disabled />
                </div>
                <div className="fix_form-group">
                  <label htmlFor="username">아이디 *</label>
                  <input type="text" id="username" className="fix_form-input" disabled />
                </div>
                <div className="fix_form-group">
                  <label htmlFor="password">비밀번호 *</label>
                  <input type="password" id="password" className="fix_form-input" placeholder="비밀번호 입력" />
                </div>
                <div className="fix_form-group">
                  <label htmlFor="confirm-password">비밀번호 확인 *</label>
                  <input type="password" id="confirm-password" className="fix_form-input" placeholder="비밀번호 확인" />
                </div>
                <div className="fix_form-group">
                  <label htmlFor="email">이메일 *</label>
                  <div className="fix_email-split">
                    <input type="text" id="email" className="fix_form-input" />
                    <span>@</span>
                    <input type="text" className="fix_form-input" />
                  </div>
                  <button className="fix_verify-button">이메일 중복확인</button>
                </div>
                <div className="fix_form-group">
                  <label htmlFor="phone">전화번호</label>
                  <div className="fix_phone-split">
                    <input type="text" className="fix_form-input" />
                    <input type="text" className="fix_form-input" />
                    <input type="text" className="fix_form-input" />
                  </div>
                </div>
                <div className="fix_form-group">
                  <label>생년월일 *</label>
                  <div className="fix_date-picker">
                    <select className="fix_form-input">
                      {Array.from({ length: 2024 - 1950 + 1 }, (_, i) => (
                        <option key={i} value={1950 + i}>{1950 + i}</option>
                      ))}
                    </select>
                    <select className="fix_form-input">
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}월</option>
                      ))}
                    </select>
                    <select className="fix_form-input">
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i} value={i + 1}>{i + 1}일</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="fix_form-group">
                  <label htmlFor="gender">성별</label>
                  <select id="gender" className="fix_form-input">
                    <option value="">선택 안 함</option>
                    <option value="female">여자</option>
                    <option value="male">남자</option>
                  </select>
                </div>
                <div className="fix_form-group">
                  <label htmlFor="tendency">성향</label>
                  <input type="text" id="tendency" className="fix_form-input" disabled />
                </div>
                <div className="fix_form-group">
                  <label htmlFor="points">포인트</label>
                  <input type="text" id="points" className="fix_form-input" disabled />
                </div>
                <hr className="fix_divider" />
                <div className="fix_form-actions">
                  <button className="fix_submit-button">수정</button>
                  <button className="fix_delete-account-button">회원 탈퇴</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileFix;
