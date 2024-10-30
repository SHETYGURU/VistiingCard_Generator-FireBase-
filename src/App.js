import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import Profile from './components/ProfileComponent';
import Dashboard from './components/Dashboard';
import Editor from "./components/Editor";
import Templates from "./components/Templates";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/editor/:templateId" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
