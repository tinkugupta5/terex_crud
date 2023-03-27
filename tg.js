import react, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import axios from "axios";

import en from "react-phone-number-input/locale/en";
import PhoneInput from "react-phone-number-input/input";
import Input from "react-phone-number-input/input";
import PhoneNumber from "../../Components/PhoneNumber/PhoneNumber";
// import PropTypes from "prop-types";
import {
  parsePhoneNumber,
  isValidPhoneNumber,
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import PropTypes from "prop-types";

const CountrySelect = ({ value, onChange, labels, ...rest }) => (
  <select
    {...rest}
    value={value}
    onChange={(event) => onChange(event.target.value || undefined)}
  >
    <option value="">{labels["ZZ"]}</option>
    {getCountries().map((country) => (
      <option key={country} value={country}>
        {labels[country]} +{getCountryCallingCode(country)}
      </option>
    ))}
  </select>
);

CountrySelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  labels: PropTypes.objectOf(PropTypes.string).isRequired,
};

const AddDidRange = (props) => {
  const [country, setCountry] = useState("IN");
  const [phnumber, setPhnumber] = useState([]);
  const [assignedNumbers, setAssignedNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState();
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  // const tenant_data = JSON.parse(sessionStorage.getItem("tenant_login"));

  const [isChecked, setIsChecked] = useState(false);
  // const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Country:", country);
    console.log("Start:", start);
    console.log("End:", end);
    console.log("Country Code:", `+${getCountryCallingCode(country)}`);

    console.log("add it");

    if (start && end && !validation) {
      var s = parsePhoneNumber(start);
      var e = parsePhoneNumber(end);
      var c = getCountryCallingCode(s.country);
      var country = country;

      apiProvider
        .post(
          ConfigData.PROVISION_SERVER_URL,
          ConfigData.ADD_PHONE_NUM_RANGE_ENDPOINT,
          {
            start_number: s.nationalNumber,
            end_number: e.nationalNumber,
            country_code: c,
            country: country,
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
    }
  };

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

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add DID Range
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "3rem" }}>
        {/* Form can start from here */}
        <Form onSubmit={handleSubmit}>
          <Container>
            {/* Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop */}
            <Row>
              <Col xs={3} md={3}>
                <Form.Group className="mb-3 ">
                  {/* <CountrySelect
labels={en}
// value={value}
name="Country"
onChange={handleInput}
className="w-100 form-select"
/> */}
                  <CountrySelect
                    labels={en}
                    value={country}
                    defaultCountry="IN"
                    onChange={setCountry}
                    // value={c}
                    // onChange={setCountry}
                    className="w-100 form-select"
                  />
                </Form.Group>
              </Col>
              <Col xs={3} md={3}>
                <Form.Group className="mb-3">
                  {/* <PhoneInput
type="tel"
value={phoneNumber1}
onChange={setPhoneNumber1}
className="w-100 form-control"
/> */}
                  <div className="col-4">
                    <PhoneInput
                      defaultCountry={country}
                      placeholder="Enter starting number"
                      value={start}
                      onChange={setStart}
                    />
                  </div>
                  To
                </Form.Group>
              </Col>
              <Col xs={3} md={3}>
                <Input
                  country={start ? parsePhoneNumber(start)?.country : ""}
                  placeholder="Enter ending number"
                  value={end}
                  onChange={setEnd}
                  style={{ width: "100%" }}
                  data-testid="endingnumber"
                />

                {/* <Form.Control
value={phoneNumber1}
onChange={setPhoneNumber1}
type="tel"
placeholder="number"
/> */}
              </Col>
              <Col xs={3} md={3}>
                {validation ? (
                  <div className="alert alert-danger" role="alert">
                    {validation}
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    // value={state.Start_National_Number}
                    // onChange={handleChange}
                    type="submit"
                  >
                    Add Range
                  </Button>
                )}
              </Col>
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
              </div>{" "}
            </Row>
          </Container>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddDidRange;
