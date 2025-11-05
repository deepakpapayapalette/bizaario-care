import React, { useState } from 'react'
import Banner from '@components/common/Banner'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from "@mui/material";
import { FaPlus, FaMinus } from "react-icons/fa";
import bgRight from '@assets/images/website/contact/contact2.jpg'
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaLinkedinIn, FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import { useFormik } from 'formik'
import * as Yup from 'yup';

const socialLinks = [
  { icon: <FaLinkedinIn size={18} />, href: '#', label: 'Linkedin' },
  { icon: <FaFacebookF size={18} />, href: '#', label: 'Facbook' },
  { icon: <FaInstagram size={18} />, href: '#', label: 'Instagram' },
  { icon: <FaTwitter size={18} />, href: '#', label: 'Twitter' },
  { icon: <FaYoutube size={18} />, href: '#', label: 'Youtube' },
];

const faqs = [
  {
    question: "How do I register as a driver on the portal?",
    answer: "To register as a driver, click on the 'Sign Up' button on the homepage, fill in your personal details, upload required documents (driver's license, vehicle registration, insurance), and complete the verification process. Once approved, you'll receive a confirmation email and can start using the portal."
  },
  {
    question: "Is my data and information secure?",
    answer: "Yes, we take data security very seriously. All your personal information and driving data is encrypted using industry-standard SSL/TLS protocols. We comply with data protection regulations and never share your information with third parties without your explicit consent. Our systems undergo regular security audits to ensure maximum protection."
  },
  {
    question: "Can I manage my appointments through the portal?",
    answer: "Absolutely! The portal allows you to schedule, reschedule, and cancel appointments for vehicle maintenance, fitness checks, and training sessions. You'll receive reminders via email and SMS, and can view your complete appointment history in your dashboard."
  },
  {
    question: "Can I access the portal on my mobile phone?",
    answer: "Yes, our portal is fully responsive and optimized for mobile devices. You can access all features through your mobile browser, or download our dedicated mobile app available for both iOS and Android devices for an even better experience on the go."
  },
  {
    question: "How can I collaborate with other drivers or specialists?",
    answer: "The portal features a community section where you can connect with other drivers, share experiences, and learn best practices. You can also request consultations with road safety specialists, join discussion forums, and participate in group training sessions. Fleet managers can coordinate with their entire team through our collaboration tools."
  }
];


