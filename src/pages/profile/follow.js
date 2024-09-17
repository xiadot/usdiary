import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/follow.css';
import Menu from '../../components/menu';
import SearchMooner from './searchMooner';

import profile from '../../assets/images/profile.png';
import my_rate from '../../assets/images/my_rate.png';
import contect_us from '../../assets/images/contect_us.png';
import follow from '../../assets/images/follow.png';
import log_out from '../../assets/images/log_out.png';
import search from '../../assets/images/search.png';

const Follow = () => {
    // 서버로부터 받은 데이터를 저장할 상태
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);

    // 검색어 상태 저장
    const [followersSearchTerm, setFollowersSearchTerm] = useState('');
    const [followingsSearchTerm, setFollowingsSearchTerm] = useState('');

    // 팝업
    const [showPopup, setShowPopup] = useState(false);

    // 서버에서 데이터 가져오기 (팔로워, 팔로잉)
    useEffect(() => {
        axios.get('/follow') // 서버에서 데이터를 가져오는 API 주소
            .then(response => {
                setFollowers(response.data); // 데이터를 상태에 저장
            })
            .catch(error => {
                console.error('Error fetching followers:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('/follow')
            .then(response => {
                setFollowings(response.data);
            })
            .catch(error => {
                console.error('Error fetching followings:', error);
            });
    }, []);

    // 팝업 상태에 따라 스크롤 제어
    useEffect(() => {
        if (showPopup) {
            document.body.style.overflow = 'hidden'; // 팝업이 뜨면 스크롤 막기
        } else {
            document.body.style.overflow = 'auto';   // 팝업이 닫히면 스크롤 다시 허용
        }

        // cleanup function to reset overflow when component unmounts
        return () => {
            document.body.style.overflow = 'auto';   // 컴포넌트가 사라질 때 스크롤 원상복구
        };
    }, [showPopup]);

    // 검색어에 맞춰 팔로워 필터링
    const filteredFollowers = followers.filter(follower => 
        follower.nickname.includes(followersSearchTerm) || follower.id.includes(followersSearchTerm)
    );

    // 검색어에 맞춰 팔로잉 필터링
    const filteredFollowings = followings.filter(following => 
        following.nickname.includes(followingsSearchTerm) || following.id.includes(followingsSearchTerm)
    );

    return (
        <div className='wrap'>
            <Menu/>
            
            <div className='profile'>
                <div className='profile-menu'>
                    <div className='profile-menu_content'>
                        <div className='profile-menu_content_img'><img src={profile} alt="Profile Icon" /></div>
                        <div className='profile-menu_content_name'>Profile</div>
                    </div>
                    <div className='profile-menu_content'>
                        <div className='profile-menu_content_img'><img src={my_rate} alt="My Rate Icon" /></div>
                        <div className='profile-menu_content_name'>My rate</div>
                    </div>
                    <div className='profile-menu_content'>
                        <div className='profile-menu_content_img'><img src={contect_us}  alt="Contact Us Icon" /></div>
                        <div className='profile-menu_content_name'>Contect Us</div>
                    </div>
                    <div className='profile-menu_content'>
                        <div className='profile-menu_content_img'><img src={follow} alt="Follow Icon" /></div>
                        <div className='profile-menu_content_name'>Follow</div>
                    </div>
                    <div className='profile-menu_content'>
                        <div className='profile-menu_content_img'><img src={log_out} alt="Log Out Icon" /></div>
                        <div className='profile-menu_content_name'>Log out</div>
                    </div>
                </div>
                <div className='profile-contents'>
                <div className='profile-search' onClick={() => setShowPopup(true)}>무너 찾기</div>
                {showPopup && <SearchMooner onClose={() => setShowPopup(false)} />}
                    <div className='profile-follow'>
                        <div className='profile-follow_box'>
                            <div className='profile-follow_box_name'>나를 팔로우 하는 사람</div>
                            <div className='profile-follow_box_content'>
                                <div className='profile-follow_box_content_search'>
                                    <img src={search} alt="Search Icon" />
                                    <input 
                                        type="text" 
                                        className='profile-follow_box_content_search_name' 
                                        placeholder="검색"
                                        value={followersSearchTerm} // 검색어 상태 반영
                                        onChange={e => setFollowersSearchTerm(e.target.value)} // 입력 값 업데이트
                                    />
                                </div>
                                <div className='profile-follow_box_content_box'>
                                    {filteredFollowers.map((follower, index) => (
                                        <div key={index} className='profile-follow_box_content_box_friend'>
                                            <img src={follower.image} className='profile-follow_box_content_box_friend_img' alt={follower.nickname} />
                                            <div className='profile-follow_box_content_box_friend_text'>
                                                <div className='profile-follow_box_content_box_friend_text_nickname'>{follower.nickname}</div>
                                                <div className='profile-follow_box_content_box_friend_text_id'>{follower.id}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='profile-follow_box'>
                            <div className='profile-follow_box_name'>내가 팔로우 하는 사람</div>
                            <div className='profile-follow_box_content'>
                                <div className='profile-follow_box_content_search'>
                                    <img src={search} alt="Search Icon" />
                                    <input 
                                        type="text" 
                                        className='profile-follow_box_content_search_name' 
                                        placeholder="검색"
                                        value={followingsSearchTerm} // 검색어 상태 반영
                                        onChange={e => setFollowingsSearchTerm(e.target.value)} // 입력 값 업데이트
                                    />
                                </div>
                                <div className='profile-follow_box_content_box'>
                                    {filteredFollowings.map((following, index) => (
                                        <div key={index} className='profile-follow_box_content_box_friend'>
                                            <img src={following.image} className='profile-follow_box_content_box_friend_img' alt='profile'/>
                                            <div className='profile-follow_box_content_box_friend_text'>
                                                <div className='profile-follow_box_content_box_friend_text_nickname'>{following.nickname}</div>
                                                <div className='profile-follow_box_content_box_friend_text_id'>{following.id}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Follow;
