import React from 'react'
import AwardCard from '@components/common/AwardCard';



const AwardTabConent = ({ hospitalData }) => {

  const awards = hospitalData?.awardsRecognitions;
  return (
    <div className='grid gap-4 lg:grid-cols-3 md:grid-cols-2 lg:gap-6'>
      {awards.map((item, index) => (
        <AwardCard key={item._id || item.id || index} award={item} />
      ))}

    </div>
  )
}

export default AwardTabConent

