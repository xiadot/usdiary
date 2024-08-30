import React from 'react';
import '../../assets/css/map.css';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/menu';
import mapImage from '../../assets/images/map.png';
import mapLine from '../../assets/images/map_line.png';
import seaImage from '../../assets/images/sea_map.png';
import friendImage from '../../assets/images/friend_map.png';
import forestImage from '../../assets/images/forest_map.png';
import citymage from '../../assets/images/city_map.png';



const Map = () => {
    const navigate = useNavigate();

    const handleForestClick = (e) => {
        e.preventDefault();
        navigate('/forest')
    }

    const handleCityClick = (e) => {
        e.preventDefault();
        navigate('/city')
    }

    const handleSeaClick = (e) => {
        e.preventDefault();
        navigate('/sea')
    }

    const handleFriendClick = (e) => {
        e.preventDefault();
        navigate('/friend')
    }

    return (
        <div className='map-wrap'>
            <Menu />
            <img src={mapImage} alt="Map" className='map-image' />
            <img src={mapLine} alt="Line" className='map-line' />
            <img src={seaImage} alt="Sea" onClick={handleSeaClick} className="top-image sea-image" />
            <img src={friendImage} alt="Friend" onClick={handleFriendClick} className="top-image friend-image" />
            <img src={forestImage} alt="Forest" onClick={handleForestClick} className="bottom-image forest-image" />
            <img src={citymage} alt="City" onClick={handleCityClick} className="bottom-image city-image" />
        </div>
    );
};

export default Map;
