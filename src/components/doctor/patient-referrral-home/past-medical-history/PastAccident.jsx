import { __postApiData, __putApiData, __getApiData } from "@utils/api";
import UniqueLoader from '../../../common/UniqueLoader';
import Swal from 'sweetalert2';
import React from 'react';
import { Plus, Edit } from 'lucide-react';
import { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, Button, Dialog, } from '@mui/material';
const PastAccident = ({ patientId, selected_case_file, case_file_data, onRefresh }) => {

  const [caseFiles, setCaseFiles] = useState([])
  const getall_case_file = async () => {
    try {
      const resp = await __getApiData(
        `/api/v1/admin/patientCaseFile/listPatientCaseFile?PatientId=${patientId}`
      );
      const pastCases = resp.data?.list?.filter(
        (item) => item.Status === "Past"
      ) || [];

      setCaseFiles(pastCases);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getall_case_file()
  }, [])
  return (
    <div className="space mt-4">


      {/* Header */}
      <div className="flex items-center justify-between mt-2  border-b border-gray-200">
        <h3 className="text-xxl font-semibold text-gray-900">
          Past Accident/ Trauma
        </h3>

      </div>

      <div className='col-span-2'>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4  p-4">
          <div className="col-span-2">
            <FormControl fullWidth size="small">
              <div className="flex flex-wrap gap-2">
                {caseFiles.map((item) => (
                  <span
                    key={item._id}
                    className="px-3 py-1 text-sm rounded-md cursor-pointer flex items-center gap-2"
                  >
                    {/* Show all diseases inside this item */}
                    {item.Accident && item.Accident.length > 0 ? (
                      item.Accident.map((accident) => (
                        <span key={accident._id} className="bg-gray-200 px-2 py-0.5 rounded">
                          {accident.lookup_value}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </span>
                ))}
              </div>

            </FormControl>
          </div>
        </div>


      </div>






      {/* Footer Note */}
      {/* <div className="p-4 bg-gray-50 border-t border-gray-200" style={{display:selected_case_file?"flex":"none"}}>
        <p className="text-xs text-gray-600">
          1. Added By Dr Gaurav Pande (Cardiology) (Regards M1234), (Contact 8373915529, Date/ Time 20 Sep 2025, 11:57 AM IST, Noida
        </p>
      </div> */}



      {/* ===========================loader================================================ */}
      {/* {isloading && (
                      <div
                        style={{
                          position: 'fixed',
                          inset: 0,
                          background: 'rgba(255, 255, 255, 0.6)',
                          zIndex: 9999,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <UniqueLoader />
                      </div>
                    )}
                     */}

    </div>
  )
}

export default PastAccident
