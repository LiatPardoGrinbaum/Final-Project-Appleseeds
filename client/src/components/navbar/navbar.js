import React from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../context/MyContext";
import API from "../../api/user.api";

import logo from "../../assets/logo.png";

const Navbar = () => {
  const { loggedUser, setLoggedUser } = useContext(MyContext);

  const logOut = async () => {
    try {
      await API.post(
        "/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setLoggedUser(null);
      console.log("?");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-inner">
        <div className="logo">
          <NavLink to="/" className="logo-link" exact={true} style={{ display: "flex" }}>
            <div>Tipper</div>

            <img src={logo} alt="logo" />
          </NavLink>
        </div>
        <div className="right-container">
          {loggedUser ? (
            <>
              <NavLink to="/" className="link" exact={true}>
                Home
              </NavLink>
              <NavLink to="/profile" className="link">
                Profile
              </NavLink>
              <NavLink to="/" className="logout" onClick={logOut}>
                {" "}
                {/* change to a href */}
                Logout
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className="link" exact={true}>
                Home
              </NavLink>
              <NavLink to="/login" className="link" exact={true}>
                Login
              </NavLink>
              {/*        <NavLink to="/register" className="link" exact={true}>
                Sign Up
              </NavLink> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
