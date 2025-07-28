import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext' // Sesuaikan path

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth()

  if (loading) {
    // Menampilkan spinner dari CoreUI akan lebih baik
    return (
      <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse"></div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
