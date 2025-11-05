
import { Route, Routes } from 'react-router-dom'
import WebsiteRoutes from './routes/WebsiteRoutes'

import AdminRoutes from './routes/AdminRoutes'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'

function App() {

  return (
    <Routes>
      <Route path="/*" element={<WebsiteRoutes />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  )
}

export default App
