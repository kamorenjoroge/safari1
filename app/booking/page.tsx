"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import {
  FaCar,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaCheck,
  FaUsers,
  FaGasPump,
  FaCog,
} from "react-icons/fa";
import Image from "next/image";
import BookingForm from "../components/BookingForm";

interface Schedule {
  date: string[];
}

interface CarType {
  description: string;
  priceFrom: string;
  features: string[];
}

interface Car {
  _id: string;
  model: string;
  type: CarType;
  image: string;
  schedule: Schedule[];
  priceFrom: string;
}

interface ApiResponse {
  success: boolean;
  data: Car;
  message?: string;
}

// Custom hook for fetching car data with axios
function useCarDetails(carId: string | null) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) {
        setError("No car ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching car with ID:", carId);

        const response = await axios.get<ApiResponse>(`/api/fleet/${carId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("API Response:", response.data);

        if (response.data.success) {
          setCar(response.data.data);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch car details"
          );
        }
      } catch (err) {
        console.error("Error fetching car:", err);
        if (axios.isAxiosError(err)) {
          setError(`Network error: ${err.message}`);
        } else {
          setError(
            err instanceof Error ? err.message : "An unexpected error occurred"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  return { car, loading, error };
}

// Enhanced Calendar Component
function BookingCalendar({ bookedDates }: { bookedDates: string[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayWeekday = firstDayOfMonth.getDay();

  // Create array of dates for the month
  const dates = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayWeekday; i++) {
    dates.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(day);
  }

  // Check if a date is booked
  const isDateBooked = (day: number) => {
    if (!day) return false;
    const dateToCheck = new Date(year, month, day).toISOString().split("T")[0];
    return bookedDates.some((bookedDate) => {
      const booked = new Date(bookedDate).toISOString().split("T")[0];
      return booked === dateToCheck;
    });
  };

  // Check if date is in the past
  const isPastDate = (day: number) => {
    if (!day) return false;
    const dateToCheck = new Date(year, month, day);
    return (
      dateToCheck <
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={goToPreviousMonth}
            className="p-2 sm:p-3 hover:bg-secondary rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <FaChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={goToNextMonth}
            className="p-2 sm:p-3 hover:bg-secondary rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <FaChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full shadow-sm"></div>
            <span className="text-gray-600 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-booked rounded-full shadow-sm"></div>
            <span className="text-gray-600 font-medium">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full shadow-sm"></div>
            <span className="text-gray-600 font-medium">Past</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm font-semibold text-gray-500 py-2 sm:py-3"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
          </div>
        ))}

        {/* Date cells */}
        {dates.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-8 sm:h-10 lg:h-12"></div>;
          }

          const isBooked = isDateBooked(day);
          const isPast = isPastDate(day);
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div
              key={index}
              className={`
                h-8 sm:h-10 lg:h-12 flex items-center justify-center text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer
                ${
                  isPast
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isBooked
                    ? "bg-booked text-white shadow-md hover:shadow-lg transform hover:scale-105"
                    : "bg-success text-white shadow-md hover:shadow-lg transform hover:scale-105 hover:bg-primary"
                }
                ${
                  isToday && !isBooked && !isPast
                    ? "ring-2 ring-accent ring-offset-1"
                    : ""
                }
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function BookingPageFallback() {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="relative mb-6">
          <FaSpinner className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto animate-spin" />
          <div className="absolute inset-0 bg-primary opacity-20 rounded-full animate-ping"></div>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
          Loading booking page...
        </h2>
      </div>
    </div>
  );
}

// Main booking page component wrapped with search params logic
function BookingPageContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("carid");

  const { car, loading, error } = useCarDetails(carId);

  // Extract booked dates from schedule
  const getBookedDates = (schedule: Schedule[]): string[] => {
    const bookedDates: string[] = [];
    schedule.forEach((scheduleItem) => {
      scheduleItem.date.forEach((date) => {
        bookedDates.push(date);
      });
    });
    return bookedDates;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
          <div className="relative mb-6">
            <FaSpinner className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto animate-spin" />
            <div className="absolute inset-0 bg-primary opacity-20 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            Loading vehicle details...
          </h2>
          <p className="text-gray-600 font-medium">Car ID: {carId}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
          <FaCar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            Failed to load vehicle
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-6">Car ID: {carId}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!car) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="text-center p-6 sm:p-8 bg-white rounded-2xl shadow-xl max-w-md w-full">
          <FaCar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            Vehicle not found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested vehicle could not be found.
          </p>
          <p className="text-sm text-gray-500 mb-6">Car ID: {carId}</p>
          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const bookedDates = getBookedDates(car.schedule || []);

  return (
    <div className="min-h-screen bg-secondary/5">
      {/* Hero Section */}
      <div className="relative bg-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-earth/10"></div>
        <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-earth mb-4">
              Book {car.model}
            </h1>
            <p className="text-lg sm:text-xl text-earth/80 max-w-2xl">
              Select your preferred dates and complete your booking for this
              premium vehicle
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Main Content */}
      <section className="relative -mt-8 px-4 pb-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Car Details */}
            <div className="xl:col-span-2 space-y-6">
              {/* Car Image and Basic Info */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="relative h-64 sm:h-80 lg:h-96">
                  <Image
                    src={car.image}
                    alt={car.model}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1280px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1 sm:px-4 sm:py-2">
                      <span className="text-xs sm:text-sm font-semibold text-gray-800">
                        Premium Vehicle
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                        {car.model}
                      </h2>
                      <p className="text-gray-600 text-lg">
                        {car.type.description}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right">
                      <div className="text-3xl sm:text-4xl font-bold text-primary">
                        KES {parseInt(car.type.priceFrom).toLocaleString()}
                      </div>
                      <span className="text-sm text-gray-500 font-medium">
                        /day
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Book Now
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="p-3 bg-primary rounded-xl mr-4">
                    <FaCar className="h-6 w-6 text-white" />
                  </div>
                  Vehicle Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {car.type.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-secondary transition-colors duration-200"
                    >
                      <div className="p-2 bg-success rounded-lg">
                        <FaCheck className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center border border-gray-100">
                  <div className="p-3 bg-primary rounded-xl w-fit mx-auto mb-3">
                    <FaUsers className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">5</div>
                  <div className="text-sm text-gray-600 font-medium">
                    Passengers
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center border border-gray-100">
                  <div className="p-3 bg-success rounded-xl w-fit mx-auto mb-3">
                    <FaGasPump className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">Auto</div>
                  <div className="text-sm text-gray-600 font-medium">
                    Transmission
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-center border border-gray-100 col-span-2 sm:col-span-1">
                  <div className="p-3 bg-earth rounded-xl w-fit mx-auto mb-3">
                    <FaCog className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">2024</div>
                  <div className="text-sm text-gray-600 font-medium">
                    Model Year
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Calendar */}
            <div className="xl:col-span-1">
              <div className="sticky top-4 sm:top-8">
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 flex items-center">
                    <div className="p-3 bg-primary rounded-xl mr-4">
                      <FaCalendarAlt className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    Availability
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Orange dates are already booked. Green dates are available
                    for your booking.
                  </p>
                </div>

                <BookingCalendar bookedDates={bookedDates} />

                {bookedDates.length > 0 && (
                  <div className="mt-6 p-4 sm:p-6 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-2xl">
                    <h4 className="text-sm sm:text-base font-bold text-earth mb-4 flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      Upcoming Bookings
                    </h4>
                    <div className="space-y-2">
                      {bookedDates.slice(0, 3).map((date, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white/60 rounded-lg"
                        >
                          <span className="text-xs sm:text-sm font-medium text-earth">
                            {new Date(date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-xs text-white bg-booked px-2 py-1 rounded-full">
                            Booked
                          </span>
                        </div>
                      ))}
                      {bookedDates.length > 3 && (
                        <div className="text-xs sm:text-sm text-accent font-medium text-center pt-2">
                          +{bookedDates.length - 3} more dates
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingForm />
    </div>
  );
}

// Main component that wraps everything in Suspense
const BookingPage = () => {
  return (
    <Suspense fallback={<BookingPageFallback />}>
      <BookingPageContent />
    </Suspense>
  );
};

export default BookingPage;