import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormGroup from "@material-ui/core/FormGroup";
import { inject, observer } from "mobx-react";
import { CircularProgress } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import { computed } from "mobx";
import AlertDialog from "../shared/AlertDialog";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  form: {},
  datePicker: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  header: {
    margin: 10,
    marginBottom: 10
  },
  container: {
    padding: 10
  },
  submit: {
    marginTop: 20
  }
});

const blankToNull = value => (value === "" ? null : value);

@inject("accountStore")
@observer
class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const { accountStore } = this.props;
    accountStore.fetchUser(() => this.setState({ loading: false }));
  }

  submit(e) {
    e?.preventDefault();
    const user = this.props.accountStore.user;

    if (user.password && !user.current_password) {
      this.setState({ passwordRequired: true });
      return;
    }

    this.setState({ loading: true });
    this.props.accountStore.postUser(response => {
      this.props.accountStore.user.current_password = null;
      this.setState({ loading: false, ...response });
    });
  }

  userPasswordEntered(result) {
    let errors = Object.assign({}, this.state.errors);

    if (result) {
      this.submit();
    } else {
      if (errors) delete errors.current_password;
      this.props.accountStore.user.current_password = null;
    }

    this.setState({ passwordRequired: false, errors });
  }

  @computed
  get errorMessages() {
    const { errors } = this.state;
    if (!errors) return {};

    let errorMessages = {};
    Object.entries(errors).forEach(
      ([key, value]) => (errorMessages[key] = value[0])
    );
    return errorMessages;
  }

  render() {
    console.log(
      `rendering account form for path ${this.props.location.pathname}`
    );
    if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />;

    if (this.state.loading) return <CircularProgress />;

    const { classes } = this.props;
    const user = this.props.accountStore.user;
    if (!user) return <Redirect to="/" />;

    const alertOpen =
      this.state.passwordRequired ||
      Boolean(this.errorMessages.current_password) ||
      false;

    return (
      <div>
        <Paper elevation={2} className={classes.container}>
          <Typography
            className={classes.header}
            variant="h5"
            color="textSecondary"
          >
            Edit your account
          </Typography>
          <form className={classes.form} onSubmit={this.submit}>
            <FormGroup>
              <FormControl
                className={classes.formControl}
                error={Boolean(this.errorMessages.email)}
              >
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  id="email"
                  value={user.email || ""}
                  placeholder="email"
                  type="email"
                  required={true}
                  onChange={e => (user.email = e.target.value)}
                />
                <FormHelperText>
                  {this.errorMessages.email || ""}
                </FormHelperText>
              </FormControl>
              <FormControl
                className={classes.formControl}
                error={Boolean(this.errorMessages.password)}
              >
                <InputLabel htmlFor="password">
                  {user.id ? "Change password" : "Password"}
                </InputLabel>
                <Input
                  id="password"
                  value={user.password || ""}
                  placeholder="password"
                  type="password"
                  onChange={e =>
                    (this.props.accountStore.password = blankToNull(
                      e.target.value
                    ))
                  }
                />
                <FormHelperText>
                  {this.errorMessages.password || ""}
                </FormHelperText>
              </FormControl>
              {user.password && (
                <FormControl
                  className={classes.formControl}
                  error={Boolean(this.errorMessages.password_confirmation)}
                >
                  <InputLabel htmlFor="password_confirmation">
                    Confirm password
                  </InputLabel>
                  <Input
                    id="password_confirmation"
                    value={user.password_confirmation || ""}
                    placeholder="confirm password"
                    type="password"
                    onChange={e =>
                      (user.password_confirmation = blankToNull(e.target.value))
                    }
                  />
                  <FormHelperText>
                    {this.errorMessages.password_confirmation || ""}
                  </FormHelperText>
                </FormControl>
              )}
            </FormGroup>
            <Button className={classes.submit} type="submit">
              Submit
            </Button>
          </form>
        </Paper>
        <AlertDialog
          open={alertOpen}
          onClose={() => this.userPasswordEntered(false)}
          title="Password required"
          text="Please enter your current password"
          content={
            <FormControl
              error={Boolean(this.errorMessages.current_password)}
              fullWidth
            >
              <Input
                id="current_password"
                value={user.current_password || ""}
                placeholder="current password"
                type="password"
                required={true}
                onChange={e =>
                  (user.current_password = blankToNull(e.target.value))
                }
              />
              <FormHelperText>
                {this.errorMessages.current_password || ""}
              </FormHelperText>
            </FormControl>
          }
        >
          <Button
            onClick={() => this.userPasswordEntered(false)}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
          <Button
            onClick={() => this.userPasswordEntered(true)}
            color="primary"
            disabled={!user.current_password}
            type="submit"
          >
            Submit
          </Button>
        </AlertDialog>
      </div>
    );
  }
}

export default withStyles(styles)(UserForm);
