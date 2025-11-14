import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import PatientDetails from '../../components/doctor/dashboard/PatientDetails';

const PatientReferralHome = () => {
  const location = useLocation();
  const patient_details = location.state.patient_details;
  const patientId = patient_details._id;
  const [selected_case_file, setselected_case_file] = useState("");

  return (
    <div className='container mt-8'>
      <div >
        <div className='flex gap-4 flex-wrap pt-4'>
          <button className='theme-btn'>Medical Consultation</button>
          <button className='theme-btn'>Video Consultation</button>
          <button className='theme-btn'>SOS Response</button>
          <button className='theme-btn'>Treatment Plan</button>
          <button className='theme-btn'>Action</button>
        </div>

        <PatientDetails patientId={patientId} />
      </div>

    </div>
  )
}

export default PatientReferralHome

