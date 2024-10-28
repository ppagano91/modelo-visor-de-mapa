import React from "react";
import "./alerts.css";
import Success from "../../assets/images/success.png";
import Danger from "../../assets/images/danger.png";
import Warning from "../../assets/images/warning.png";

const Alerts = ({ type, message }) => {
  let icon;

  switch (type) {
    case "warning":
      icon = Warning;
      break;
    case "danger":
      icon = Danger;
      break;
    case "success":
      icon = Success;
      break;
    default:
      icon = null;
  }
  return (
    <div className={`alert alert-${type} w-100 `} role="alert">
      <span className="pb-1 ">{message}</span>
    </div>
  );
};

export default Alerts;
