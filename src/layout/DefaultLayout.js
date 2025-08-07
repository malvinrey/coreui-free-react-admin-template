import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import AppToaster from '../components/AppToaster'

const DefaultLayout = () => {
  return (
    <div>
      <AppToaster />

      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
