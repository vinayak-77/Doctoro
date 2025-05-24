import React, { useState } from "react";
import { Form, Input, message, Button } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinishHandler = async (values) => {
    try {
      setLoading(true);
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/");
        window.location.reload();
      } else {
        message.error("Invalid Email or Password");
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
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1 className="logo">DOCTORO</h1>
          <p className="subtitle">Welcome back! Please login to your account.</p>
        </div>

        <Form 
          layout="vertical" 
          onFinish={onFinishHandler} 
          className="login-form"
          requiredMark={false}
        >
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
              placeholder="Enter your password"
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
              className="login-button"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>

          <div className="form-footer">
            <p>
              Don't have an account? {" "}
              <Link to="/register" className="register-link">
                Register Now
              </Link>
            </p>
          </div>
        </Form>
      </div>

      <div className="login-background">
        <div className="background-pattern"></div>
      </div>
    </div>
  );
};

export default Login;
