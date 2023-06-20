import React from "react";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import "../styles/RegisterStyles.css";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);

      if (res.data.success) {
        window.location.reload();

        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error("Invalid UserName or Password");
      }
      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <>
      <h3>DOCTORO</h3>
      <div className="form-container">
        <Form layout="vertical" onFinish={onFinishHandler} className="card p-4">
          <h1>Login Form</h1>

          <Form.Item label="E-Mail" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>

          <button className="btn btn-primary" type="submit">
            Login
          </button>
          <Link to="/register" className="ms-2 mt-2">
            Not a User ?
          </Link>
        </Form>
      </div>
    </>
  );
};

export default Login;
