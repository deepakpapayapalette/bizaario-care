import React from 'react'
import AdminLayout from '../layouts/AdminLayout'
import { Route, Routes } from 'react-router-dom'
import DoctorDashboard from '../pages/doctor/DoctorDashboard'
import ErrorPage from '../pages/ErrorPage'

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<DoctorDashboard />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  )
}

export default DoctorRoutes

