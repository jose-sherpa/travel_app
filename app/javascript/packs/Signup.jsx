import React from "react";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { FormGroup } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { Link, Redirect } from "react-router-dom";

@inject("rootStore")
@observer
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignup = this.handleSignup.bind(this);
  }

  handleSignup(e) {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let passwordConfirmation = document.getElementById("password_confirmation")
      .value;
    this.props.rootStore.signup(email, password, passwordConfirmation);
  }

  render() {
    console.log("rendering signup");
    if (this.props.rootStore.apiKey) {
      return <Redirect to="/" />;
    }

    return (
      <div style={{ padding: "10%" }}>
        <h2>Signup</h2>
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
            <Input
              id="password_confirmation"
              placeholder="confirm password"
              required={true}
              type="password"
            />
          </FormGroup>
          <Button onClick={this.handleSignup} type="submit">
            Signup
          </Button>
        </form>
        <br />
        <Link to="/users/login">Login</Link>
      </div>
    );
  }
}

export default Signup;
