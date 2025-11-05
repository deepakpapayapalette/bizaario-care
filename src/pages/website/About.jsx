import React from 'react'
import Banner from '../../components/common/Banner'
import bannerImage from '@assets/images/website/banner.png'
import team1 from '@assets/images/website/about/team1.png'
import team2 from '@assets/images/website/about/team2.png'
import team3 from '@assets/images/website/about/team3.png'
import team4 from '@assets/images/website/about/team4.png'
import team5 from '@assets/images/website/about/team5.png'
import team6 from '@assets/images/website/about/team6.png'
import team7 from '@assets/images/website/about/team7.png'
import team8 from '@assets/images/website/about/team8.png'
import NewsAndArticles from '@components/website/home/NewsAndArticles'


const About = () => {
  const bannerData = {
    image: bannerImage,
    title: 'About Us',
    description: "Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection."
  }

  const teamMemberArr = [
    {
      id: 1,
      name: ' Jenny Wilson',
      deg: 'Viverra ut potenti',
      image: team1
    },
    {
      id: 2,
      name: ' Jenny Wilson',
      deg: 'Viverra ut potenti',
      image: team2
    },
    {
      id: 3,
      name: ' Jenny Wilson',
      deg: 'Viverra ut potenti',
      image: team3
    },
    {
      id: 4,
      name: ' Jenny Wilson',
      deg: 'Viverra ut potenti',
      image: team4
    },
    {
      id: 5,
      name: ' Jenny Wilson',
      deg: 'Viverra ut potenti',
      image: team5
    },
    {
      id: 6,
      name: ' Jenny Wilson',
      deg: 'Viverra ut potenti',
      image: team6
    },
    {
      id: 7,
      name: ' Jenny Wilson',
      deg: 'Viverra ut potenti',
      image: team7
    },

    {
      id: 8,
      name: ' Jenny Wilson',
      deg: 'Viverra ut potenti',
      image: team8
    },

  ]

  return (
    <>
      <Banner data={bannerData} />
      <div className='space-top container'>
        <div className=' rounded-3xl bg-[#eff1fe] px-6 py-8'>
          <h2 className=' text-black text-3xl leading-normal mb-2 font-semibold'>Who We are?</h2>
          <p className='text-md text-webPara'>We are dedicated to providing reliable testing services across various industries, ensuring safety, quality, and compliance. With a team of experts and trusted lab partners, we deliver precise and timely results, helping our customers meet the highest standards. Our commitment to excellence drives everything we do, making us a trusted partner in quality assurance. We work closely with clients to understand their unique needs, offering customized solutions that ensure product integrity and regulatory compliance. Our focus on innovation, accuracy, and customer satisfaction sets us apart as a leader in the testing services industry.</p>
        </div>
      </div>
      <div className='space-top container'>
        <div className=' rounded-3xl bg-[#eff1fe] px-6 py-8'>
          <h2 className=' text-black text-3xl leading-normal mb-2 font-semibold'>Our Mission</h2>
          <p className='text-md text-webPara'>Our mission is to deliver accurate, reliable, and timely testing services that ensure the safety, quality, and compliance of products across industries. We strive to provide exceptional value to our customers through innovative solutions, expert knowledge, and a commitment to excellence. Our goal is to be a trusted partner in quality assurance, helping businesses meet industry standards and protect consumer well-being.</p>
        </div>
      </div>

      <div className='container space-top'>
        <div>
          <h2 className='text-black text-3xl leading-normal mb-2 font-semibold'>Meet Our Team</h2>
          <p className='light-color'>Meet Our Leadership Team  Our leadership team brings together expertise and vision, driving innovation and ensuring the highest standards of service.</p>
        </div>
        <div className='flex flex-wrap '>
          {teamMemberArr.map((item) => (
            <div key={item.id} className='w-full md:w-1/2 lg:w-1/4 p-4 '>
              <div className='flex flex-col items-center'>
                <div className='mb-3'>
                  <img src={item.image} alt="team" className='w-30 h-30 object-cover rounded-full' />
                </div>
                <h3 className='text-xl font-semibold'>{item.name}</h3>
                <p className='text-md  text-para'>{item.deg}</p>
              </div>
            </div>
          ))}

        </div>

      </div>
      <div className='space-top'>
        <NewsAndArticles />
      </div>

    </>
  )
}

export default About

