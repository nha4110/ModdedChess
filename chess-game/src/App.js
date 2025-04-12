import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<ChessGame />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
