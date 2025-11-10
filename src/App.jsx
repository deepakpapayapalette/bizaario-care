
import { Route, Routes } from 'react-router-dom'
import WebsiteRoutes from './routes/WebsiteRoutes'

import AdminRoutes from './routes/AdminRoutes'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import DoctorRoutes from './routes/DoctorRoutes'
import Unauthorized from './pages/Unauthorized'


function App() {

  return (
    <Routes>
      <Route path="/*" element={<WebsiteRoutes />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admindashboard/*" element={<AdminRoutes />} />
      <Route path="doctordashboard/*" element={<DoctorRoutes />} />
      <Route path="/unauthorized" element={<Unauthorized />} />


    </Routes>
  )
}

export default App
