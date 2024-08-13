import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/login';

const App = () => {

  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 경로 */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;