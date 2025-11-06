import React, { useState } from 'react';
import { X, CreditCard } from 'lucide-react';

export default function PaymentModal({ onClose, onConfirm }) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: ''
  });
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    { id: 'card', name: 'Card', icon: '💳' },
    { id: 'visa', name: 'Visa', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
    { id: 'gpay', name: 'G Pay', icon: '🔵' },
    { id: 'phonepe', name: 'PhonePe', icon: '🟣' }
  ];

  const months = [
    { value: '', label: 'Month' },
    { value: '01', label: '01 - January' },
    { value: '02', label: '02 - February' },
    { value: '03', label: '03 - March' },
    { value: '04', label: '04 - April' },
    { value: '05', label: '05 - May' },
    { value: '06', label: '06 - June' },
    { value: '07', label: '07 - July' },
    { value: '08', label: '08 - August' },
    { value: '09', label: '09 - September' },
    { value: '10', label: '10 - October' },
    { value: '11', label: '11 - November' },
    { value: '12', label: '12 - December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = [
    { value: '', label: 'Year' },
    ...Array.from({ length: 15 }, (_, i) => ({
      value: String(currentYear + i),
      label: String(currentYear + i)
    }))
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.replace(/\s/g, '').length > 16) return;
    }

    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!formData.expiryMonth) {
      newErrors.expiryMonth = 'Month is required';
    }

    if (!formData.expiryYear) {
      newErrors.expiryYear = 'Year is required';
    }

    if (!formData.cvc || formData.cvc.length < 3) {
      newErrors.cvc = 'Please enter a valid CVC';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Payment submitted:', formData);
      alert('Payment processed successfully!');
      // setIsOpen(false);
      onClose(false);
      onConfirm(true);
    }


  };

  // if (!isOpen) {
  //   return (
  //     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  //       <button
  //         onClick={() => setIsOpen(true)}
  //         className="px-6 py-3 text-white rounded-lg"
  //         style={{ backgroundColor: 'var(--primary)' }}
  //       >
  //         Open Payment Modal
  //       </button>
  //     </div>
  //   );
  // }
  // const paymentFormSubmitted = () => {
  //   handleSubmit();
  //   onClose(false);
  //   onConfirm(true);
  // }

  return (
    <div className="">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative">
        <button
          onClick={() => onClose(false)}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Make Payment</h1>

          <div className="grid grid-cols-5 gap-3 mb-8">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-xl border-2 transition-all ${selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="text-3xl mb-1">{method.icon}</div>
                <div className="text-xs text-gray-600">{method.name}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">CARD DETAILS</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="Card Number"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="Cardholder Name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.cardholderName && (
                    <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <select
                        name="expiryMonth"
                        value={formData.expiryMonth}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white ${errors.expiryMonth ? 'border-red-500' : 'border-gray-300'
                          }`}
                      >
                        {months.map(month => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                      {errors.expiryMonth && (
                        <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>
                      )}
                    </div>
                    <div>
                      <select
                        name="expiryYear"
                        value={formData.expiryYear}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white ${errors.expiryYear ? 'border-red-500' : 'border-gray-300'
                          }`}
                      >
                        {years.map(year => (
                          <option key={year.value} value={year.value}>
                            {year.label}
                          </option>
                        ))}
                      </select>
                      {errors.expiryYear && (
                        <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    placeholder="CVC"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.cvc ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.cvc && (
                    <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity bg-webprimary"

            >
              Pay Now
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}