const bannerData = {
  // image: bannerImage,
  title: 'Contact Us',
  description: "Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection."
}
const ContactUs = () => {

  const userSchema = Yup.object({
    username: Yup.string().min(3).max(30).required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.number().min(10).required('Phone number is required'),
    message: Yup.string().required('Message is required'),
  });
  const initialValues = {
    username: '',
    email: '',
    phone: '',
    message: '',
  };

  const { handleSubmit, values, handleChange, errors, touched, handleBlur } = useFormik({
    validationSchema: userSchema,
    initialValues: initialValues,
    onSubmit: (values) => {
      console.log(values)
    }
  })
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const [expanded, setExpanded] = useState(false);
  const faqHandleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <>
      <Banner data={bannerData} />
      <div className='container space-top'>



      </div>
      <div className="container pt-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Section */}
          <div className="space-y-6">
            <div className='mb-6 '>
              <h2 className='text-2xl md:text-4xl font-semibold mb-2'>Let’s Talk</h2>
              <p className='text-para'>Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection.</p>
            </div>
            <div className=" space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <FiPhone className="text-lg" />
                <span>+91 5252525252</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FiMail className="text-lg" />
                <span>rjvijs42@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FiMapPin className="text-lg" />
                <span>
                  H-Block, Sector-63, Noida, Uttar Pradesh, 201301, India
                </span>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-5">
              <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
              <div className="flex space-x-5  flex-wrap">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-9 h-9 bg-webprimary hover:bg-gray-700 text-webprimary rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <span className='text-white'>
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* Right Section (Form) */}
          <div className=' relative  rounded-lg bg-cover bg-center bg-no-repeat overflow-hidden' style={{ backgroundImage: `url(${bgRight})` }}>
            <div className='bg-black/80 ' >
              <div className='p-6 z-50'>
                <p className="text-white mb-2">Contact Us</p>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                  Send a Message
                </h2>
                <form className="space-y-4 contact-form text-white" onSubmit={handleSubmit}>
                  <div>
                    {/* <label htmlFor="username" className="text-white mb-2 inline-block">Full Name</label> */}
                    <input
                      onChange={handleChange}
                      value={values.username}
                      onBlur={handleBlur}
                      name="username"
                      type="text"
                      placeholder="Full Name"
                      className={`placeholder-white w-full border border-white bg-transparent  rounded-md px-4 py-2 focus:outline-none ${errors.username && touched.username ? 'border-red-500' : ''}`}
                    /> <br />
                    {errors.username && touched.username ?
                      <p className="text-red-900 mt-1 text-sm">{errors.username}</p>
                      : null
                    }
                  </div>
                  <div>

                    {/* <label htmlFor="email" className="text-white mb-2 inline-block">Email ID</label> */}
                    <input
                      onChange={handleChange}
                      value={values.email}
                      name='email'
                      type="email"
                      placeholder="Email ID"
                      onBlur={handleBlur}
                      className={`placeholder-white w-full border border-white bg-transparent  rounded-md px-4 py-2 focus:outline-none   ${errors.email && touched.email ? 'border-red-500' : ''}`}
                    /> <br />
                    {errors.email && touched.email ?
                      <p className="text-red-900 mt-1 text-sm">{errors.email}</p>
                      : null
                    }
                  </div>
                  <div>
                    <input
                      maxLength={10}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      name='phone'
                      type="text"
                      placeholder="Phone No"
                      className={`placeholder-white w-full border border-white bg-transparent  rounded-md px-4 py-2 focus:outline-none ${errors.phone && touched.phone ? 'border-red-500' : ''}`}
                    /><br />
                    {errors.phone && touched.phone ?
                      <p className="text-red-900 mt-1 text-sm">{errors.phone}</p>
                      : null
                    }
                  </div>

                  <div>
                    {/* <label htmlFor="phone" className="text-white mb-2 inline-block">Message</label> */}
                    <textarea
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.message}
                      name='message'
                      placeholder="Message"
                      rows="4"
                      className={`placeholder-white w-full border border-white bg-transparent  rounded-md px-4 py-2 focus:outline-none  ${errors.message && touched.message ? 'border-red-500' : ''}`}
                    ></textarea><br />
                    {errors.message && touched.message ?
                      <p className="text-red-900 mt-1 text-sm">{errors.message}</p>
                      : null
                    }
                  </div>

                  <div className='w-full flex justify-end'>

                    <button
                      type="submit"

                    >
                      <div className="pt-4 animate-fadeInUp delay-300">
                        <div

                          className="relative inline-block px-8 py-3 border-2 border-white text-white font-semibold rounded-lg overflow-hidden hover:bg-white hover:text-webprimary transition-all duration-300"
                        >
                          <span className="relative z-10">Submit</span>
                          <div className="absolute inset-0 -left-full bg-white/20 animate-glow" />
                        </div>
                      </div>
                      {/* <IoMdSend /> */}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className='space-top'>
          <div>
            <div className="mt-6">
              <div className="google-map-img">
                <iframe width="100%" height="600" frameBorder="0" scrolling="no" marginHeight="0"
                  marginWidth="0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0316610097216!2d77.37369367550069!3d28.628813175666686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce50a6c1d4a9d%3A0x15e488fd7503f354!2sUsis%20Biz%20Park!5e0!3m2!1sen!2sin!4v1755211067744!5m2!1sen!2sin">
                  <a
                    href="https://www.gps.ie/collections/drones/"></a>
                </iframe>
              </div>
            </div>
          </div>

        </div>
        <div className="contact-faq space-top">
          <div className="">
            {/* Header Section */}
            <div className="mb-8 lg:mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-semibold text-webprimary mb-4">
                FAQs (Frequently Asked Questions)
              </h2>
              <p className="text-gray-600 text-base sm:text-lg ">Here are some sample FAQs for a Doctor Portal, suitable for a website or app used by doctors for managing appointments, patients, records, collaborations, etc
              </p>
            </div>

            {/* MUI Accordion */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={faqHandleChange(`panel${index}`)}
                  sx={{
                    background: 'white',
                    borderRadius: '6px !important',
                    // boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    '&:before': {
                      display: 'none',
                      fontSize: '18px',

                    },
                    '&.Mui-expanded': {
                      margin: '0 0 10px 0',
                    },
                    fontWeight: 'Normal',
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      expanded === `panel${index}` ? (
                        <FaMinus size={18} color="#000000" />
                      ) : (
                        <FaPlus size={18} color="#000000" />
                      )
                    }
                    sx={{
                      padding: '16px 18px',
                      '&:hover': {
                        background: 'gray-200',
                      },
                      '& .MuiAccordionSummary-content': {
                        margin: '0',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#000000',
                        fontSize: { xs: '16px', sm: '18px' },
                        fontWeight: 500,
                        paddingRight: '16px',
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      padding: '0 24px 24px 24px',
                      color: '#000000',
                      fontSize: { xs: '14px', sm: '16px' },
                      lineHeight: 1.7,
                    }}
                  >
                    <Typography sx={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactUs

