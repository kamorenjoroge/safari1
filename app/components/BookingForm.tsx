import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaFileAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import toast from "react-hot-toast";

type ScheduleItem = {
  date: Date[];
};

type BookingFormProps = {
  _id: string;
  model: string;
  schedule: ScheduleItem[];
  price: number;
};

const BookingForm = ({ _id, model, schedule, price }: BookingFormProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    specialRequests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Flatten all booked dates for easy checking
  const bookedDates = schedule.flatMap((item) =>
    item.date.map((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date;
    })
  );
  // Function to check if a date is booked
  const isDateBooked = (date: Date) => {
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    return bookedDates.some(
      (bookedDate) => bookedDate.getTime() === dateToCheck.getTime()
    );
  };

  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      days.push(new Date(year, month - 1, day));
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Next month days to fill 6 weeks (42 days)
    const daysToAdd = 42 - days.length;
    for (let i = 1; i <= daysToAdd; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const handleDateClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Don't allow selection of past dates or booked dates
    if (date < today || isDateBooked(date)) {
      return;
    }

    setSelectedDates((prev) => {
      const dateToCheck = new Date(date);
      dateToCheck.setHours(0, 0, 0, 0);

      const existingIndex = prev.findIndex((d) => {
        const prevDate = new Date(d);
        prevDate.setHours(0, 0, 0, 0);
        return prevDate.getTime() === dateToCheck.getTime();
      });

      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [...prev, date].sort((a, b) => a.getTime() - b.getTime());
      }
    });
  };

  const handleMonthChange = (increment: number) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await axios.post("/api/booking", {
        carId: _id,
        totalAmount: price * selectedDates.length,
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          idNumber: formData.idNumber,
        },
        specialRequests: formData.specialRequests,
        schedule: {
          date: selectedDates,
          available: true,
        },
      });

      if (response.status === 201) {
        // Reset form and close modal on success
        setSelectedDates([]);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          idNumber: "",
          specialRequests: "",
        });
        setIsModalOpen(false);
        toast.success("Successfully Book !");
      }
    } catch (error) {
      setSubmitError("Failed to submit booking. Please try again.");
      toast.error("Booking failed. Please try again.");
      console.error("Booking error:", error);
      toast.error("An error occurred while processing your booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const totalPrice = price * selectedDates.length;

  return (
    <div className=" border-earth-light rounded-lg bg-light shadow-primary transition-default hover:shadow-md">
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 w-full bg-primary hover:bg-primary-dark text-light font-medium py-2 px-4 rounded-lg transition-default shadow hover:shadow-md"
      >
        Book This Vehicle
      </button>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 bg-opacity-70">
          <div
            className="bg-light rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary-dark">
                  Book {model}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-earth hover:text-primary-dark transition-default"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Calendar Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => handleMonthChange(-1)}
                    className="p-2 text-earth hover:text-primary-dark transition-default"
                  >
                    <FaChevronLeft />
                  </button>
                  <h4 className="text-lg font-semibold text-primary">
                    {monthName}
                  </h4>
                  <button
                    onClick={() => handleMonthChange(1)}
                    className="p-2 text-earth hover:text-primary-dark transition-default"
                  >
                    <FaChevronRight />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-primary-glow"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const dayDate = day.getDate();
                    const isCurrentMonth =
                      day.getMonth() === currentMonth.getMonth();
                    const isPast =
                      day < new Date(new Date().setHours(0, 0, 0, 0));
                    const isBooked = isDateBooked(day);
                    const isSelected = selectedDates.some((d) => {
                      const selectedDate = new Date(d);
                      selectedDate.setHours(0, 0, 0, 0);
                      const checkDate = new Date(day);
                      checkDate.setHours(0, 0, 0, 0);
                      return selectedDate.getTime() === checkDate.getTime();
                    });

                    let dayClasses =
                      "text-center p-2 rounded-full cursor-pointer transition-default ";

                    if (!isCurrentMonth) {
                      dayClasses += "text-earth-light opacity-50";
                    } else if (isPast ) {
                      dayClasses +=
                        "bg-secondary-dark text-earth-light opacity-50 cursor-not-allowed";
                    } else if (isBooked) {
                        dayClasses += "bg-accent/60 text-light cursor-disabled ";
                        
                    }
                    
                    else if (isSelected) {
                      dayClasses += "bg-primary text-light";
                    } else {
                      dayClasses += "hover:bg-secondary text-earth-dark";
                    }

                    return (
                      <div
                        key={index}
                        className={dayClasses}
                        onClick={() => handleDateClick(day)}
                      >
                        {dayDate}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Dates */}
              {selectedDates.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-primary mb-2">
                    Selected Dates:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDates.map((date, index) => (
                      <div
                        key={index}
                        className="bg-primary/10 text-primary-dark px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        <button
                          onClick={() => handleDateClick(date)}
                          className="ml-2 text-earth-light hover:text-primary-dark"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Form */}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-earth-light" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-secondary-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3 text-earth-light" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-secondary-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <FaPhone className="absolute left-3 top-3 text-earth-light" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-secondary-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <FaIdCard className="absolute left-3 top-3 text-earth-light" />
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      placeholder="ID Number"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-secondary-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <FaFileAlt className="absolute left-3 top-3 text-earth-light" />
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Special Requests (Optional)"
                      rows={3}
                      className="w-full pl-10 pr-4 py-2 border border-secondary-dark rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Total Price */}
                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold text-primary-dark">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-accent">
                    Kes {totalPrice.toLocaleString()}
                    <span className="text-sm text-earth ml-1">
                      ({selectedDates.length} day
                      {selectedDates.length !== 1 ? "s" : ""} × Kes
                      {price.toLocaleString()})
                    </span>
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || selectedDates.length === 0}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-default ${
                    selectedDates.length === 0
                      ? "bg-secondary-dark text-earth-light cursor-not-allowed"
                      : "bg-primary hover:bg-primary-dark text-light shadow hover:shadow-md"
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </button>

                {submitError && (
                  <p className="mt-3 text-danger text-center">{submitError}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
