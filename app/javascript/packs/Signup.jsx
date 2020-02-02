import React from "react";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { FormGroup } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { Link, Redirect } from "react-router-dom";
import Notices from "./shared/Notices";
import { computed } from "mobx";
import LinkButton from "./shared/LinkButton";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

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
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null,
      errors: null,
      email: null,
      password: null,
      passwordConfirmation: null
    };
    this.handleSignup = this.handleSignup.bind(this);
  }

  handleSignup(e) {
    e.preventDefault();
    const { email, password, passwordConfirmation } = this.state;
    this.props.rootStore
      .signup(email, password, passwordConfirmation)
      .then(response => {
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

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    const { classes } = this.props;
    const { email, password, passwordConfirmation } = this.state;

    return (
      <div style={{ padding: "10%" }}>
        <Notices notices={this.notices()} />
        <Typography className={classes.header} variant="h4">
          Please sign up to continue
        </Typography>
        <Paper elevation={2} className={classes.container}>
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
              <FormControl
                className={classes.formControl}
                error={Boolean(this.errorMessages.password_confirmation)}
              >
                <InputLabel htmlFor="password_confirmation">
                  Confirm password
                </InputLabel>
                <Input
                  id="password"
                  value={passwordConfirmation || ""}
                  placeholder="confirm password"
                  type="password"
                  onChange={e =>
                    this.setState({ passwordConfirmation: e.target.value })
                  }
                />
                <FormHelperText>
                  {this.errorMessages.password_confirmation || ""}
                </FormHelperText>
              </FormControl>
            </FormGroup>
            <Button
              onClick={this.handleSignup}
              type="submit"
              className={classes.submit}
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

export default withStyles(styles)(Signup);
