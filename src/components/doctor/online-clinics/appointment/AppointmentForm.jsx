import React, { useState } from 'react'
import PaymentModal from '../payment/PaymentModal';
import { Dialog } from '@mui/material';
import ConfirmAppoint from './ConfirmAppoint';

const AppointmentForm = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null);
  const [isShowAvailable, setIsShowAvailable] = useState(false);
  const [paymentPopup, setPaymentPopup] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    emailId: '',
    emailId2: '',
    dateOfBirth: '',
    fees: '2000'
  })
  console.log(selectedDate, "selectedDate")

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  // Get day status (available, selected, not available)
  const getDayStatus = (day) => {
    if (!day) return null

    // Based on the image pattern
    const notAvailableDays = [5, 6, 7, 12, 13, 19, 20, 26, 27, 28]
    const availableDays = [10, 11, 14, 15, 16, 17, 18, 22, 24, 25, 29]

    if (notAvailableDays.includes(day)) return 'not-available'
    if (availableDays.includes(day)) return 'available'
    return 'neutral'
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day) => {
    if (day && getDayStatus(day) === 'available') {
      setSelectedDate(day)
    }
    setIsShowAvailable(true);
  }

  // Time slots data
  const timeSlots = [
    { time: '08:30 AM - 09:00AM', status: 'available' },
    { time: '09:30 AM - 10:00AM', status: 'selected' },
    { time: '11:30 AM - 12:00AM', status: 'available' },
    { time: '12:30 PM - 01:00PM', status: 'selected' },
    { time: '01:30 PM - 02:00PM', status: 'available' },
    { time: '02:30 PM - 03:00PM', status: 'selected' },
    { time: '03:30 PM - 04:00PM', status: 'available' },
    { time: '04:30 PM - 05:00PM', status: 'selected' }
  ];



  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = () => {
    console.log('Form submitted:', formData)
  }
  const calendarDays = generateCalendarDays();

  const handleTimeClick = (time) => {
    console.log('Selected time:', time);
    setSelectedTime(time);
  };

  const paymentFormSubmit = () => {
    handleSubmit();
    setPaymentPopup(true);
  }

  return (
    <div className="container md:py-20 py-10">
      <div className=" grid lg:grid-cols-2 grid-cols-1 lg:gap-12 gap-6 ">
        {/* Choose Date and Time Section */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold md:mb-8 mb-6">Choose Date and Time</h1>
          <div className="mb-8 md:p-6  bg-gray-50 rounded-lg">
            {/* Calendar */}
            <div className="mb-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  ‹
                </button>
                <span className="font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-webprimary text-white hover:opacity-90"
                >
                  ›
                </button>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7  gap-2 mb-2">
                {daysOfWeek.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 md:gap-2 gap-1">
                {calendarDays.map((day, index) => {
                  const status = getDayStatus(day)
                  return (
                    <div key={index}>
                      {day ? (
                        <button
                          onClick={() => handleDateClick(day)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                        ${status === 'available'
                              ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                              : status === 'not-available'
                                ? 'bg-red-500 text-white cursor-not-allowed'
                                : status === 'selected'
                                  ? 'bg-webprimary text-white'
                                  : 'bg-gray-200 text-gray-600'
                            }
                      `}
                          disabled={status === 'not-available' || status === 'neutral'}
                        >
                          {day}
                        </button>
                      ) : (
                        <div className="w-10 h-10"></div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>
        <div>
          {/* Legend */}
          <div className="flex gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-webprimary"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#56b0ff]"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-sm">Not Available</span>
            </div>
          </div>
          {selectedDate && (
            <h2 className="text-lg  font-semibold mb-4">Selected Date: {selectedDate} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          )}
          {/* Time Slots */}
          {isShowAvailable ? (
            <div className="space-y-3">
              <div className="grid md:grid-cols-3 grid-cols-2 gap-3">
                {timeSlots.map((slot, slotIndex) => (
                  <button
                    key={slotIndex}
                    onClick={() => handleTimeClick(slot.time)}
                    className={`
                          py-3 px-4 rounded text-sm font-medium transition-colors
                          ${selectedTime === slot.time
                        ? 'bg-webprimary text-white'
                        : slot.status === 'available'
                          ? 'bg-[#56b0ff] text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }
    `}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">No Time Slots Available</div>
          )}
        </div>
      </div>
      {selectedTime && (
        <div className='pt-8'>
          <h2 className="mdtext-2xl text-xl font-semibold mb-6">Appointment Form</h2>

          <div className="space-y-4">
            {/* Row 1 */}
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-webprimary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Mobile No."
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-webprimary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email ID</label>
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  placeholder="Email ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-webprimary"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email ID</label>
                <input
                  type="email"
                  name="emailId2"
                  value={formData.emailId2}
                  onChange={handleInputChange}
                  placeholder="Email ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-webprimary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date Of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  placeholder="Date Of Birth"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-webprimary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fees</label>
                <input
                  type="text"
                  name="fees"
                  value={formData.fees}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-webprimary"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                onClick={() => paymentFormSubmit()}
                className="px-8 py-3 bg-webprimary text-white font-semibold rounded hover:opacity-90 transition-opacity"
              >
                Make Payment
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ==========Payment-Modal============ */}

      <Dialog
        open={paymentPopup}
        onClose={() => setPaymentPopup(false)}
      >
        <div>
          <PaymentModal onClose={setPaymentPopup} onConfirm={setConfirmPopup} />
        </div>
      </Dialog>

      {/* ==========Confirm-Modal============ */}
      <Dialog
        open={confirmPopup}
        onClose={() => setConfirmPopup(false)}
      >
        <div>
          <ConfirmAppoint onClose={setConfirmPopup} />
        </div>
      </Dialog>

    </div>



  )
}

export default AppointmentForm

