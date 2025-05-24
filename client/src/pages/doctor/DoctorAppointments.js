import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";

import axios from "axios";

import moment from "moment";
import { message, Table } from "antd";
import "../../styles/Appointment.css";
import { Content } from "antd/es/layout/layout";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/doctor/doctor-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/update-status",
        { appointmentsId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {record.time}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Chat ID",
      dataIndex: "chatId",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex action">
          {record.status === "pending" && (
            <div className="d-flex">
              <button
                className="btn btn-success"
                onClick={() => handleStatus(record, "Approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleStatus(record, "Rejected")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <Content className="container">
        <h1>Appointment List</h1>
        <div className="table-container">
          <Table columns={columns} dataSource={appointments} />
        </div>
      </Content>
    </Layout>
  );
};

export default DoctorAppointments;
