import React, { useEffect } from 'react'
import { CToast, CToastBody, CToaster } from '@coreui/react'
import { useNotifier } from '../context/NotificationContext'

const AppToaster = () => {
  const { toasts, hideToast } = useNotifier()

  // Auto-hide toasts after 5 seconds (but keep in history)
  useEffect(() => {
    const timers = toasts
      .filter((toast) => !toast.hidden) // Only hide visible toasts
      .map((toast) => {
        return setTimeout(() => {
          hideToast(toast.id)
        }, 5000)
      })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts, hideToast])

  return (
    <CToaster placement="top-end">
      {toasts
        .filter((toast) => !toast.hidden) // Only show visible toasts
        .map((toast) => (
          <CToast
            key={toast.id}
            autohide={false}
            visible={true}
            color={toast.color}
            onClose={() => hideToast(toast.id)}
          >
            <CToastBody>{toast.message}</CToastBody>
          </CToast>
        ))}
    </CToaster>
  )
}

export default AppToaster
