import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/menu';
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
      const response = await fetch(`http://localhost:3001/users/{userId}/tendency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ selection: 'forest' }), // 서버로 전송할 데이터 ('forest')
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ligula sapien, rutrum sed vestibulum eget, rhoncus ac erat. Aliquam erat volutpat. Sed convallis scelerisque enim at fermentum.
                </p>
              </div>
            </div>
            <div className="forest_tendency_info-section">
              <h2>숲에는 이런 기능이 있어요</h2>
              <div className="forest_tendency_text-container">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ligula sapien, rutrum sed vestibulum eget, rhoncus ac erat. Aliquam erat volutpat. Sed convallis scelerisque enim at fermentum.
                </p>
              </div>
            </div>
            <button className="forest_tendency_submit-button" onClick={handleSubmit}>숲 성향으로 결정하기</button>
            <p className="forest_tende_ncynote">* 일주일 동안 성향 변경이 가능합니다</p>
          </div>
          <img src={BigtreeImage} alt="forest_tendency_Description" className="forest_tendency_info-image" />
          <button className="forest_tendency_city-tendency-button" onClick={handleCityTendencyClick}>
            <img src={MincityImage} alt="forest_tendency_City Tendency" className="forest_tendency_city-image" />
            도시 성향 보러가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForestTendency;
