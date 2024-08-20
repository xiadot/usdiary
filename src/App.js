import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/login';
import FindId from './pages/login/id-find';
import FindPwd from './pages/login/pw-find';

const App = () => {

  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 경로 */}
        <Route path="/" element={<Login />} />
        
        <Route path="/findId" element={<FindId />} />

        <Route path="/findPwd" element={<FindPwd />} />

      </Routes>
    </Router>
  );
};

export default App;