import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Common/Layout";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Input from "react-phone-number-input/input";
import {
  parsePhoneNumber,
  isValidPhoneNumber,
  getCountryCallingCode,
} from "react-phone-number-input";
import LayoutUCProM from "../Common/LayoutUCProM";
import { Container, Nav, NavItem, Card } from "react-bootstrap";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";

import Operational from "../../Pages/Operational";
import ProvisionManager from "../../Pages/ProvisionManagerBtns";
import { allPhoneNumber } from "../../Api/PythonHelper";
import ConfigData from "../../Config/ProvisioningManagerConfigData.json";
import SideNavBarProvision from "../../Pages/provisioning-manager/OperationalServices/SideNavBarProvision";
import { apiProvider } from "../../services/api/utilities/AxiosHelper";

function PhoneNumber() {
  const [phnumber, setPhnumber] = useState([]);
  const [assignedNumbers, setAssignedNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState();
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const tenant_data = JSON.parse(sessionStorage.getItem("tenant_login"));

  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  const onAdd = () => {
    console.log("add it");

    if (start && end && !validation) {
      var s = parsePhoneNumber(start);
      var e = parsePhoneNumber(end);
      var c = getCountryCallingCode(s.country);

      apiProvider
        .post(
          ConfigData.PROVISION_SERVER_URL,
          ConfigData.ADD_PHONE_NUM_RANGE_ENDPOINT,
          {
            start_number: s.nationalNumber,
            end_number: e.nationalNumber,
            country_code: c,
          }
        )
        .then(
          (response) => {
            console.log(response);
            // alert(`${start} - ${end} added successfully`)
            alert(response.data.msg);
          },
          (error) => {
            console.log(error);
          }
        );
      setLoading(true);
    } else if (start && !end && !validation) {
      var s = parsePhoneNumber(start);

      var c = getCountryCallingCode(s.country);

      apiProvider
        .post(
          ConfigData.PROVISION_SERVER_URL,
          ConfigData.ADD_PHONE_NUM_ENDPOINT,
          {
            number: s.nationalNumber,
            country_code: c,
          }
        )
        .then(
          (response) => {
            console.log(response);
            // alert(`${start} added successfully`)
            alert(response.data.msg);
          },
          (error) => {
            console.log(error);
          }
        );
      setLoading(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    apiProvider
      .getAll(
        ConfigData.PROVISION_SERVER_URL,
        ConfigData.ALL_PHONE_NUM_ENDPOINT
      )
      .then((response) => {
        console.log(response.data);
        setPhnumber(response.data.AvailableNumbers);
      })
      .catch((err) => {
        console.log(err.message);
      });
    setLoading(false);
  }, [loading]);

  useEffect(() => {
    console.log(start, end, validation);
    if (isChecked) {
      if (start && !isValidPhoneNumber(start)) {
        setValidation("Starting Phone number is not valid.");
      } else if (end && !isValidPhoneNumber(end)) {
        setValidation("Ending Phone number is not valid.");
      } else if (start && end && !(parseInt(start) < parseInt(end))) {
        setValidation("Not a valid range");
      } else {
        setValidation(undefined);
      }
    } else {
      setEnd(undefined);
      if (start && !isValidPhoneNumber(start)) {
        setValidation("Phone number is not valid.");
      } else {
        setValidation(undefined);
      }
    }
  }, [start, end, isChecked, validation]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/operational");
    }
  }, []);

  return (
    <>
      <Layout> </Layout>
      <Nav
        className="bg-light"
        style={{
          marginTop: "-20px",
          position: "fixed",
          width: "100%",
          height: "30px",
          zIndex: "9999",
        }}
      >
        <NavItem>UC Provision Manager</NavItem>
        <Nav className="ms-auto">
          <NavItem className="">
            <NavLink className="ps-10" to="/operational">
              UC Operational Services
            </NavLink>
          </NavItem>
        </Nav>
      </Nav>

      <div className="d-flex">
        <SideNavBarProvision></SideNavBarProvision>
        <Container className="py-3">
          <Card
            className="mx-3"
            style={{
              marginTop: "16px",
              height: "480px",
              // width: "950"
            }}
          >
            <Card.Header className="py-3 bg-light ">
              <h5 className="mb-0">DID Management</h5>
            </Card.Header>
            <Card.Body className="provCard">
              <div className="block d-flex flex-wrap ">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleOnChange}
                    data-testid="checkboxtest"
                  />
                  <label
                    className="form-check-label"
                    for="flexCheckIndeterminate"
                  >
                    Select Range
                  </label>
                </div>
                <label className="mb-2">Add Numbers :</label>
                {isChecked ? (
                  <div className="row">
                    <div className="col-4">
                      <PhoneInput
                        defaultCountry="IN"
                        placeholder="Enter starting number"
                        value={start}
                        onChange={setStart}
                      />
                    </div>
                    To
                    <div className="col-4">
                      <Input
                        country={start ? parsePhoneNumber(start)?.country : ""}
                        placeholder="Enter ending number"
                        value={end}
                        onChange={setEnd}
                        style={{ width: "100%" }}
                        data-testid="endingnumber"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="col-4">
                    <PhoneInput
                      defaultCountry="IN"
                      placeholder="Enter phone number"
                      value={start}
                      onChange={setStart}
                    />
                  </div>
                )}
                <div className="container">
                  {validation ? (
                    <div className="alert alert-danger" role="alert">
                      {validation}
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary mt-3 mb-2"
                      onClick={onAdd}
                      disabled={!start || (isChecked && !end)}
                    >
                      Add Number
                    </button>
                  )}
                </div>

                <div>
                  <h3>Available Free DID</h3>
                  {phnumber?.length ? (
                    <ul className="list-group">
                      {phnumber.map((p, key) => (
                        <li className="list-group-item" key={key}>
                          <ion-icon name="call"></ion-icon>
                          {p}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="alert alert-primary" role="alert">
                      No Data Available
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default PhoneNumber;
