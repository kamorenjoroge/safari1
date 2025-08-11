'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaCar, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaIdCard, FaFileAlt, FaTimes } from 'react-icons/fa';

type Schedule = {
  date: Date[];
  available?: Date;
};

type BookingFormsProps = {
  _id: string;
  model: string;
  schedule: Schedule[];
  priceFrom: string;
};

const BookingForms: React.FC<BookingFormsProps> = ({ _id, model, priceFrom, schedule }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    specialRequests: ''
  });

  // Get all unavailable dates from schedule
  const getUnavailableDates = (): Date[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // midnight to compare cleanly

  return schedule.flatMap(s =>
    s.date
      .map(d => new Date(d))
      .filter(date => date >= today) // keep only today and future
  );
};

  const unavailableDates = getUnavailableDates();

  // Check if a date is unavailable
  const isDateUnavailable = (date: Date): boolean => {
    return unavailableDates.some(unavailable => 
      date.toDateString() === unavailable.toDateString()
    );
  };

  // Check if date is in the past
  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Check if date is selected
  const isDateSelected = (date: Date): boolean => {
    return selectedDates.some(selected => 
      selected.toDateString() === date.toDateString()
    );
  };

  // Handle date selection
  const handleDateClick = (date: Date): void => {
    if (isDateUnavailable(date) || isPastDate(date)) return;

    setSelectedDates(prev => {
      const isSelected = prev.some(d => d.toDateString() === date.toDateString());
      if (isSelected) {
        return prev.filter(d => d.toDateString() !== date.toDateString());
      } else {
        return [...prev, date].sort((a, b) => a.getTime() - b.getTime());
      }
    });
  };

  // Calculate total amount when selected dates change
  useEffect(() => {
    const dailyRate = parseFloat(priceFrom) || 0;
    setTotalAmount(dailyRate * selectedDates.length);
  }, [selectedDates, priceFrom]);

  // Generate calendar days for the current month view
  const generateCalendarDays = (): Date[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: Date[] = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Navigation functions
  const goToPreviousMonth = (): void => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = (): void => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle backdrop click (only close if clicking the backdrop itself)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (selectedDates.length === 0) {
      toast('Please select at least one date for booking');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.idNumber) {
      toast('Please fill in all required customer information');
      return;
    }

    setIsLoading(true);
    
    try {
      const bookingData = {
        carId: _id,
        model: model,
        selectedDates: selectedDates.map(date => date.toISOString()),
        totalAmount,
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          idNumber: formData.idNumber
        },
        specialRequests: formData.specialRequests,
        status: 'pending'
      };

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        toast.success('Booking submitted successfully!');
        // Reset form and close modal
        setSelectedDates([]);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          idNumber: '',
          specialRequests: ''
        });
        setIsModalOpen(false);
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast('Failed to submit booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <>
      {/* Book Now Button - Always visible */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Book Now
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-dark/70 bg-opacity-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Modal container - prevent event bubbling */}
          <div 
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Modal header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-earth">
                    Book {model}
                  </h3>
                  <p className="text-primary font-medium">
                    KES {parseFloat(priceFrom).toLocaleString()} per day
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  type="button"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Calendar Section */}
                <div className="bg-light p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <FaCalendarAlt className="text-primary" />
                    <h3 className="text-xl font-semibold text-earth">Select Booking Dates</h3>
                  </div>
                  
                  {/* Calendar Navigation */}
                  <div className="flex justify-between items-center mb-6">
                    <button
                      type="button"
                      onClick={goToPreviousMonth}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                    >
                      Previous
                    </button>
                    <h4 className="text-lg font-medium text-earth">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h4>
                    <button
                      type="button"
                      onClick={goToNextMonth}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
                    >
                      Next
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center font-medium text-dark text-sm">
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((date, index) => {
                      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                      const isUnavailable = isDateUnavailable(date);
                      const isPast = isPastDate(date);
                      const isSelected = isDateSelected(date);
                      
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleDateClick(date)}
                          disabled={isUnavailable || isPast}
                          className={`
                            p-2 text-sm rounded-lg transition-all
                            ${!isCurrentMonth ? 'text-dark' : ''}
                            ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                            ${isUnavailable ? 'bg-danger/70 text-light cursor-not-allowed line-through' : ''}
                            ${isSelected ? 'bg-primary text-white font-bold' : ''}
                            ${!isUnavailable && !isPast && !isSelected && isCurrentMonth ? 
                              'hover:bg-accent/90 cursor-pointer text-earth' : ''}
                          `}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar Legend */}
                  <div className="flex flex-wrap gap-4 text-sm text-earth/80">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-primary rounded"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-danger rounded"></div>
                      <span>Unavailable</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-accent rounded"></div>
                      <span>Available</span>
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                {selectedDates.length > 0 && (
                  <div className="bg-primary-light/20 p-6 rounded-xl border border-primary">
                    <h4 className="text-xl font-semibold text-earth mb-4">Booking Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-earth/80">
                      <div>
                        <p className="font-medium text-earth">Selected Dates:</p>
                        <p>{selectedDates.map(d => d.toLocaleDateString()).join(', ')}</p>
                      </div>
                      <div>
                        <p className="font-medium text-earth">Number of Days:</p>
                        <p>{selectedDates.length}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-2xl font-bold text-primary">
                        Total Amount: KES {totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Customer Information Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaUser className="text-primary" />
                    <h3 className="text-xl font-semibold text-earth">Customer Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-earth">Full Name *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-earth/50" />
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-earth"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-earth">Email *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-earth/50" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-earth"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-earth">Phone Number *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-earth/50" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-earth"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-earth">ID Number *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaIdCard className="text-earth/50" />
                        </div>
                        <input
                          type="text"
                          name="idNumber"
                          value={formData.idNumber}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-earth"
                          placeholder="Enter your ID number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-earth">Special Requests</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3">
                        <FaFileAlt className="text-earth/50" />
                      </div>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        rows={3}
                        maxLength={500}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-earth"
                        placeholder="Any special requests or requirements..."
                      />
                    </div>
                    <p className="text-xs text-earth/50 mt-1">
                      {formData.specialRequests.length}/500 characters
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={selectedDates.length === 0 || isLoading}
                    className={`
                      w-full py-3 px-6 rounded-lg font-medium text-white transition-colors
                      flex items-center justify-center gap-2
                      ${selectedDates.length === 0 || isLoading 
                        ? 'bg-dark cursor-not-allowed' 
                        : 'bg-primary hover:bg-primary-dark'
                      }
                    `}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCar />
                        Confirm Booking - KES {totalAmount.toLocaleString()}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForms;