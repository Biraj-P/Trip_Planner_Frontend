import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './components/Dashboard/Dashboard';
import TripDetails from './components/TripDetails'; // Uncomment or ensure this import is correct

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/trip/:id" element={<TripDetails />} />
    </Routes>
  );
}
