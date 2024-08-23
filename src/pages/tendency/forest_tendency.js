import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import Menu from '../../components/menu';
import '../../assets/css/forest_tendency.css';
import BigtreeImage from '../../assets/images/bigtree.png';
import MincityImage from '../../assets/images/mincity.png'; 

function ForestTendency() {
  const navigate = useNavigate(); 

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/users/{user_id}/foresttendency', { // 서버 URL을 설정
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
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
              <h1>몽실님은 숲 성향이에요</h1> 
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