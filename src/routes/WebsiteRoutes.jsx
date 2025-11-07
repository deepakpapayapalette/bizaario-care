import React from 'react'
import WebsiteLayout from '../layouts/WebsiteLayout'
import { Route, Routes } from 'react-router-dom'
import HomePage from '../pages/website/HomePage'
import ErrorPage from '../pages/ErrorPage'
import About from '../pages/website/About'
import HospitalPartner from '../pages/website/HospitalPartner'
import MedicalBoard from '../pages/website/MedicalBoard'
import NewsArticlesPage from '../pages/website/NewsArticlesPage'
import ContactUs from '../pages/website/ContactUs'
import NewsDetail from '../pages/website/NewsDetail'
import DoctorDetails from '@components/doctor/doctor-profile/DoctorDetails'
import AppointmentForm from '@components/doctor/online-clinics/appointment/AppointmentForm'
import HospitalDetails from '@components/hospital/hospital-profile/HospitalDetails'
import OnlineMeeting from '@components/doctor/online-clinics/online-meeting/OnlineMeeting'
import CompletedConsultation from '../components/doctor/online-clinics/appointment/CompletedConsultation'


const WebsiteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/hospital-partners" element={<HospitalPartner />} />
        <Route path="/hospital-partners/:id" element={<HospitalDetails />} />
        <Route path="/medical-board" element={<MedicalBoard />} />
        <Route path="/news-articles" element={<NewsArticlesPage />} />
        <Route path="/news-articles/:id" element={<NewsDetail />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/medical-board/:id" element={<DoctorDetails />} />
        <Route path="/appointment-form" element={<AppointmentForm />} />
        <Route path="/online-meeting" element={<OnlineMeeting />} />
        <Route path="/completed-consultation" element={<CompletedConsultation />} />

        {/* Catch-all */}
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  )
}

export default WebsiteRoutes
