import React, { createContext, useState, useContext, useEffect } from 'react'
import { login as apiLogin, logout as apiLogout } from '../services/Api' // Sesuaikan path

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Memeriksa sessionStorage saat aplikasi pertama kali dimuat
    try {
      const storedToken = sessionStorage.getItem('token')
      const storedUser = sessionStorage.getItem('user')

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      }
    } catch (error) {
      console.error('Gagal memuat state autentikasi:', error)
    } finally {
      setLoading(false)
    }
  }, []) // Dependensi kosong, hanya berjalan sekali

  const login = async (email, password) => {
    const response = await apiLogin(email, password)
    const { user, token } = response.data

    sessionStorage.setItem('user', JSON.stringify(user))
    sessionStorage.setItem('token', token)

    setUser(user)
    setToken(token)
  }

  const logout = async () => {
    // Selalu panggil API logout terlebih dahulu jika ada
    try {
      if (token) {
        await apiLogout()
      }
    } catch (error) {
      console.error('API logout gagal:', error)
    } finally {
      // Pastikan untuk MENGHAPUS item, bukan mengaturnya menjadi null
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')

      setUser(null)
      setToken(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
