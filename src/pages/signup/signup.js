import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../../assets/css/signup.css'; // 기존 CSS 파일 임포트

Modal.setAppElement('#main'); // 모달 접근성을 위한 설정

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        nickname: '', 
        userId: '',
        password: '',
        passwordConfirm: '',
        email: '',
        tel: '',
        birthdate: '',
        gender: '',
    });
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [errors, setErrors] = useState({});
    const [isCodeValid, setIsCodeValid] = useState(false);
    const [emailVerificationStatus, setEmailVerificationStatus] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false); // 모달 상태 추가
    const [error, setError] = useState(''); // 오류 상태 추가
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false); // 인증 모달 상태 추가
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleCodeChange = (e, index) => {
        const newCode = [...verificationCode];
        newCode[index] = e.target.value;
        if (e.target.value && index < 5) {
            document.getElementById(`code-${index + 1}`).focus();
        }
        setVerificationCode(newCode);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) newErrors.username = '이름을 입력해주세요.';
        if (!formData.nickname) newErrors.nickname = '닉네임을 입력해주세요.'; 
        if (!formData.userId) newErrors.userId = '아이디를 입력해주세요.';
        if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';
        if (!formData.passwordConfirm) newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
        if (!formData.email) newErrors.email = '이메일을 입력해주세요.';
        if (!formData.birthdate) newErrors.birthdate = '생일을 입력해주세요.';

        if (formData.password && !/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,15}$/.test(formData.password)) {
            newErrors.password = '특수문자를 포함한 6~15자로 입력해주시기 바랍니다.';
        }

        if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        }

        if (formData.email && !isCodeValid) {
            newErrors.email = '이메일 인증을 하지 않았습니다.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const signupData = {
                username: formData.username,
                nickname: formData.nickname,
                userId: formData.userId,
                password: formData.password,
                email: formData.email,
                tel: formData.tel,
                birthdate: formData.birthdate,
                gender: formData.gender,
            };

            try {
                // 서버에 POST 요청 보내기
                const response = await fetch('http://localhost:3001/registration', { // 서버 URL 확인
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(signupData),
                });

                const result = await response.json();

                if (response.ok) {
                    navigate('/home');
                    // 회원가입 성공 처리
                    console.log('회원가입 성공:', result);
                    setError(''); // 오류 상태 초기화
                } else {
                    // 회원가입 실패 처리
                    console.error('회원가입 실패:', result.message);
                    setError(result.message); // 오류 상태 설정
                    setModalIsOpen(true); // 모달 열기
                }
            } catch (error) {
                console.error('회원가입 중 오류 발생:', error);
                setError('회원가입 중 오류가 발생했습니다.'); // 오류 상태 설정
                setModalIsOpen(true); // 모달 열기
            }
        }
    };

    const handleCodeVerification = async () => {
        try {
            const response = await fetch('/api/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: verificationCode.join('') }),
            });
            const result = await response.json();
    
            if (result.success) {
                setIsCodeValid(true);
                setEmailVerificationStatus('이메일 인증이 완료되었습니다.');
                setIsVerificationModalOpen(false); // 인증 모달 닫기
            } else {
                setEmailVerificationStatus('인증 코드가 올바르지 않습니다. 다시 시도해 주세요.');
            }
        } catch (error) {
            setEmailVerificationStatus('오류가 발생했습니다. 나중에 다시 시도해 주세요.');
        }
    };    

    const handleOpenPopup = () => setIsVerificationModalOpen(true); // 이메일 인증 모달 열기
    const handleClosePopup = () => {
        setIsVerificationModalOpen(false); // 인증 모달 닫기
        setModalIsOpen(false); // 오류 모달 닫기
    };

    const handleIdCheck = async () => {
        try {
            const response = await fetch('http://localhost:3001/registration/check-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: formData.userId }),
            });

            const result = await response.json();

            if (response.ok) {
                if (result.exists) {
                    setErrors(prevErrors => ({ ...prevErrors, userId: '이미 사용하고 있는 아이디 입니다. 다른 아이디로 다시 입력해주세요.' }));
                } else {
                    setErrors(prevErrors => ({ ...prevErrors, userId: '사용 가능한 아이디입니다.' }));
                }
            } else {
                console.error('아이디 체크 실패:', result.message);
                setErrors(prevErrors => ({ ...prevErrors, userId: result.message }));
            }
        } catch (error) {
            console.error('아이디 체크 중 오류 발생:', error);
            setErrors(prevErrors => ({ ...prevErrors, userId: '아이디 체크 중 오류가 발생했습니다.' }));
        }
    };

    const handleNicknameCheck = async () => {
        try {
            const response = await fetch('http://localhost:3001/registration/check-nickname', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nickname: formData.nickname }),
            });

            const result = await response.json();

            if (response.ok) {
                if (result.exists) {
                    setErrors(prevErrors => ({ ...prevErrors, nickname: '이미 사용하고 있는 닉네임입니다. 다른 닉네임으로 다시 입력해주세요.' }));
                } else {
                    setErrors(prevErrors => ({ ...prevErrors, nickname: '사용 가능한 닉네임입니다.' }));
                }
            } else {
                console.error('닉네임 체크 실패:', result.message);
                setErrors(prevErrors => ({ ...prevErrors, nickname: result.message }));  
            }
        } catch (error) {
            console.error('닉네임 체크 중 오류 발생:', error);
            setErrors(prevErrors => ({ ...prevErrors, nickname: '닉네임 체크 중 오류가 발생했습니다.' }));
        }
    };

    return (
        <div className="SignUp">
            <form onSubmit={handleSubmit} className="SignUp-page__form">
                <h2 className="SignUp-page__form-title">회원가입 하기</h2>
                
                <div className="SignUp-page__input-group">
                    <label htmlFor="username" className="SignUp-page__label">이름 *</label>
                    <div className="SignUp-page__input-wrapper">
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleInputChange}
                            className="SignUp-page__input"
                            placeholder="이름 입력"
                        />
                    </div>
                    {errors.username && <small className="SignUp-page__error-message">{errors.username}</small>}
                </div>

                <div className="SignUp-page__input-group">
                    <label htmlFor="nickname" className="SignUp-page__label">닉네임 *</label>
                    <div className="SignUp-page__input-wrapper">
                        <input 
                            type="text" 
                            id="nickname" 
                            name="nickname" 
                            value={formData.nickname} 
                            onChange={handleInputChange}
                            className="SignUp-page__input"
                            placeholder="닉네임 입력"
                        />
                        <button type="button" className="SignUp-page__input-check-button" onClick={handleNicknameCheck}>중복 확인</button>
                    </div>
                    {errors.nickname && <small className="SignUp-page__error-message">{errors.nickname}</small>}
                </div>

                <div className="SignUp-page__input-group">
                    <label htmlFor="userId" className="SignUp-page__label">아이디 *</label>
                    <div className="SignUp-page__input-wrapper">
                        <input 
                            type="text" 
                            id="userId" 
                            name="userId" 
                            value={formData.userId} 
                            onChange={handleInputChange}
                            className="SignUp-page__input"
                            placeholder="아이디 입력"
                        />
                        <button type="button" className="SignUp-page__input-check-button" onClick={handleIdCheck}>중복 확인</button>
                    </div>
                    {errors.userId && <small className="SignUp-page__error-message">{errors.userId}</small>}
                </div>

                <div className="SignUp-page__input-group">
                    <label htmlFor="password" className="SignUp-page__label">비밀번호 *</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleInputChange}
                        className="SignUp-page__input"
                        placeholder="비밀번호 입력 (특수문자 포함, 6~15글자)"
                    />
                    {errors.password && <small className="SignUp-page__error-message">{errors.password}</small>}
                </div>

                <div className="SignUp-page__input-group">
                    <label htmlFor="passwordConfirm" className="SignUp-page__label">비밀번호 확인 *</label>
                    <input 
                        type="password" 
                        id="passwordConfirm" 
                        name="passwordConfirm" 
                        value={formData.passwordConfirm} 
                        onChange={handleInputChange}
                        className="SignUp-page__input"
                        placeholder="비밀번호를 다시 입력해주세요."
                    />
                    {errors.passwordConfirm && <small className="SignUp-page__error-message">{errors.passwordConfirm}</small>}
                </div>

                <div className="SignUp-page__input-group">
                    <label htmlFor="email" className="SignUp-page__label">이메일 *</label>
                    <div className="SignUp-page__input-wrapper">
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleInputChange}
                            className="SignUp-page__input"
                            placeholder="이메일 입력"
                        />
                        <button type="button" className="SignUp-page__input-check-button" onClick={handleOpenPopup}>이메일 인증</button>
                    </div>
                    {errors.email && <small className="SignUp-page__error-message">{errors.email}</small>}
                </div>

                <div className="SignUp-page__input-group">
                    <label htmlFor="tel" className="SignUp-page__label">전화번호</label>
                    <input 
                        type="tel" 
                        id="tel" 
                        name="tel" 
                        value={formData.tel} 
                        onChange={handleInputChange}
                        className="SignUp-page__input"
                        placeholder="010-XXXX-XXXX"
                    />
                </div>

                <div className="SignUp-page__date-gender-wrapper">
                    <div className="SignUp-page__input-date">
                        <label htmlFor="birthdate" className="SignUp-page__label">생일 *</label>
                        <input 
                            type="date" 
                            id="birthdate" 
                            name="birthdate" 
                            value={formData.birthdate} 
                            onChange={handleInputChange}
                            className="SignUp-page__input-date"
                        />
                        {errors.birthdate && <small className="SignUp-page__error-message">{errors.birthdate}</small>}
                    </div>

                    <div className="SignUp-page__input-gender">
                        <label htmlFor="gender" className="SignUp-page__label">성별 *</label>
                        <select 
                            id="gender" 
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleInputChange}
                            className="SignUp-page__input-gender"
                        >
                            <option value="">선택하세요</option>
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                        </select>
                        {errors.gender && <small className="SignUp-page__error-message">{errors.gender}</small>}
                    </div>
                </div>

                <button type="submit" className="SignUp-page__submit-button">Create Account</button>

                {/* 오류 모달 */}
                <Modal 
                    isOpen={modalIsOpen} 
                    onRequestClose={handleClosePopup} 
                    className="SignUp-page__popup"
                >
                    <div className="SignUp-page__popup-content">
                        <span className="SignUp-page__popup-close" onClick={handleClosePopup}>×</span>
                        <h2 className="SignUp-page__popup-title">회원가입 오류</h2>
                        <p>{error}</p>
                        <button className="SignUp-page__code-submit-button" onClick={handleClosePopup}>확인</button>
                    </div>
                </Modal>

                {/* 이메일 인증 모달 */}
                <Modal 
                    isOpen={isVerificationModalOpen} 
                    onRequestClose={handleClosePopup} 
                    className="SignUp-page__popup"
                >
                    <div className="SignUp-page__popup-content">
                        <span className="SignUp-page__popup-close" onClick={handleClosePopup}>×</span>
                        <h2 className="SignUp-page__popup-title">이메일 인증</h2>
                        <p>{formData.username} 님의 메일로 인증번호를 전송했습니다.</p>
                        <p>확인된 인증번호를 작성해주세요.</p>
                        <div className="SignUp-page__code-inputs">
                            {verificationCode.map((code, index) => (
                                <input 
                                    key={index} 
                                    type="text" 
                                    id={`code-${index}`} 
                                    className="SignUp-page__code-input" 
                                    maxLength="1"
                                    value={code}
                                    onChange={(e) => handleCodeChange(e, index)}
                                />
                            ))}
                        </div>
                        <button className="SignUp-page__code-submit-button" onClick={handleCodeVerification}>인증하기</button>
                        <p>{emailVerificationStatus}</p>
                    </div>
                </Modal>
            </form>
        </div>
    );
};

export default SignUp;
