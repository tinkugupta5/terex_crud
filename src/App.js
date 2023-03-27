import React, { useState } from "react";
import PhoneInput from "react-phone-number-input/input";
import "react-phone-number-input/style.css";
import axios from "axios";
import PropTypes from "prop-types";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en";

const CountrySelect = ({ value, onChange, labels, ...rest }) => (
  <select
    {...rest}
    value={value}
    onChange={(event) => onChange(event.target.value || undefined)}
  >
    <option value="">
      {labels["ZZ"]} +{getCountryCallingCode(value)}
    </option>
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

const Example = () => {
  const [country, setCountry] = useState("US");

  const [phoneNumber, setPhoneNumber] = useState();
  const [phoneNumber1, setPhoneNumber1] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Country:", country);
    console.log("Phone Number:", phoneNumber);
    console.log("First Name:", phoneNumber1);

    try {
      const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, country);
      if (phoneNumberObj && phoneNumberObj.isValid()) {
        // The phone number is valid
        console.log("Phone number is valid", country);
        console.log("Phone number is valid");
        console.log("Country Code:", `+${phoneNumberObj.countryCallingCode}`);
        console.log("National Number:", phoneNumberObj.nationalNumber);

        const response = await axios.post("https://example.com/api/submit", {
          country: country,
          countryCode: `+${phoneNumberObj.countryCallingCode}`,
          phoneNumber: phoneNumberObj.nationalNumber
            .toString()
            .replace("+", ""),
          phoneNumber1: phoneNumber1.replace("+", ""),
        });

        console.log("Country after api:", country);
        console.log("Phone Number after api:", phoneNumber);
        console.log("First Name after api:", phoneNumber1);

        console.log(response.data);
      } else {
        // The phone number is not valid
        console.log("Phone number is not valid");
      }

      const phoneNumberObj1 = parsePhoneNumberFromString(phoneNumber1, country);
      if (phoneNumberObj1 && phoneNumberObj1.isValid()) {
        // The second phone number is valid
        console.log("Second phone number is valid");
        console.log("Country Code:", `+${phoneNumberObj1.countryCallingCode}`);
        console.log("National Number:", phoneNumberObj1.nationalNumber);
      } else {
        // The second phone number is not valid
        console.log("Second phone number is not valid");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Country:</label>
        <CountrySelect labels={en} value={country} onChange={setCountry} />
      </div>
      <div>
        <label>Phone Number:</label>
        <PhoneInput
          value={phoneNumber}
          onChange={setPhoneNumber}
          defaultCountry={country}
        />
      </div>

      <div>
        <label>Phone Number:</label>
        <PhoneInput
          value={phoneNumber1}
          onChange={setPhoneNumber1}
          defaultCountry={country}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default Example;
