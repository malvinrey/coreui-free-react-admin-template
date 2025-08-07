import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  toasts: [], // Array untuk menyimpan semua notifikasi toast
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addToast: (state, action) => {
      // Menambahkan toast baru ke dalam array
      const { message, color } = action.payload
      const id = Math.random().toString(36).substr(2, 9)
      state.toasts.push({ id, message, color })
    },
    removeToast: (state, action) => {
      // Menghapus toast berdasarkan ID (opsional, untuk toast yang bisa ditutup manual)
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload.id)
    },
  },
})

export const { addToast, removeToast } = notificationSlice.actions
export default notificationSlice.reducer
