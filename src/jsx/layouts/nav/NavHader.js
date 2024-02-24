import React, { Fragment, useContext, useState, Image } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";

//image 
import logo from "../../../images/logo-full.png"
import logoShort from "../../../images/logo-short.png"
import logoText from "../../../images/logo-text.png"
export function  NavMenuToggle(){
	setTimeout(()=>{	
		let mainwrapper = document.querySelector("#main-wrapper");
		if(mainwrapper.classList.contains('menu-toggle')){
			mainwrapper.classList.remove("menu-toggle");
		}else{
			mainwrapper.classList.add("menu-toggle");
		}
	},200);
}

const NavHader = () => {
  const [toggle, setToggle] = useState(false);
  const { navigationHader, openMenuToggle, background } = useContext(
    ThemeContext
  );
  return (
    <div className="nav-header">
      <Link to="/dashboard" className="brand-logo" style={{display: "flex", justifyContent: "start", alignItems: 'center', overflow: 'hidden'}}>
        {background.value === "dark" || navigationHader !== "color_1" ? (
			<Fragment>
				<img src={logoShort} alt="" style={{ maxWidth: 60, margin: 15 }}/>
				{/* {!toggle && ( */}
					<img src={logoText} alt="" style={{ maxWidth: 130 }}/>
				{/* )} */}
			</Fragment>
        ) : (
			<Fragment>
				<img src={logoShort} alt="" style={{ maxWidth: 55, margin: 18, marginRight: 20 }}/>
				{/* {!toggle && ( */}
					<img src={logoText} alt="" style={{ maxWidth: 130 }}/>
			</Fragment>
        )}
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          setToggle(!toggle);
          NavMenuToggle();
        }}
      >
        <div className={`hamburger ${toggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
