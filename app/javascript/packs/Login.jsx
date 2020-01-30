import React from "react";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { FormGroup } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { Redirect, Link } from "react-router-dom";
import Notices from "./shared/Notices";
import { computed } from "mobx";
import LinkButton from "./shared/LinkButton";
import ErrorMessages from "./shared/ErrorMessages";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

@inject("rootStore")
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      errors: null
    };
  }

  handleLogin(e) {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    this.props.rootStore.login(email, password, errors => {
      this.setState({ errors });
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
        <Typography variant="h4">Log in to continue</Typography>
        <Paper elevation={2} style={{ marginTop: "1rem", padding: "1rem" }}>
          <form>
            <FormGroup>
              <Input
                id="email"
                placeholder="email"
                required={true}
                type="email"
                style={{ marginTop: "1rem" }}
              />
              <Input
                id="password"
                placeholder="password"
                required={true}
                type="password"
                style={{ marginTop: "1rem" }}
              />
            </FormGroup>
            <Button
              onClick={this.handleLogin}
              type="submit"
              style={{ marginTop: "1rem" }}
            >
              Log in
            </Button>
          </form>
        </Paper>
        <br />
        <LinkButton to="/users/signup">Sign up</LinkButton>
      </div>
    );
  }
}

export default Login;
