import React from "react";
import { inject, observer } from "mobx-react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import NavBar from "./shared/NavBar";
import Signup from "./Signup";
import Trips from "./Trips";
import Users from "./manager/Users";
import UserTrips from "./admin/UserTrips";
import Account from "./Account";

const HomeRedirect = () => {
  console.log("redirecting to home");
  return <Redirect to="/" />;
};

@inject("rootStore")
@observer
class AuthedBase extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(
      `rendering authed base for path ${this.props.location.pathname}`
    );
    if (this.props.location?.pathname === "/") {
      console.log(
        `redirecting from authed base for path ${this.props.location.pathname}`
      );
      return <Redirect to="/trips" />;
    }

    return (
      <div>
        <NavBar />
        <Switch>
          <Route path="/trips" component={Trips} />
          <Route path="/manager/users" component={Users} />
          <Route path="/admin/users/:user_id/trips" component={UserTrips} />
          <Route path="/account" component={Account} />
          <Route path="/" component={HomeRedirect} />
        </Switch>
      </div>
    );
  }
}

export default AuthedBase;
