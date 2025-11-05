import React from 'react'
import Banner from '@components/common/Banner'

const bannerData = {
  // image: bannerImage,
  title: 'Contact Us',
  description: "Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection."
}
const ContactUs = () => {
  return (
    <>
      <Banner data={bannerData} />
      <div className='container space-top'>
        <div className='md:w-4/5 mb-6 md:mb-0'>
          <h2 className='text-2xl md:text-4xl font-semibold mb-2'>Let’s Talk</h2>
          <p className='text-para'>Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection.</p>
        </div>
      </div>
    </>
  )
}

export default ContactUs

