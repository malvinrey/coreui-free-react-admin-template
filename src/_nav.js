import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCalculator, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Stock Opname',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    items: [
      { component: CNavItem, name: 'Products', to: '/products' },
      { component: CNavItem, name: 'Vendors', to: '/vendors' },
      { component: CNavItem, name: 'Opname History', to: '/opname-history' },
      { component: CNavItem, name: 'Stock In', to: '/stock-in' },
      { component: CNavItem, name: 'Stock Out', to: '/stock-out' },
    ],
  },
]

export default _nav
