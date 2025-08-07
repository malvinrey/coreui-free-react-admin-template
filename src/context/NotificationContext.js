import React, { createContext, useState, useContext, useCallback } from 'react'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, color) => {
    // Memberi ID unik agar React bisa membedakan setiap toast
    const id = Math.random().toString(36).substring(2, 11)
    setToasts((prevToasts) => [...prevToasts, { id, message, color, hidden: false }])
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  const hideToast = useCallback((id) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) => (toast.id === id ? { ...toast, hidden: true } : toast)),
    )
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const value = { addToast, clearToasts, hideToast, removeToast, toasts }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

// Custom hook untuk mempermudah pemanggilan
export const useNotifier = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifier must be used within a NotificationProvider')
  }
  return context
}
