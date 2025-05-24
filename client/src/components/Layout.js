import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userMenu, adminMenu, doctorMenu } from "../Data/data";
import { Badge, message, Avatar, Tooltip } from "antd";
import "../styles/Layout.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successful");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`main ${collapsed ? 'collapsed' : ''}`}>
      <div className="layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <h3>DOCTORO</h3>
            </div>
            <button className="collapse-btn" onClick={toggleSidebar}>
              <i className={`fas fa-${collapsed ? 'chevron-right' : 'chevron-left'}`}></i>
            </button>
          </div>
          
          <div className="menu">
            {SidebarMenu.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <Tooltip 
                  key={menu.name} 
                  title={collapsed ? menu.name : ''} 
                  placement="right"
                >
                  <div className={`menu-item ${isActive ? "active" : ""}`}>
                    <Link to={menu.path}>
                      <i className={menu.icon}></i>
                      <span className="menu-label">{menu.name}</span>
                    </Link>
                  </div>
                </Tooltip>
              );
            })}
            <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
              <div className="menu-item logout" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <span className="menu-label">Logout</span>
              </div>
            </Tooltip>
          </div>
        </div>

        <div className="content">
          <div className="header">
            <div className="header-content">
              <div className="header-left">
                <h2>{SidebarMenu.find(menu => menu.path === location.pathname)?.name || 'Dashboard'}</h2>
              </div>
              <div className="header-right">
                <Tooltip title="Notifications">
                  <Badge 
                    count={user?.notification?.length} 
                    onClick={() => navigate("/notification")}
                    className="notification-badge"
                  >
                    <i className="fa-solid fa-bell"></i>
                  </Badge>
                </Tooltip>
                
                <div className="user-profile" onClick={() => navigate("/profile")}>
                  <Avatar 
                    size={35} 
                    className="user-avatar"
                    src={user?.avatar}
                  >
                    {user?.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <span className="user-name">{user?.name}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="body">
            <div className="content-wrapper">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
