import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import EditPost from './pages/admin/EditPost';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="new" element={<EditPost />} />
            <Route path="edit/:id" element={<EditPost />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
