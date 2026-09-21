import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HotelList from './pages/HotelList';
import HotelDetail from './pages/HotelDetail';
import HotelForm from './components/HotelForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HotelList />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/add" element={<HotelForm />} />
        <Route path="/edit/:id" element={<HotelForm />} />
      </Routes>
    </Router>
  );
}

export default App;