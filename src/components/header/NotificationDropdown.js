import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilBell } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNotifier } from '../../context/NotificationContext'

const NotificationDropdown = () => {
  const { toasts, clearToasts } = useNotifier()

  // Get recent notifications (last 5) - show all including hidden ones
  const recentNotifications = toasts.slice(-5).reverse()

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <div style={{ position: 'relative' }}>
          <CIcon icon={cilBell} size="lg" />
          {toasts.length > 0 && (
            <CBadge
              color="danger"
              className="position-absolute"
              style={{
                top: '-5px',
                right: '-5px',
                fontSize: '0.6rem',
                minWidth: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {toasts.length > 99 ? '99+' : toasts.length}
            </CBadge>
          )}
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end" style={{ minWidth: '300px' }}>
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          Notifications
          {toasts.length > 0 && (
            <CBadge color="primary" className="ms-2">
              {toasts.length}
            </CBadge>
          )}
        </CDropdownHeader>
        {recentNotifications.length === 0 ? (
          <CDropdownItem disabled>
            <div className="text-center text-muted py-2">No notifications</div>
          </CDropdownItem>
        ) : (
          recentNotifications.map((toast) => (
            <CDropdownItem key={toast.id} disabled>
              <div className="d-flex align-items-center">
                <div
                  className={`me-2 rounded-circle`}
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor:
                      toast.color === 'success'
                        ? '#198754'
                        : toast.color === 'danger'
                          ? '#dc3545'
                          : toast.color === 'warning'
                            ? '#ffc107'
                            : '#0d6efd',
                  }}
                />
                <div className="flex-grow-1">
                  <div className="small">{toast.message}</div>
                </div>
              </div>
            </CDropdownItem>
          ))
        )}
        {toasts.length > 5 && (
          <>
            <CDropdownDivider />
            <CDropdownItem disabled>
              <div className="text-center text-muted small">
                Showing {recentNotifications.length} of {toasts.length} notifications
              </div>
            </CDropdownItem>
          </>
        )}
        {toasts.length > 0 && (
          <>
            <CDropdownDivider />
            <CDropdownItem as="button" onClick={clearToasts}>
              <div className="text-center text-muted small">Clear all notifications</div>
            </CDropdownItem>
          </>
        )}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default NotificationDropdown
