import React from "react";
import "./Loader.css";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="inline-loader">
      <div className="spinner"></div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default Loader;
