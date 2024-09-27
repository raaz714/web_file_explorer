import { React } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import createStore from 'react-auth-kit/createStore'
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
import AuthProvider from 'react-auth-kit'
import AppView from './components/AppView'
import SignIn from './components/SignIn'

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
})

function App() {
  return (
    <AuthProvider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path={'/login'} element={<SignIn />} />
          <Route element={<AuthOutlet fallbackPath='/login' />}>
            <Route path='*' element={<AppView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
