// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WalletConnect from './WalletConnect';
import ChessGame from './pages/ChessGame';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Modded Chess</h1>
      <WalletConnect />
      <Link to="/play">
        <button style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
          Play
        </button>
      </Link>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<ChessGame />} />
      </Routes>
    </Router>
  );
};

export default App;
