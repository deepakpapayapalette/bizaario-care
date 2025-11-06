import React from 'react'
import AwardCard from '@components/common/AwardCard';

const AwardTabConent = ({ doctorData }) => {
  const awards = doctorData?.awardsRecognitions;
  return (
    <div className='grid gap-4 lg:grid-cols-3 md:grid-cols-2 lg:gap-6'>
      {awards.map((item, index) => (
        <AwardCard item={item} key={index} />
      ))}
    </div>
  )
}

export default AwardTabConent

