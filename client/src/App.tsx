import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.scss'
import { MainPage } from './pages/MainPage'
import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout><MainPage/></Layout>} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* <Route path='/profile' element={<ProtectedRoute>
          <ProfilePage/>
        </ProtectedRoute>}/> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
