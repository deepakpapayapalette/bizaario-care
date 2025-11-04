import React, { lazy, Suspense, useEffect } from 'react'
import Loader from '@components/website/Loader'


// import Hero from '../../components/website/home/Hero';
const Hero = lazy(() => import('../../components/website/home/Hero'))
const Empowering = lazy(() => import('../../components/website/home/Empowering'))
const TrustedMedicalExperts = lazy(() => import('../../components/website/home/TrustedMedicalExperts'))
const PartnerHospitals = lazy(() => import('../../components/website/home/PartnerHospitals'))
const InterCollabs = lazy(() => import('../../components/website/home/InterCollabs'))
const LiveSessions = lazy(() => import('../../components/website/home/LiveSessions'))
const OnlineClinics = lazy(() => import('../../components/website/home/OnlineClinics'))
const BizaarioStore = lazy(() => import('../../components/website/home/BizaarioStore'))
const AwardsCertification = lazy(() => import('../../components/website/home/AwardsCertification'))
const NewsAndArticles = lazy(() => import('../../components/website/home/NewsAndArticles'))
const PatientsTestimonials = lazy(() => import('../../components/website/home/PatientsTestimonials'))


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
      <InterCollabs />
      <LiveSessions />
      <OnlineClinics />
      <BizaarioStore />
      <AwardsCertification />
      <NewsAndArticles />
      <PatientsTestimonials />
    </Suspense>
  )
}

export default HomePage
