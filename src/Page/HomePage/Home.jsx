/* eslint-disable no-unused-vars */
import { Col, DatePicker, Flex, Row, TimePicker } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { Bar, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import FakeNumber from "../../components/FakeNumber";
import { Link } from "react-router-dom";
// import { Chart as Chartjs } from ".chart.js/auto";

const HomePage = () => {
  const [totalPerson, setTotalPerson] = useState();
  // khoảng thời gian trong ngày
  const [totalPersonTime, setTotalPersonTime] = useState();
  // ngày tự chọn bất kì
  const [totalPickerDate, setTotalPickerDate] = useState();
  const [timeRange, setTimeRange] = useState([null, null]);
  const [pickerDate, setPickerDate] = useState([null, null]);
  // toàn thời gian
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8080/countTotal");
        if (response.data) {
          console.log("««««« 1 »»»»»", 1);
          setTotalPerson(response.data);
        }
      } catch (error) {
        console.log("««««« error »»»»»", error);
      }
    };
    setInterval(() => {
      fetchData();
    }, 1000);
  }, []);

  // lắng nghe sự kiện chọn khoảng thời gian trong ngày
  const handleTimeChange = (time) => {
    setTimeRange(time);
  };
  // chọn khoảng thời gian trong ngày
  useEffect(() => {
    if (timeRange[0] && timeRange[1]) {
      let startDate, endDate;

      if (timeRange[1] > timeRange[0]) {
        startDate = new Date(timeRange[0]);
        endDate = new Date(timeRange[1]);
      } else {
        startDate = new Date(timeRange[1]);
        endDate = new Date(timeRange[0]);
      }
      startDate.setHours(startDate.getHours() + 7);
      endDate.setHours(endDate.getHours() + 7);

      const fetchDataInRange = async () => {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8080/countTotalInTimeRange",
            {
              params: {
                start: startDate.toISOString().slice(0, -1),
                end: endDate.toISOString().slice(0, -1),
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
    }
  }, [timeRange]);

  // chọn ngày bất kỳ để thống kê
  const handlePickerDate = (time) => {
    setPickerDate(time);
  };
  // chọn ngày bắt kỳ để thống kê
  useEffect(() => {
    console.log("««««« pickerDate »»»»»", pickerDate);
    let startDate, endDate;

    endDate = new Date(pickerDate);
    startDate = new Date(pickerDate);
    // Set startDate to 00:00:00.000
    startDate.setHours(0, 0, 0, 0);

    // Set endDate to 23:59:59.999
    endDate.setHours(23, 59, 59, 999);

    console.log("««««« startDate endDate »»»»»", startDate, endDate);

    // Format the date to 'YYYY-MM-DDTHH:mm:ss.SSS' in local time
    const formatDateTimeLocal = (date) => {
      return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0") +
        "T" +
        String(date.getHours()).padStart(2, "0") +
        ":" +
        String(date.getMinutes()).padStart(2, "0") +
        ":" +
        String(date.getSeconds()).padStart(2, "0") +
        "." +
        String(date.getMilliseconds()).padStart(3, "0")
      );
    };

    const fetchDataInRange = async () => {
      try {
        const formattedStartDate = formatDateTimeLocal(startDate);
        const formattedEndDate = formatDateTimeLocal(endDate);

        console.log("««««« formattedStartDate »»»»»", formattedStartDate);
        console.log("««««« formattedEndDate »»»»»", formattedEndDate);

        const response = await axios.get(
          "http://127.0.0.1:8080/countByPickerDate",
          {
            params: {
              start: formattedStartDate,
              end: formattedEndDate,
            },
          }
        );
        setTotalPickerDate(response.data);
        console.log("««««« response »»»»»", response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataInRange();
  }, [pickerDate]);
  console.log("««««« totalPerson »»»»»", totalPerson);
  return (
    <>
      <Row>
        <Col xs={24} sm={24}>
          <Flex
            className="header_wrapper"
            justify="center"
            vertical
            align="center"
          >
            <h2 style={{ margin: 0, marginTop: "25px" }}>
              Toàn thời gian
              <Link className="header_sub" to={"/dashboard"}>
                Biểu đồ
              </Link>
            </h2>
          </Flex>
        </Col>
        <Col xs={24} sm={12}>
          <Flex justify="center" vertical align="center">
            <div className="wrapper_out">
              <div> Số lượng người đi ra</div>
              <div>{totalPerson && totalPerson.countGoingOut}</div>
            </div>
          </Flex>
        </Col>
        <Col xs={24} sm={12}>
          <Flex justify="center" vertical align="center">
            <div className="wrapper_in">
              <div> Số lượng người đi vào</div>
              <div>{totalPerson && totalPerson.countGoingIn}</div>
            </div>
          </Flex>
        </Col>
      </Row>

      <Row style={{ marginTop: "40px" }}>
        <Col xs={24} sm={24}>
          <Flex justify="center" vertical align="center">
            <h2>Chọn thời gian trong ngày hôm nay </h2>
            <TimePicker.RangePicker
              onChange={handleTimeChange}
              status="success"
            />
          </Flex>
        </Col>
        <Col xs={24} sm={12}>
          <Flex justify="center" vertical align="center">
            <div className="wrapper_out">
              <div> Số lượng người đi ra</div>
              <div>
                {timeRange && totalPersonTime && totalPersonTime.countGoingOut}
              </div>
            </div>
          </Flex>
        </Col>
        <Col xs={24} sm={12}>
          <Flex justify="center" vertical align="center">
            <div className="wrapper_in">
              <div> Số lượng người đi vào</div>
              <div> {totalPersonTime && totalPersonTime.countGoingIn}</div>
            </div>
          </Flex>
        </Col>
      </Row>

      <Row style={{ marginTop: "40px" }}>
        <Col xs={24} sm={24}>
          <Flex justify="center" vertical align="center">
            <h2>Chọn ngày bất kỳ </h2>
            <DatePicker onChange={handlePickerDate} needConfirm />
          </Flex>
        </Col>
        <Col xs={24} sm={12}>
          <Flex justify="center" vertical align="center">
            <div className="wrapper_out">
              <div> Số lượng người đi ra</div>
              <div>{totalPickerDate && totalPickerDate.countGoingOut}</div>
            </div>
          </Flex>
        </Col>
        <Col xs={24} sm={12}>
          <Flex justify="center" vertical align="center">
            <div className="wrapper_in">
              <div> Số lượng người đi vào</div>
              <div> {totalPickerDate && totalPickerDate.countGoingIn}</div>
            </div>
          </Flex>
        </Col>
      </Row>
    </>
  );
};
export default HomePage;
