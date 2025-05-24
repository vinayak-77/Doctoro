import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import moment from "moment";
import { Table, Card, Tag, Empty, Skeleton } from "antd";
import "../styles/Appointment.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/user/user-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const getStatusTag = (status) => {
    const statusColors = {
      pending: "warning",
      approved: "success",
      rejected: "error",
    };
    return (
      <Tag color={statusColors[status.toLowerCase()] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "_id",
      ellipsis: true,
      width: 220,
      render: (id) => (
        <span className="appointment-id">
          <i className="fas fa-hashtag"></i>
          {id}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      width: 200,
      render: (text, record) => (
        <span className="datetime">
          <i className="fas fa-calendar-alt"></i>
          {moment(record.date).format("DD MMM, YYYY")}
          <br />
          <i className="fas fa-clock"></i>
          {moment(record.time).format("hh:mm A")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Chat ID",
      dataIndex: "chatId",
      width: 150,
      render: (chatId) => (
        <span className="chat-id">
          <i className="fas fa-comments"></i>
          {chatId}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className="appointments-container">
        <div className="page-header">
          <h1>My Appointments</h1>
          <p>Track and manage your medical appointments</p>
        </div>

        <Card className="appointments-card">
          {loading ? (
            <div className="loading-skeleton">
              <Skeleton active paragraph={{ rows: 5 }} />
            </div>
          ) : appointments.length > 0 ? (
            <Table 
              columns={columns} 
              dataSource={appointments}
              rowKey="_id"
              className="appointments-table"
              pagination={{
                pageSize: 10,
                position: ["bottomCenter"],
                showSizeChanger: false,
              }}
            />
          ) : (
            <div className="empty-state">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>No appointments found</span>
                }
              />
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Appointments;
