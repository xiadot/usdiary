import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/menu';
import GuidePopup from '../../components/guide';
import '../../assets/css/forest_tendency.css';
import BigtreeImage from '../../assets/images/bigtree.png';
import MincityImage from '../../assets/images/mincity.png';

function ForestTendency() {
  const navigate = useNavigate();
  const [userNick, setUserNick] = useState(''); // userNick 상태 추가

  useEffect(() => {
    // 사용자 정보를 가져오는 API 호출
    const fetchUserData = async () => {
      try {
          const token = localStorage.getItem('authToken'); // 로컬스토리지에서 토큰 가져오기
          if (!token) {
              throw new Error('No token found');
          }

          const response = await fetch('http://localhost:3001/users/me', {
              headers: {
                  'Authorization': `Bearer ${token}`,
              },
          });

          if (!response.ok) {
              throw new Error('서버에 오류가 발생했습니다.');
          }

          const data = await response.json();
          setUserNick(data.data.user_nick); // 서버에서 응답받은 데이터를 사용
          console.log('Fetched userNick:', data.data.user_nick); // 닉네임 콘솔 출력
      } catch (error) {
          console.error('Error fetching user data:', error);
      }
  };

  fetchUserData(); // 컴포넌트 마운트 시 사용자 정보 가져오기
}, []);
  
  return (
    <div className="Tendency">
      <GuidePopup />
      <div className="Forest_Tendency">
        <Menu />
        <div className="forest_tendency">
          <div className="forest_tendency_info-box">
            <div className="forest_tendency_info-content">
              <div className="forest_tendency_info-header">
                {/* 닉네임만 출력하는 부분 */}
                <h1>{userNick}님은 숲 성향이에요</h1> {/* userNick 상태를 사용하여 닉네임 표시 */}
              </div>
              <div className="forest_tendency_info-section">
                <h2>숲이란?</h2>
                <div className="forest_tendency_text-container">
                  <p>
                    숲은 여유롭게 하루를 보내는 사람들을 위한 기록장입니다. 하루를 천천히 흘려보내며 작은 것에서 큰 의미를 찾아내는 무너에게 최적의 공간입니다. 느리게 가는 만큼 세상을 더 깊이 바라보고 느끼는 여유로움을 통해, 하루의 가치를 새롭게 발견할 수 있을 거예요. 비슷한 무너들과 함께 어우러지는 숲속을 usdiary가 만들어드립니다. 숲에서 마음을 가꾸고, 하루를 차분히 정리해보세요.
                  </p>
                </div>
              </div>
              <button className="forest_tendency_submit-button">숲 성향으로 결정하기</button>
              <p className="forest_tendency_note">* 일주일 동안 성향 변경이 가능합니다</p>
            </div>
            <img src={BigtreeImage} alt="forest_tendency_Description" className="forest_tendency_info-image" />
            <button className="forest_tendency_city-tendency-button" onClick={() => navigate('/city_tendency')}>
              <img src={MincityImage} alt="forest_tendency_City Tendency" className="forest_tendency_city-image" />
              도시 성향 보러가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForestTendency;
