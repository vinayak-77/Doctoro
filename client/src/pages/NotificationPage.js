import React, { useState } from "react";
import Layout from "../components/Layout";
import { message, Tabs, Button, Empty, Card } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import "../styles/NotificationPage.css";

const NotificationPage = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState({
    markAll: false,
    deleteAll: false
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMarkAllRead = async () => {
    try {
      setLoading(prev => ({ ...prev, markAll: true }));
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/get-all-notification",
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    } finally {
      setLoading(prev => ({ ...prev, markAll: false }));
      dispatch(hideLoading());
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      setLoading(prev => ({ ...prev, deleteAll: true }));
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/delete-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    } finally {
      setLoading(prev => ({ ...prev, deleteAll: false }));
      dispatch(hideLoading());
    }
  };

  const NotificationCard = ({ notification }) => (
    <Card 
      className="notification-card"
      onClick={() => navigate(notification.onClickPath)}
    >
      <div className="notification-content">
        <i className="fas fa-bell notification-icon"></i>
        <p className="notification-message">{notification.message}</p>
      </div>
      <i className="fas fa-chevron-right notification-arrow"></i>
    </Card>
  );

  const EmptyState = ({ message }) => (
    <div className="empty-state">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={message}
      />
    </div>
  );

  return (
    <Layout>
      <div className="notification-container">
        <div className="page-header">
          <h1>Notifications</h1>
          <p>Stay updated with your latest activities</p>
        </div>

        <Card className="notification-content-card">
          <Tabs
            defaultActiveKey="0"
            className="notification-tabs"
            items={[
              {
                key: "0",
                label: `Unread (${user?.notification?.length || 0})`,
                children: (
                  <div className="tab-content">
                    <div className="tab-header">
                      <Button
                        type="primary"
                        onClick={handleMarkAllRead}
                        loading={loading.markAll}
                        disabled={!user?.notification?.length}
                        icon={<i className="fas fa-check-double"></i>}
                      >
                        Mark all as read
                      </Button>
                    </div>
                    
                    <div className="notifications-list">
                      {user?.notification?.length ? (
                        user.notification.map((notif, index) => (
                          <NotificationCard key={index} notification={notif} />
                        ))
                      ) : (
                        <EmptyState message="No unread notifications" />
                      )}
                    </div>
                  </div>
                ),
              },
              {
                key: "1",
                label: `Read (${user?.seennotification?.length || 0})`,
                children: (
                  <div className="tab-content">
                    <div className="tab-header">
                      <Button
                        type="primary"
                        danger
                        onClick={handleDeleteAllRead}
                        loading={loading.deleteAll}
                        disabled={!user?.seennotification?.length}
                        icon={<i className="fas fa-trash-alt"></i>}
                      >
                        Clear all notifications
                      </Button>
                    </div>
                    
                    <div className="notifications-list">
                      {user?.seennotification?.length ? (
                        user.seennotification.map((notif, index) => (
                          <NotificationCard key={index} notification={notif} />
                        ))
                      ) : (
                        <EmptyState message="No read notifications" />
                      )}
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default NotificationPage;
