import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import App from './App'
import store from './store'
import { AuthProvider } from './context/AuthContext'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Provider>,
)
