import React from 'react'
import Banner from '@components/common/Banner'
import Swal from 'sweetalert2';
const bannerData = {
  // image: bannerImage,
  title: 'Terms of Use',
  description: "Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection."
}

const Terms = () => {
  function ModalPopup() {

    Swal.fire({

      


    })
  }
  return (
    <>
      <Banner data={bannerData} />

      <div className='container space-top'>
        <button onClick={ModalPopup}>
          modal
        </button>
        <div className='mb-8'>
          <h2 className='md:text-3xl text-2xl font-semibold mb-2'>Terms of Use</h2>
          <p className='text-para text-md mb-4'> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          <p className='text-para text-md mb-4'> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

        </div>




      </div>
    </>
  )
}

export default Terms;

export function Card() {
  <>
    <h1>Card Component</h1>
  </>
}

