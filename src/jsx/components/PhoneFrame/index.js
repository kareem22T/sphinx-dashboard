// MyComponent.js

import React from 'react';
import "./phone.css"

const Phone = () => {
  return (
    <div className="outside-border">
      <div className="silencer"></div>
      <div className="volume-up"></div>
      <div className="volume-down"></div>
      <div className="button-on"></div>
      <div className="inside-border">
        {/* Camera */}

        {/* Lock */}
        <div className="lock">
          <div className="lock-locked"></div>
        </div>

        {/* Time */}
        <div className="time">19:53</div>

        {/* Battery and Signal */}
        <div className="t-r-info">
          <div className="dots">...</div>
          <div className="battery">
            <div className="bar"></div>
            <div className="dot"></div>
          </div>
        </div>

        {/* Date */}
        <div className="date">Tuesday, 9 August</div>

        {/* Torch */}
        <div className="torch-outter">
          <div className="light"></div>
          <div className="top"></div>
          <div className="switch-top"></div>
          <div className="switch-section"></div>
          <div className="switch">
            <div className="dot"></div>
          </div>
        </div>

        {/* Camera */}
        <div className="camera-outter">
          <div className="box"></div>
          <div className="eye"></div>
          <div className="circle"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Phone;
