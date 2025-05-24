import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row, Input, Empty, Skeleton, Card } from "antd";
import DoctorList from "../components/DoctorList";
import "../styles/HomePage.css";

const { Search } = Input;

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getUserData = async () => {
    try {
      const res = await axios.get(
        "api/v1/user/getAllDoctors",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const filteredDoctors = doctors.filter(doctor => 
    doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="home-container">
        <div className="page-header">
          <h1>Find Your Doctor</h1>
          <p>Connect with the best medical professionals</p>
        </div>

        <Card className="search-card">
          <Search
            placeholder="Search by name or specialization"
            size="large"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="doctor-search"
          />
        </Card>

        <div className="doctors-section">
          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="doctor-card-skeleton">
                  <Skeleton active avatar paragraph={{ rows: 3 }} />
                </Card>
              ))}
            </div>
          ) : filteredDoctors.length > 0 ? (
            <Row gutter={[24, 24]} className="doctors-grid">
              {filteredDoctors.map((doctor) => (
                <DoctorList key={doctor._id} doctor={doctor} />
              ))}
            </Row>
          ) : (
            <div className="empty-state">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  searchQuery
                    ? "No doctors found matching your search"
                    : "No doctors available at the moment"
                }
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
