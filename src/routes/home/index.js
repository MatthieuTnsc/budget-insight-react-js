import React, { Component } from "react";
import api from "../../api";
import Table from "react-bootstrap/Table";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { accountTypes: [], accounts: [] };
    this.loadAccounts();
  }

  componentDidUpdate(prevState) {
    if (prevState.current !== this.state.current) {
      this.loadAccounts();
    }
  }

  loadAccounts = () => {
    let self = this;
    api
      .get("/users/" + sessionStorage.user_id + "/accounts")
      .then(function (response) {
        console.log("loadAccounts success response :: ", response.data);
        self.setState({ accounts: [] });
        self.setState({
          accounts: response.data.accounts,
        });
        self.setState({ totalBalance: response.data.balance });
      })
      .catch(function (error) {
        console.log("loadAccounts error response :: ", error);
      });
  };

  getAccountsType = () => {
    let self = this;
    api
      .get("/account_types")
      .then(function (response) {
        console.log("getAccountsType success response :: ", response.data);
        self.setState({ accountTypes: [] });
        self.setState({
          accountTypes: response.data.accounttypes,
        });
      })
      .catch(function (error) {
        console.log("getAccountsType error response :: ", error);
      });
  };

  getTransactions = (e) => {
    api
      .get(
        "/users/" +
          sessionStorage.user_id +
          "/accounts/" +
          e.id +
          "/transactions"
      )
      .then(function (response) {
        console.log("getTransactions success response :: ", response.data);
      })
      .catch(function (error) {
        console.log("getTransactions error response :: ", error);
      });
  };

  getBalances = (e) => {
    api
      .get(
        "/users/" + sessionStorage.user_id + "/accounts/" + e.id + "/balances"
      )
      .then(function (response) {
        console.log("getBalances success response :: ", response.data);
      })
      .catch(function (error) {
        console.log("getBalances error response :: ", error);
      });
  };

  render() {
    const { accounts, totalBalance } = this.state;

    let accountsComponent = accounts.map((account) => (
      <tr key={account.id}>
        <td>{account.id}</td>
        <td>{account.name}</td>
        <td>{account.type}</td>
        <td>{account.last_update}</td>
        <td>{account.formatted_balance}</td>
        {console.log(this.getTransactions(account))}
        {console.log(this.getBalances(account))}
      </tr>
    ));

    return (
      <div>
        <div role="main" className="container">
          <h2>All accounts</h2>
          <div className="table-responsive">
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Last update</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>{accountsComponent}</tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Total balance:</th>
                  <th>{totalBalance} €</th>
                </tr>
              </tfoot>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
