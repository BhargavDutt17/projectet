import React from "react";
import "../../assets/toggle.css"; // make sure this path is correct

const Toggle = ({ isChecked, onToggle, title }) => {
  return (
    <label className="switch" title={title}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onToggle}
      />
      <span className="slider"></span>
    </label>
  );
};

export default Toggle;
