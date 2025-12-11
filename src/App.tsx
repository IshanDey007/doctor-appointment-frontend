import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Booking from './pages/Booking';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/booking/:id" element={<Booking />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;