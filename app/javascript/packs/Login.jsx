import React from "react";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { FormGroup } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { Redirect, Link } from "react-router-dom";
import Notices from "./shared/Notices";
import {computed} from "mobx";
import LinkButton from "./shared/LinkButton";
import ErrorMessages from "./shared/ErrorMessages";

@inject("rootStore")
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      errors: null,
    }
  }

  handleLogin(e) {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    this.props.rootStore.login(email, password, errors => {
      this.setState({ errors })
    });
  }

  @computed
  get query() {
    return new URLSearchParams(this.props.location.search);
  }

  notices() {
    return [this.props.location?.state?.notice, this.query.get("notice")];
  }

  render() {
    console.log(this.props.location);
    console.log("rendering login");
    if (this.props.rootStore.apiKey) {
      return <Redirect to="/" />;
    }

    return (
      <div style={{ padding: "10%" }}>
        <Notices notices={this.notices()} />
        <ErrorMessages errors={this.state.errors} />
        <h2>Log in</h2>
        <form>
          <FormGroup>
            <Input
              id="email"
              placeholder="email"
              required={true}
              type="email"
            />
            <Input
              id="password"
              placeholder="password"
              required={true}
              type="password"
            />
          </FormGroup>
          <Button onClick={this.handleLogin} type="submit">
            Log in
          </Button>
        </form>
        <br />
        <LinkButton to="/users/signup">Sign up</LinkButton>
      </div>
    );
  }
}

export default Login;
