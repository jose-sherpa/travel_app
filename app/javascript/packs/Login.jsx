import React from "react";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { FormGroup } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { Redirect, Link } from "react-router-dom";
import Notices from "./shared/Notices";
import { computed } from "mobx";
import LinkButton from "./shared/LinkButton";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  root: {
    padding: "10%"
  },
  header: {
    marginBottom: theme.spacing(2)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  container: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1)
  },
  submit: {
    marginTop: theme.spacing(2)
  }
});

@inject("rootStore")
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      errors: null,
      email: null,
      password: null
    };
  }

  handleLogin(e) {
    e.preventDefault();
    const { email, password } = this.state;
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

  @computed
  get errorMessages() {
    let { errors } = this.state;
    if (!errors) return {};

    let errorMessages = {};
    Object.entries(errors).forEach(
      ([key, value]) => (errorMessages[key] = value[0])
    );
    return errorMessages;
  }

  render() {
    if (this.props.rootStore.apiKey) {
      return <Redirect to="/" />;
    }

    const { classes } = this.props;
    const { email, password } = this.state;

    return (
      <div className={classes.root}>
        <Notices notices={this.notices()} />
        <Typography variant="h4" className={classes.header}>
          Log in to continue
        </Typography>
        <Paper elevation={2} className={classes.container}>
          {this.errorMessages.credentials && (
            <FormHelperText error={true} className={classes.formControl}>
              Credentials {this.errorMessages.credentials}
            </FormHelperText>
          )}
          <form>
            <FormGroup>
              <FormControl
                className={classes.formControl}
                error={Boolean(this.errorMessages.email)}
              >
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  id="email"
                  value={email || ""}
                  placeholder="email"
                  type="email"
                  required={true}
                  onChange={e => this.setState({ email: e.target.value })}
                />
                <FormHelperText>
                  {this.errorMessages.email || ""}
                </FormHelperText>
              </FormControl>
              <FormControl
                className={classes.formControl}
                error={Boolean(this.errorMessages.password)}
              >
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  value={password || ""}
                  placeholder="password"
                  type="password"
                  onChange={e => this.setState({ password: e.target.value })}
                />
                <FormHelperText>
                  {this.errorMessages.password || ""}
                </FormHelperText>
              </FormControl>
            </FormGroup>
            <Button
              onClick={this.handleLogin}
              type="submit"
              className={classes.submit}
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

export default withStyles(styles)(Login);
