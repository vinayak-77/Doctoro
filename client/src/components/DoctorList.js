import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Tag } from "antd";
import "../styles/DoctorList.css";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div className="doctor-card-wrapper">
      <Card
        className="doctor-card"
        onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
        hoverable
      >
        <div className="doctor-header">
          <div className="doctor-avatar">
            <i className="fas fa-user-md"></i>
          </div>
          <div className="doctor-info">
            <h2>Dr. {doctor.firstName} {doctor.lastName}</h2>
            <Tag color="#075e54" className="specialization-tag">
              {doctor.specialization}
            </Tag>
          </div>
        </div>

        <div className="doctor-details">
          <div className="detail-item">
            <i className="fas fa-briefcase"></i>
            <div>
              <label>Experience</label>
              <span>{doctor.experience} years</span>
            </div>
          </div>

          <div className="detail-item">
            <i className="fas fa-dollar-sign"></i>
            <div>
              <label>Consultation Fee</label>
              <span>${doctor.feesPerConsultation}</span>
            </div>
          </div>

          <div className="detail-item">
            <i className="fas fa-clock"></i>
            <div>
              <label>Available Hours</label>
              <span>{doctor.timings[0]} - {doctor.timings[1]}</span>
            </div>
          </div>
        </div>

        <Button 
          type="primary" 
          className="book-button"
          icon={<i className="fas fa-calendar-plus"></i>}
        >
          Book Appointment
        </Button>
      </Card>
    </div>
  );
};

export default DoctorList;
