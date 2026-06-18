import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/seller/Dashboard'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function SellerRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'seller') return <Navigate to="/" />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/seller/dashboard" element={<SellerRoute><Dashboard /></SellerRoute>} />
      <Route path="/produto/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
    </Routes>
  )
}

import ProductDetail from './pages/ProductDetail'