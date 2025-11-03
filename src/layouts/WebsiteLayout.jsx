import React from 'react'


import { Outlet } from 'react-router-dom'
import Navbar from '../components/website/header-footer/Navbar'
import Footer from '../components/website/header-footer/Footer'

const WebsiteLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default WebsiteLayout
