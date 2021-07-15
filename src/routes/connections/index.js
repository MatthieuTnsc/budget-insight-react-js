import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import {
  errorMsg,
  successMsg,
} from "../../components/notification/ToastNotification";
import api from "../../api";

class Connections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connection: {},
      connections: [],
      updateDlgFlg: false,
      deleteDlgFlg: false,
      totalElements: 0,
    };
    this.loadConnection();
  }

  componentDidUpdate(prevState) {
    if (prevState.current !== this.state.current) {
      this.loadConnection();
    }
  }

  loadConnection = () => {
    let self = this;
    api
      .get(
        "/users/" +
          sessionStorage.user_id +
          "/connections?expand=connector,accounts,all_accounts"
      )
      .then(function (response) {
        console.log("loadConnection success response :: ", response.data);
        self.setState({ connections: [] });
        self.setState({
          connections: response.data.connections,
        });
        self.setState({ totalElements: response.data.total });
      })
      .catch(function (error) {
        console.log("loadConnection error response :: ", error);
      });
  };

  addConnection = () => {
    api
      .get("/auth/token/code")
      .then(function (response) {
        console.log("addConnection success response :: ", response.data);
        window.location.replace(
          process.env.REACT_APP_API_BASE_URL +
            "/auth/webview/en/connect?client_id=" +
            process.env.REACT_APP_API_CLIENT_ID +
            "&redirect_uri=http://localhost:3000/connections&code=" +
            response.data.code
        );
      })
      .catch(function (error) {
        console.log(
          "addConnection error response :: ",
          error.response.data.message
        );
        errorMsg(error.response.data.message);
      });
  };

  updateConnection = (e) => {
    api
      .get("/auth/token/code")
      .then(function (response) {
        console.log("updateConnection success response :: ", response.data);
        window.location.replace(
          process.env.REACT_APP_API_BASE_URL +
            "/auth/webview/en/reconnect?client_id=" +
            process.env.REACT_APP_API_CLIENT_ID +
            "&connection_id=" +
            e.id +
            "&reset_credentials=true&redirect_uri=http://localhost:3000/connections&code=" +
            response.data.code
        );
      })
      .catch(function (error) {
        console.log(
          "updateConnection error response :: ",
          error.response.data.message
        );
        errorMsg(error.response.data.message);
      });
  };

  syncConnection = (e) => {
    let self = this;
    api
      .put("/users/" + sessionStorage.user_id + "/connections/" + e.id)
      .then(function (response) {
        console.log("syncConnection success response :: ", response);
        successMsg("Successfully synced Connection.");
        self.loadConnection();
      })
      .catch(function (error) {
        console.log(
          "syncConnection error response :: ",
          error.response.data.message
        );
        errorMsg(error.response.data.message);
      });
  };

  deleteConnection = (e) => {
    e.preventDefault();
    const { connection } = this.state;
    let self = this;
    api
      .delete(
        "/users/" + sessionStorage.user_id + "/connections/" + connection.id
      )
      .then(function (response) {
        console.log("deleteConnection success response :: ", response);
        successMsg("Successfully Connection Deleted.");
        self.handleDeleteDlgClose();
        self.loadConnection();
      })
      .catch(function (error) {
        console.log("deleteConnection error response :: ", error);
        errorMsg("Failed to Delete Connection.");
      });
  };

  activateAccount = (e) => {
    let self = this;
    console.log(api.defaults.headers.common);
    api
      .put(
        "/users/" +
          sessionStorage.user_id +
          "/connections/" +
          e.id_connection +
          "/accounts/" +
          e.id +
          "?disabled=false"
      )
      .then(function (response) {
        console.log("activateAccount success response :: ", response);
        successMsg("Successfully activated account.");
        self.loadConnection();
      })
      .catch(function (error) {
        console.log("activateAccount error response :: ", error);
        errorMsg(error.response.data.message);
      });
  };

  disableAccount = (e) => {
    let self = this;
    console.log(api.defaults.headers.common);
    api
      .put(
        "/users/" +
          sessionStorage.user_id +
          "/connections/" +
          e.id_connection +
          "/accounts/" +
          e.id,
        { disabled: true }
      )
      .then(function (response) {
        console.log("disableAccount success response :: ", response);
        successMsg("Successfully disabled account.");
        self.loadConnection();
      })
      .catch(function (error) {
        console.log("disableAccount error response :: ", error);
        errorMsg(error.response.data.message);
      });
  };

  // ---------Delete Dialog open/close--------
  handleDeleteDlgClose() {
    this.setState({ deleteDlgFlg: false });
  }

  handleDeleteDlgShow(data) {
    this.setConnectionToState(data);
    this.setState({ deleteDlgFlg: true });
  }

  setConnectionToState(data) {
    const { connection } = this.state;
    if (data !== null) {
      connection.id = data.id;
      connection.login = data.login;
      connection.password = data.password;
      this.setState({ connection });
    }
  }

  render() {
    const { connections, deleteDlgFlg, totalElements } = this.state;

    let connectionsComponent = connections.map((connection) => (
      <div key={connection.connector.id}>
        <Card style={{ margin: "1rem" }} className="mb-4">
          <Card.Header>
            #{connection.connector.id} - <b>{connection.connector.name}</b>
          </Card.Header>
          <Card.Body>
            <Table hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Account name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {connection.all_accounts.map((account, i) => {
                  let account_status;
                  if (account.disabled === null) {
                    account_status = (
                      <Button
                        className="btn btn-success btn-sm"
                        onClick={() => this.disableAccount(account)}
                      >
                        Enabled
                      </Button>
                    );
                  } else {
                    account_status = (
                      <Button
                        className="btn btn-warning btn-sm"
                        onClick={() => this.activateAccount(account)}
                      >
                        Disabled
                      </Button>
                    );
                  }
                  return (
                    <tr key={account.id}>
                      <td>{account.id}</td>
                      <td>{account.name}</td>
                      <td>{account_status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Button
              variant="outline-success"
              onClick={() => this.syncConnection(connection)}
            >
              Force sync
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button
              variant="outline-warning"
              onClick={() => this.updateConnection(connection)}
            >
              Update credentials
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button
              variant="outline-danger"
              onClick={() => this.handleDeleteDlgShow(connection)}
            >
              Delete connection
            </Button>
          </Card.Body>
          <Card.Footer className="text-muted">
            Last update: {connection.last_update}
          </Card.Footer>
        </Card>
        <br />
      </div>
    ));

    return (
      <div>
        <div>
          <div role="main" className="container">
            <h2>All connections</h2>
            <div className="col-md-12">
              <span>Total connections: {totalElements}</span>
              <br />
              <Button
                className="btn btn-primary"
                type="button"
                onClick={() => this.addConnection()}
              >
                Add a new connection
              </Button>
              <hr />
              <Row xs={1} md={2} className="g-4">
                {connectionsComponent}
              </Row>
            </div>
          </div>
        </div>

        <Modal
          show={deleteDlgFlg}
          onHide={() => this.handleDeleteDlgClose()}
          aria-labelledby="ModalHeader"
        >
          <Modal.Header closeButton>
            <Modal.Title id="ModalHeader">Delete Connection</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you want to Delete Connection ?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn btn-primary"
              type="button"
              onClick={() => this.handleDeleteDlgClose()}
            >
              No
            </Button>
            &nbsp; &nbsp;
            <Button className="btn btn-primary" onClick={this.deleteConnection}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Connections;
