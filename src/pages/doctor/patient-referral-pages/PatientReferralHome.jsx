import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import PatientDetails from '../../../components/doctor/dashboard/PatientDetails';
import PatientDoctorDetails from '../../../components/doctor/patient-referrral-home/PatientDoctorDetails';
import CurrentProblemMain from '../../../components/doctor/patient-referrral-home/CurrentProblemMain';
import PatientProfilingMain from '../../../components/doctor/patient-referrral-home/PatientProfilingMain';
import OpenMedicalCaseFiles from '../../../components/doctor/patient-referrral-home/open-medical-case-files/OpenMedicalCaseFiles';
import PastMedicalHistoryMain from '../../../components/doctor/patient-referrral-home/PastMedicalHistoryMain';

const PatientReferralHome = () => {
  const location = useLocation();



  const patient_details = location?.state?.patient_details;

  const patientId = location?.state?._id;
  const [selected_case_file, setselected_case_file] = useState();

  return (
    <div className=' mt-8'>
      <div className='container'>
        <div className='flex gap-4 flex-wrap pt-4'>
          <button className='theme-btn'>Medical Consultation</button>
          <button className='theme-btn'>Video Consultation</button>
          <button className='theme-btn'>SOS Response</button>
          <button className='theme-btn'>Treatment Plan</button>
          <button className='theme-btn'>Action</button>
        </div>

      </div>
      <PatientDoctorDetails patientId={patientId} />

      <div className='container mt-8'>

        <CurrentProblemMain
          patientId={patientId}
          selected_case_file={selected_case_file}
        />
      </div>
      <div className='my-8'>


        <PatientProfilingMain
          patientId={patientId}
          selected_case_file={selected_case_file}
        />

        <div className='container  mt-8'>



          <OpenMedicalCaseFiles
            patientId={patientId}
            patient_details={patient_details}
            setselected_case_file={setselected_case_file}
          />

        </div>



        <PastMedicalHistoryMain
          patientId={patientId}
          selected_case_file={selected_case_file}
        />
        {/*
        <DoctorQueryForPatientReferralMain
          patientId={patientId}
          selected_case_file={selected_case_file}
        /> */}


      </div>
    </div>
  )
}

export default PatientReferralHome

