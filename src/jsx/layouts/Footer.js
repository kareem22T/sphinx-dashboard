 import React from "react";

const Footer = () => {
  var d = new Date();
  return (
    <div className="footer">
      <div className="copyright">
        <p>
          Copyright © 2024 by{" "}
          <a href="https://sphinx-travel.com/" target="_blank" rel="noreferrer">
            Sphinx travel
          </a>{" "}
          {d.getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Footer;
