import React from 'react';
import '../../assets/css/follow.css';
import '../../assets/css/contact.css';
import Menu from '../../components/menu';
import ProfileMenu from '../../components/profileMenu';

const Contact = () => {
    return (
        <div className='wrap'>
            <Menu />
            <div className='contact'>
                <ProfileMenu />
                <div className='contact-contents'>
                    <h1 className='contact-title'>고객 지원</h1>
                    <form className='contact-form'>
                        <div className='form-group'>
                            <label htmlFor='title'></label>
                            <input type='text' id='title' placeholder='제목' className='input-field' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='email'></label>
                            <input type='email' id='email' placeholder='답변 받으실 이메일을 입력해주세요 (필수입력)' className='input-field' />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='inquiry'></label>
                            <textarea id='inquiry' placeholder='문의 사항을 자유롭게 남겨주세요...' className='textarea-field' />
                        </div>
                        <button type='submit' className='submit-button'>제출</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
