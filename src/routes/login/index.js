import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import { ToastNotification } from "../../components/notification/ToastNotification";
import {
  errorMsg,
  successMsg,
  warnMsg,
} from "../../components/notification/ToastNotification";
import axios from "axios";
import api from "../../api";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: {
        username: "",
        password: "",
        application: "web",
        scope: "",
      },
      registration: {
        email: "",
        password: "",
        application: "web",
        notification_token: "",
      },
      openDlgFlg: false,
    };
  }

  login = (e) => {
    e.preventDefault();
    let self = this;
    api
      .post(
        "/auth/token?" +
          "username=" +
          self.state.login.username +
          "&password=" +
          self.state.login.password +
          "&application=" +
          self.state.login.application +
          "&scope=" +
          self.state.login.notification_token
      )
      .then(function (response) {
        //---set Authorization header ---
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.token;
        //token store in session storage
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user_id", response.data.profile.id);
        sessionStorage.setItem("user_email", response.data.profile.email);
        self.props.history.push("/");
        successMsg("User Login Successful.");
        self.handleDlgClose();
      })
      .catch(function (error) {
        console.log("user login error response  :: ", error.response.data.code);
        if (error.response.data.code === "invalidEmail") {
          warnMsg("Invalid Email");
        } else if (error.response.data.code === "invalidPassword") {
          warnMsg("Invalid Password");
        } else {
          errorMsg(error.response.data.description);
        }
      });
  };

  userRegistration = (e) => {
    console.log(this.state.registration.email);
    e.preventDefault();
    let self = this;
    api
      .post(
        "/auth/register?" +
          "email=" +
          self.state.registration.email +
          "&password=" +
          self.state.registration.password +
          "&application=" +
          self.state.registration.application +
          "&notification_token=" +
          self.state.registration.notification_token
      )
      .then(function (response) {
        console.log("user registration success response :: ", response);
        self.setEmptyRegistrationState();
        //---set Authorization header ---
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.token;
        //token store in session storage
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user_id", response.data.profile.id);
        sessionStorage.setItem("user_email", response.data.profile.email);
        self.props.history.push("/");
        successMsg("User Registration Successful.");
        self.handleDlgClose();
      })
      .catch(function (error) {
        console.log(
          "user registration error response  :: ",
          error.response.data.code
        );
        if (error.response.data.code === "invalidEmail") {
          warnMsg("Invalid Email");
        } else if (error.response.data.code === "invalidPassword") {
          warnMsg("Invalid Password");
        } else {
          errorMsg(error.response.data.description);
        }
      });
  };

  setEmptyRegistrationState() {
    const { registration } = this.state;
    registration.userName = "";
    registration.password = "";
    registration.roles = "";
    this.setState({ registration });
  }

  // --------- Dialog open/close--------
  handleDlgClose() {
    this.setState({ openDlgFlg: false });
  }

  handleDlgShow() {
    this.setState({ openDlgFlg: true });
  }

  render() {
    const { login, registration, openDlgFlg } = this.state;
    return (
      <div className="text-center">
        <div className="form-signin">
          <Jumbotron>
            <h1 className="mb-3 fw-normal">Budget Insight</h1>
            <Form onSubmit={this.login}>
              <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="Email"
                  value={login.username}
                  onChange={(e) =>
                    this.setState({
                      login: {
                        ...login,
                        username: e.target.value,
                      },
                    })
                  }
                  required={true}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={login.password}
                  onChange={(e) =>
                    this.setState({
                      login: {
                        ...login,
                        password: e.target.value,
                      },
                    })
                  }
                  placeholder="Password"
                  required={true}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
            <br />
            <p>
              Not registered ?{" "}
              <a href="#/" onClick={() => this.handleDlgShow()}>
                Create an account
              </a>
            </p>

            <Modal
              show={openDlgFlg}
              onHide={() => this.handleDlgClose()}
              aria-labelledby="ModalHeader"
              centered
            >
              <Form onSubmit={this.userRegistration}>
                <Modal.Header closeButton>
                  <Modal.Title id="ModalHeader">User Registration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group>
                    <Form.Label>Email address</Form.Label>

                    <Form.Control
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Email"
                      maxLength="50"
                      value={registration.email}
                      onChange={(e) =>
                        this.setState({
                          registration: {
                            ...registration,
                            email: e.target.value,
                          },
                        })
                      }
                      required={true}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Password</Form.Label>

                    <Form.Control
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={registration.password}
                      maxLength="50"
                      onChange={(e) =>
                        this.setState({
                          registration: {
                            ...registration,
                            password: e.target.value,
                          },
                        })
                      }
                      placeholder="Password"
                      required={true}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => this.handleDlgClose()}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Registration
                  </button>
                </Modal.Footer>
              </Form>
            </Modal>
            <ToastNotification />
          </Jumbotron>
        </div>
      </div>
    );
  }
}

export default Login;
