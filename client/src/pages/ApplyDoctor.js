import React, { useState } from "react";
import Layout from "./../components/Layout";
import { Col, Form, Input, message, Row, Button, Card, Divider, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import "../styles/ApplyDoctor.css";

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

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      if (!values.startTime || !values.endTime) {
        return message.error("Please select both start and end times");
      }

      if (values.startTime >= values.endTime) {
        return message.error("End time must be after start time");
      }

      setLoading(true);
      dispatch(showLoading());

      const res = await axios.post(
        "/api/v1/user/apply-doctor",
        {
          ...values,
          userId: user._id,
          timings: [values.startTime, values.endTime]
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (res.data.success) {
        message.success("Successfully Applied");
        navigate("/");
      } else {
        message.error(res.data.message || "Error while Applying");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
      dispatch(hideLoading());
    }
  };

  const timeOptions = generateTimeOptions();

  return (
    <Layout>
      <div className="apply-doctor-container">
        <div className="page-header">
          <h1>Register as a Doctor</h1>
          <p>Fill in your details to join our medical network</p>
        </div>

        <Card className="apply-doctor-card">
          <Form 
            layout="vertical" 
            onFinish={handleFinish}
            requiredMark={false}
          >
            <div className="section-header">
              <h2>Personal Details</h2>
              <p>Your basic information</p>
            </div>
            
            <Row gutter={[24, 0]}>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: 'Please enter your first name' }]}
                >
                  <Input 
                    size="large"
                    placeholder="Enter your first name"
                    prefix={<i className="fas fa-user"></i>}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: 'Please enter your last name' }]}
                >
                  <Input 
                    size="large"
                    placeholder="Enter your last name"
                    prefix={<i className="fas fa-user"></i>}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[{ required: true, message: 'Please enter your phone number' }]}
                >
                  <Input 
                    size="large"
                    placeholder="Enter your phone number"
                    prefix={<i className="fas fa-phone"></i>}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input 
                    size="large"
                    placeholder="Enter your email"
                    prefix={<i className="fas fa-envelope"></i>}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Website"
                  name="website"
                >
                  <Input 
                    size="large"
                    placeholder="Enter your website URL"
                    prefix={<i className="fas fa-globe"></i>}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Address"
                  name="address"
                  rules={[{ required: true, message: 'Please enter your clinic address' }]}
                >
                  <Input 
                    size="large"
                    placeholder="Enter clinic address"
                    prefix={<i className="fas fa-location-dot"></i>}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <div className="section-header">
              <h2>Professional Details</h2>
              <p>Your expertise and practice information</p>
            </div>

            <Row gutter={[24, 0]}>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Specialization"
                  name="specialization"
                  rules={[{ required: true, message: 'Please enter your specialization' }]}
                >
                  <Input 
                    size="large"
                    placeholder="Enter your specialization"
                    prefix={<i className="fas fa-stethoscope"></i>}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Experience"
                  name="experience"
                  rules={[{ required: true, message: 'Please enter your years of experience' }]}
                >
                  <Input 
                    size="large"
                    placeholder="Years of experience"
                    prefix={<i className="fas fa-briefcase"></i>}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Consultation Fee"
                  name="feesPerConsultation"
                  rules={[{ required: true, message: 'Please enter your consultation fee' }]}
                >
                  <Input 
                    type="number"
                    size="large"
                    placeholder="Fee per consultation"
                    prefix={<i className="fas fa-dollar-sign"></i>}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Start Time"
                  name="startTime"
                  rules={[{ required: true, message: 'Please select start time' }]}
                >
                  <Select
                    size="large"
                    placeholder="Select start time"
                    className="time-select"
                  >
                    {timeOptions.map(time => (
                      <Option key={time} value={time}>{time}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="End Time"
                  name="endTime"
                  rules={[{ required: true, message: 'Please select end time' }]}
                >
                  <Select
                    size="large"
                    placeholder="Select end time"
                    className="time-select"
                  >
                    {timeOptions.map(time => (
                      <Option key={time} value={time}>{time}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="form-actions">
              <Button 
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                className="submit-button"
                icon={<i className="fas fa-save"></i>}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default ApplyDoctor;
