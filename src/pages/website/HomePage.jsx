import React, { lazy, Suspense, useEffect } from 'react'
import Loader from '@components/website/Loader'

// import Hero from '../../components/website/home/Hero';
const Hero = lazy(() => import('../../components/website/home/Hero'))
const Empowering = lazy(() => import('../../components/website/home/Empowering'))
const TrustedMedicalExperts = lazy(() => import('../../components/website/home/TrustedMedicalExperts'))
const PartnerHospitals = lazy(() => import('../../components/website/home/PartnerHospitals'))

const HomePage = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <Suspense fallback={<Loader />}>
      <Hero />
      <Empowering />
      <TrustedMedicalExperts />
      <PartnerHospitals />
    </Suspense>
  )
}

export default HomePage
