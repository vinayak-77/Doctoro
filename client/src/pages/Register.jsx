import React, { useState } from "react";
import { Form, Input, message, Button } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../styles/RegisterStyles.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinishHandler = async (values) => {
    try {
      setLoading(true);
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      
      if (res.data.success) {
        message.success("Registration Successful");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
      dispatch(hideLoading());
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-header">
          <h1 className="logo">DOCTORO</h1>
          <p className="subtitle">Create your account to get started.</p>
        </div>

        <Form 
          layout="vertical" 
          onFinish={onFinishHandler} 
          className="register-form"
          requiredMark={false}
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: 'Please input your name!' },
              { min: 3, message: 'Name must be at least 3 characters!' }
            ]}
          >
            <Input 
              size="large"
              placeholder="Enter your full name"
              prefix={<i className="fas fa-user"></i>}
            />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              size="large"
              placeholder="Enter your email"
              prefix={<i className="fas fa-envelope"></i>}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              size="large"
              placeholder="Create a password"
              prefix={<i className="fas fa-lock"></i>}
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              block
              loading={loading}
              className="register-button"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Form.Item>

          <div className="form-footer">
            <p>
              Already have an account? {" "}
              <Link to="/login" className="login-link">
                Login Here
              </Link>
            </p>
          </div>
        </Form>
      </div>

      <div className="register-background">
        <div className="background-pattern"></div>
      </div>
    </div>
  );
};

export default Register;
