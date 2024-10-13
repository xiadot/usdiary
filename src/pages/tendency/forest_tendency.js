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
        const response = await fetch('http://localhost:3001/users/me'); // 사용자 정보 API 호출
        if (!response.ok) {
          throw new Error('서버에 오류가 발생했습니다.');
        }
        const data = await response.json();
        setUserNick(data.user_nick); // userNick 상태 업데이트
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData(); // 컴포넌트 마운트 시 사용자 정보 가져오기
  }, []);

  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    if (!userId || !token) {
      console.error('로그인 정보가 없습니다.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/tendency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ selection: '숲' }), // 서버로 전송할 데이터 ('숲')
      });

      if (!response.ok) {
        throw new Error('서버에 오류가 발생했습니다.');
      }

      const data = await response.json();
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCityTendencyClick = () => {
    navigate('/city_tendency');
  };

  return (
    <div className="Tendency">
      <GuidePopup/>
    <div className="Forest_Tendency">
      <Menu />
      <div className="forest_tendency">
        <div className="forest_tendency_info-box">
          <div className="forest_tendency_info-content">
            <div className="forest_tendency_info-header">
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
            <div className="forest_tendency_info-section">
              <h2>숲에는 이런 기능이 있어요</h2>
              <div className="forest_tendency_text-container">
                <p>
                  usdiary에서는 하루를 간단하고 즐겁게 기록할 수 있는 '오늘의 질문'이 제공됩니다. 일상적인 질문부터 깊이 있는 질문까지 다양한 주제로 하루를 색다르게 돌아보며 기록하는 시간을 가질 수 있습니다. 그날의 느낌과 생각을 자연스럽게 풀어내며, 일상에 새로운 시선을 더해보세요.
                </p>
              </div>
            </div>
            <button className="forest_tendency_submit-button" onClick={handleSubmit}>숲 성향으로 결정하기</button>
            <p className="forest_tendency_note">* 일주일 동안 성향 변경이 가능합니다</p>
          </div>
          <img src={BigtreeImage} alt="forest_tendency_Description" className="forest_tendency_info-image" />
          <button className="forest_tendency_city-tendency-button" onClick={handleCityTendencyClick}>
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
