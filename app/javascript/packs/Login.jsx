import React from "react";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import { FormGroup } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import {useHistory, Redirect, Link} from "react-router-dom";

@inject("rootStore")
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(e) {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    this.props.rootStore.login(email, password);
  }

  render() {
    console.log("rendering login");
    if (this.props.rootStore.apiKey) {
      return <Redirect to="/" />;
    }

    return (
      <div style={{ padding: "10%" }}>
        <h2>Login</h2>
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
            Login
          </Button>
        </form>
        <br />
        <Link to="/users/signup">
          Signup
        </Link>
        {/*<Button onClick={() => (window.location = "/users/sign_up")}>*/}
        {/*  Signup*/}
        {/*</Button>*/}
      </div>
    );
  }
}

export default Login;
