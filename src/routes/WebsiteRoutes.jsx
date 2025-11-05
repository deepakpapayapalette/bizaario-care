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

const WebsiteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/hospital-partners" element={<HospitalPartner />} />
        <Route path="/medical-board" element={<MedicalBoard />} />
        <Route path="/news-articles" element={<NewsArticlesPage />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Catch-all */}
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  )
}

export default WebsiteRoutes
