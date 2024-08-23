import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import Menu from '../../src/components/menu';
import '../../src/assets/css/city_tendency.css';
import BigcityImage from '../../src/assets/images/bigcity.png'; 
import MintreeImage from '../../src/assets/images/mintree.png'; 

function CityTendency() {
  const navigate = useNavigate(); 
  
  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/users/{user_id}/citytendency', { // 서버 URL을 설정
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ selection: 'city' }), // 서버로 전송할 데이터 ('city')
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
    navigate('/forest_tendency'); 
  };

  return (
    <div className="city_Tendency">
      <Menu /> 
      <div className="city_tendency">
        <div className="city_tendency_info-box">
          <div className="city_tendency_info-content">
            <div className="city_tendency_info-header">
              <h1>몽실님은 숲 성향이에요</h1> 
            </div>
            <div className="city_tendency_info-section">
              <h2>도시란?</h2> 
              <div className="city_tendency_text-container">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ligula sapien, rutrum sed vestibulum eget, rhoncus ac erat. Aliquam erat volutpat. Sed convallis scelerisque enim at fermentum.
                </p> 
              </div>
            </div>
            <div className="city_tendency_info-section">
              <h2>도시에는 이런 기능이 있어요</h2> 
              <div className="city_tendency_text-container">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ligula sapien, rutrum sed vestibulum eget, rhoncus ac erat. Aliquam erat volutpat. Sed convallis scelerisque enim at fermentum.
                </p> 
              </div>
            </div>
            <button className="city_tendency_submit-button" onClick={handleSubmit}>도시 성향으로 결정하기</button>
            <p className="city_tende_ncynote">* 일주일 동안 성향 변경이 가능합니다</p> 
          </div>
          <img src={BigcityImage} alt="city_tendency_Description" className="city_tendency_info-image" /> 
          <button className="city_tendency_city-tendency-button" onClick={handleCityTendencyClick}>
            <img src={MintreeImage} alt="city_tendency_City Tendency" className="city_tendency_city-image" /> 
            숲 성향 보러가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CityTendency;