import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import axios from "axios";
import Home from "./home";
import Connections from "./connections/index";

class Main extends Component {
  constructor(props) {
    super(props);

    //--- if reload page set Authorization header ----
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + sessionStorage.getItem("token");
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/connections" component={Connections} />
      </Switch>
    );
  }
}

export default Main;
