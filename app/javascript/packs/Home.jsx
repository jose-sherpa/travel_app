import React from "react";
import { inject, observer } from "mobx-react";
import Login from "./Login";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PrivateRoute from "./shared/PrivateRoute";
import AuthedBase from "./AuthedBase";
import Signup from "./Signup";

@inject("rootStore")
@observer
class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("rendering home");
    return (
      <BrowserRouter>
          <Switch>
              <Route path="/users/login" component={Login} />
              <Route path="/users/signup" component={Signup} />
              <PrivateRoute path="/" component={AuthedBase} />
          </Switch>
      </BrowserRouter>
    );
  }
}

export default Home;
