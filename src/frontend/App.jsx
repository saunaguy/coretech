import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LinuxPage from './pages/LinuxPage';
import BoardPage from './pages/BoardPage';
import QnAPage from './pages/QnAPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/linux" element={<LinuxPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/qna" element={<QnAPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Layout>
  );
}

export default App;