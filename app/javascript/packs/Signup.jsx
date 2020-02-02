import React from "react";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { FormGroup } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { Link, Redirect } from "react-router-dom";
import ErrorMessages from "./shared/ErrorMessages";
import Notices from "./shared/Notices";
import { computed } from "mobx";
import LinkButton from "./shared/LinkButton";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

@inject("rootStore")
@observer
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null,
      errors: null
    };
    this.handleSignup = this.handleSignup.bind(this);
  }

  handleSignup(e) {
    e.preventDefault();
    let { email, password, passwordConfirmation } = this.signupParams();
    this.props.rootStore
      .signup(email, password, passwordConfirmation)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          this.setState({
            redirectTo: {
              pathname: response.data.location,
              state: {
                notice: response.data.message
              }
            }
          });
        } else {
          this.setState({ errors: response.data.errors });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  signupParams() {
    return {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      passwordConfirmation: document.getElementById("password_confirmation")
        .value
    };
  }

  @computed
  get query() {
    return new URLSearchParams(this.props.location.search);
  }

  notices() {
    return [this.props.location?.state?.notice, this.query.get("notice")];
  }

  render() {
    if (this.props.rootStore.apiKey) {
      return <Redirect to="/" />;
    }

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div style={{ padding: "10%" }}>
        <Notices notices={this.notices()} />
        <ErrorMessages errors={this.state.errors} />
        <Typography variant="h4">Please sign up to continue</Typography>
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
              <Input
                id="password_confirmation"
                placeholder="confirm password"
                required={true}
                type="password"
                style={{ marginTop: "1rem" }}
              />
            </FormGroup>
            <Button
              onClick={this.handleSignup}
              type="submit"
              style={{ marginTop: "1rem" }}
            >
              Sign up
            </Button>
          </form>
        </Paper>
        <br />
        <LinkButton to="/users/login">Log in</LinkButton>
      </div>
    );
  }
}

export default Signup;
