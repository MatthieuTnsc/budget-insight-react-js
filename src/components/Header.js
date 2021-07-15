import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <div className="navbar-wrapper">
    <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <Link className="navbar-brand" to="/">
        Budget Insight
      </Link>
      <button
        type="button"
        className="navbar-toggler"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-expanded="false"
        aria-controls="navbar"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Accounts
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/connections">
              Connections
            </Link>
          </li>
          {/* <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="navbarDropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Connections
            </a>
            <div class="dropdown-menu" aria-labelledby="dropdown01">
              <Link className="dropdown-item" to="/connections">
                View connections
              </Link>
              <Link className="dropdown-item" to="/create">
                Add connection
              </Link>
            </div>
          </li> */}
        </ul>
        <form className="nav-item my-2 my-lg-0">
          <button
            className="btn btn-outline-danger my-2 my-sm-0"
            tabIndex="0"
            onClick={() => {
              sessionStorage.removeItem("token");
              window.location = "/login";
            }}
          >
            Logout
          </button>
        </form>
      </div>
    </nav>
  </div>
);

export default Header;
