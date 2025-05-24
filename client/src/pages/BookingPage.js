import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { DatePicker, message, Button, Card, Skeleton, Alert, Select } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import "../styles/BookingPage.css";

const { Option } = Select;

// Generate time options from 9 AM to 5 PM in 30-minute intervals
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 9; hour <= 17; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    options.push(`${hourStr}:00`);
    options.push(`${hourStr}:30`);
  }
  return options;
};

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState({
    fetch: true,
    check: false,
    book: false
  });
  const dispatch = useDispatch();
  const timeOptions = generateTimeOptions();

  // Get doctor's working hours
  const getDoctorHours = () => {
    if (!doctor?.timings?.length) return { start: 9, end: 17 };
    
    const startTime = doctor.timings[0];
    const endTime = doctor.timings[1];
    
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    
    return { start: startHour, end: endHour };
  };

  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching doctor information");
    } finally {
      setLoading(prev => ({ ...prev, fetch: false }));
    }
  };

  const handleAvailability = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      return message.warning("Please select both date and time");
    }

    try {
      setLoading(prev => ({ ...prev, check: true }));
      dispatch(showLoading());

      const formattedDate = moment(selectedDate).format("DD-MM-YYYY");
      
      // Log the request data
      console.log("Checking availability with:", {
        endpoint: "/api/v1/user/booking-availability",
        data: {
          doctorId: params.doctorId,
          date: formattedDate,
          time: selectedTime
        }
      });

      const res = await axios.post(
        "/api/v1/user/booking-availability",
        {
          doctorId: params.doctorId,
          date: formattedDate,
          time: selectedTime
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Log successful response
      console.log("Availability response:", res.data);

      dispatch(hideLoading());
      
      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message || "Time slot is available");
      } else {
        setIsAvailable(false);
        message.error(res.data.message || "This time slot is not available");
      }
    } catch (error) {
      dispatch(hideLoading());
      setIsAvailable(false);
      
      // Detailed error logging
      console.error("Availability check failed:", {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        endpoint: "/api/v1/user/booking-availability"
      });

      if (error.response?.status === 404) {
        message.error("The booking service endpoint is not found. Please contact support.");
      } else if (error.response?.status === 401) {
        message.error("Your session has expired. Please login again.");
        navigate('/login');
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Failed to check availability. Please try again or contact support.");
      }
    } finally {
      setLoading(prev => ({ ...prev, check: false }));
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      return message.warning("Please select both date and time");
    }

    try {
      setLoading(prev => ({ ...prev, book: true }));
      dispatch(showLoading());

      const formattedDate = moment(selectedDate).format("DD-MM-YYYY");

      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: formattedDate,
          time: selectedTime,
          status: "pending"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (res.data.success) {
        message.success(res.data.message || "Appointment booked successfully");
        setSelectedDate(null);
        setSelectedTime(null);
        setIsAvailable(false);
        navigate("/appointments");
      } else {
        message.error(res.data.message || "Could not book appointment");
      }
    } catch (error) {
      console.error("Booking error:", error);
      message.error(error.response?.data?.message || "Error booking appointment");
    } finally {
      setLoading(prev => ({ ...prev, book: false }));
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const workingHours = getDoctorHours();

  return (
    <Layout>
      <div className="booking-container">
        <div className="page-header">
          <h1>Book Appointment</h1>
          <p>Schedule your consultation with our medical experts</p>
        </div>

        <Card className="booking-card">
          {loading.fetch ? (
            <div className="loading-skeleton">
              <Skeleton active paragraph={{ rows: 4 }} />
            </div>
          ) : doctor ? (
            <div className="booking-content">
              <div className="doctor-info">
                <div className="doctor-header">
                  <i className="fas fa-user-md doctor-icon"></i>
                  <div className="doctor-details">
                    <h2>Dr. {doctor.firstName} {doctor.lastName}</h2>
                    <p className="specialization">{doctor.specialization}</p>
                  </div>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <i className="fas fa-dollar-sign"></i>
                    <div>
                      <label>Consultation Fee</label>
                      <span>${doctor.feesPerCunsaltation}</span>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <i className="fas fa-clock"></i>
                    <div>
                      <label>Available Hours</label>
                      <span>
                        {doctor.timings && doctor.timings.length === 2 
                          ? `${doctor.timings[0]} - ${doctor.timings[1]}`
                          : "09:00 - 17:00"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="booking-form">
                <h3>Select Date & Time</h3>
                
                <div className="datetime-picker">
                  <div className="picker-item">
                    <label>Select Date</label>
                    <DatePicker
                      className="date-picker"
                      format="DD-MM-YYYY"
                      value={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        setIsAvailable(false);
                      }}
                      disabledDate={(current) => {
                        return current && current < moment().startOf('day');
                      }}
                    />
                  </div>

                  <div className="picker-item">
                    <label>Select Time</label>
                    <Select
                      size="large"
                      placeholder="Select time"
                      value={selectedTime}
                      onChange={(time) => {
                        setSelectedTime(time);
                        setIsAvailable(false);
                      }}
                      className="time-select"
                    >
                      {timeOptions.map(time => (
                        <Option key={time} value={time}>{time}</Option>
                      ))}
                    </Select>
                  </div>
                </div>

                {isAvailable && (
                  <Alert
                    message="Time Slot Available"
                    description="You can proceed with booking this appointment."
                    type="success"
                    showIcon
                    className="availability-alert"
                  />
                )}

                <div className="booking-actions">
                  <Button
                    type="primary"
                    onClick={handleAvailability}
                    loading={loading.check}
                    icon={<i className="fas fa-calendar-check"></i>}
                    className="check-button"
                    disabled={!selectedDate || !selectedTime}
                  >
                    Check Availability
                  </Button>

                  <Button
                    type="primary"
                    onClick={handleBooking}
                    loading={loading.book}
                    // disabled={!isAvailable}
                    icon={<i className="fas fa-calendar-plus"></i>}
                    className="book-button"
                  >
                    Book Appointment
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="error-state">
              <i className="fas fa-exclamation-circle"></i>
              <h3>Error Loading Doctor</h3>
              <p>Unable to load doctor information. Please try again later.</p>
              <Button type="primary" onClick={getUserData}>Retry</Button>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default BookingPage;
