/* eslint-disable no-unused-vars */
import { Col, ConfigProvider, Flex, Row } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Compare.css";
import { Bar, Line } from "react-chartjs-2";
import { Tabs } from "antd";
import { Link } from "react-router-dom";

// import { Chart as Chartjs } from ".chart.js/auto";

const ComparePage = () => {
  const onChange = (key) => {
    setTimeRange(key);
  };
  const items = [
    {
      key: "29",
      label: "30 ngày",
    },
    {
      key: "6",
      label: "7 ngày",
    },
    {
      key: "2",
      label: "3 ngày",
    },
    {
      key: "0",
      label: "Hôm nay",
    },
  ];
  const [totalPersonTime, setTotalPersonTime] = useState();
  const [timeRange, setTimeRange] = useState(0);

  useEffect(() => {
    let date = new Date();
    const fetchDataInRange = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PORT}/countSevenAgo`,
          {
            params: {
              start: date.toISOString().slice(0, -1),
              day: timeRange,
            },
          }
        );
        setTotalPersonTime(response.data);
        console.log("««««« response »»»»»", response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataInRange();
  }, [timeRange]);
  // const handlePickerDate = (e) => {
  //   console.log("««««« e »»»»»", e);
  // };
  console.log("««««« totalPersonTime »»»»»", totalPersonTime);
  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            colorText: "#000",
            itemSelectedColor: "#ff8084",
            inkBarColor: "#ff8084",
            itemHoverColor: "#ff8084",
            titleFontSize: 20,
          },
        },
      }}
    >
      <>
        <Row gutter={6}>
          <Col xs={24} sm={24}>
            <Flex
              className="header_wrapper"
              justify="center"
              vertical
              align="center"
            >
              <h2 style={{ margin: 0, marginTop: "25px" }}>
                Thống kê theo biểu đồ
                <Link className="header_sub" to={"/"}>
                  Trang chủ
                </Link>
              </h2>
              <Tabs defaultActiveKey="0" items={items} onChange={onChange} />
            </Flex>
          </Col>
          {/* bar */}
          <Col xs={24} md={12}>
            <Bar
              data={{
                labels:
                  totalPersonTime && totalPersonTime.map((data) => data.date),
                datasets: [
                  {
                    label: "Đi ra",
                    data:
                      totalPersonTime &&
                      totalPersonTime.map((data) => data.countGoingOut),
                    backgroundColor: ["rgb(68, 166, 152)"],
                  },
                  {
                    label: "Đi vào",
                    data:
                      totalPersonTime &&
                      totalPersonTime.map((data) => data.countGoingIn),
                    backgroundColor: ["rgb(72, 96, 221)"],
                  },
                ],
              }}
            />
          </Col>
          {/* line */}
          <Col xs={24} md={12}>
            <Line
              data={{
                labels:
                  totalPersonTime && totalPersonTime.map((data) => data.date),
                datasets: [
                  {
                    label: "Đi ra",
                    data:
                      totalPersonTime &&
                      totalPersonTime.map((data) => data.countGoingOut),
                  },
                  {
                    label: "Đi vào",
                    data:
                      totalPersonTime &&
                      totalPersonTime.map((data) => data.countGoingIn),
                  },
                ],
              }}
            />
          </Col>
        </Row>
      </>
    </ConfigProvider>
  );
};
export default ComparePage;
