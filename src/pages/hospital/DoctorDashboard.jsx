import React from 'react'
import Empowering from '@components/website/home/Empowering'
import MedaidBanner from '../../components/doctor/dashboard/MedaidBanner'
import Overview from '../../components/doctor/dashboard/Overview'
import PatientDetails from '../../components/doctor/dashboard/PatientDetails'
import TrustedMedicalExperts from '@components/website/home/TrustedMedicalExperts'
import PartnerHospitals from '@components/website/home/PartnerHospitals'
import LiveSessions from '@components/website/home/LiveSessions'
import OnlineClinics from '@components/website/home/OnlineClinics'
// import PatientDetails from '@components/doctor/dashboard/PatientDetails'

const DoctorDashboard = () => {
  return (
    <>
      <Empowering />
      <div className='container'>
        <MedaidBanner />
        <Overview />
        <PatientDetails />
      </div>
      <TrustedMedicalExperts />
      <PartnerHospitals />
      <div>
        <LiveSessions />
      </div>
      <OnlineClinics />
    </>
  )
}

export default DoctorDashboard
