import React from 'react'
const medicalSpecialties = [
  { _id: 1, label: "Cardiology", lookup_value: "cardiology" },
  { _id: 2, label: "Orthopedics", lookup_value: "orthopedics" },
  { _id: 3, label: "Pediatrics", lookup_value: "pediatrics" },
  { _id: 4, label: "Neurology", lookup_value: "neurology" },
  { _id: 5, label: "Obstetrics & Gynecology", lookup_value: "obstetrics-gynecology" },
  { _id: 6, label: "Otorhinolaryngology", lookup_value: "otorhinolaryngology" },
  { _id: 7, label: "Plastic & Reconstructive Surgery", lookup_value: "plastic-reconstructive-surgery" },
  { _id: 8, label: "Gastroenterology", lookup_value: "gastroenterology" }
];

const SpecialtiesTabContent = ({ hospitalData }) => {
  // Use dynamic specialties from hospitalData or fallback to static data
  const specialties = hospitalData?.specialties || medicalSpecialties;
  
  return (
    <div className='pt-3 ps-8'>
      <ul>
        {specialties?.map((specialty, index) => (
          <li key={specialty?._id || index} className='pb-3 text-xl list-disc'>
            {specialty?.lookup_value || specialty}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SpecialtiesTabContent

