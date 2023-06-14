import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { userMenu, adminMenu } from "../Data/data";
import { Avatar, Badge, message } from "antd";
import "../styles/LayoutStyles.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  const SidebarMenu = user?.isAdmin ? adminMenu : userMenu;

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successful");
    navigate("/login");
  };

  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h5>DOCTORO</h5>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <>
                    <div className={`menu-item ${isActive && "active"}`}>
                      <i className={menu.icon}></i>
                      <Link to={menu.path}>{menu.name}</Link>
                    </div>
                  </>
                );
              })}
              <div className={`menu-item`} onClick={handleLogout}>
                <i class="fa-solid fa-right-from-bracket"></i>
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="header">
              <div className="header-content" style={{ cursor: "pointer" }}>
                <Badge
                  count={user?.notification.length}
                  onClick={() => {
                    navigate("/notification");
                  }}
                >
                  <i class="fa-solid fa-bell m-1"></i>
                </Badge>

                <Link to="profile">{user?.name}</Link>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
