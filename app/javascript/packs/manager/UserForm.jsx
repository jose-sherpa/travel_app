import React from "react";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { inject, observer } from "mobx-react";
import { CircularProgress } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import withStyles from "@material-ui/core/styles/withStyles";
import moment from "moment";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import { computed } from "mobx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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
  }
});

const blankToNull = value => (value === "" ? null : value);

@inject("userStore")
@observer
class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      loading: true
    };
    this.props.userStore.user = this.newUser();
  }

  componentDidMount() {
    const {
      userStore,
      match: {
        params: { id }
      }
    } = this.props;
    if (!id) {
      this.setState({ loading: false });
    } else {
      userStore.fetchUser(id, () => this.setState({ loading: false }));
    }
  }

  newUser() {
    return {
      password: null,
      password_confirmation: null
    };
  }

  submit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    this.props.userStore.postUser(response => {
      this.setState({ loading: false, ...response });
    });
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
    // console.log(`rendering user form for path ${this.props.location.pathname}`)
    if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />;

    if (this.state.loading) return <CircularProgress />;

    const { classes } = this.props;
    const user = this.props.userStore.user;
    const isAdmin = this.props.userStore.authStore.user.role === "admin";

    if (!isAdmin && user.role === "admin")
      return <Redirect to="/manager/users" />;

    return (
      <div>
        <Paper style={{ padding: 10 }}>
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
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="role">Role</InputLabel>
                <Select
                  id="role"
                  error={Boolean(this.errorMessages.role)}
                  value={user.role || ""}
                  disabled={user.role === "admin" && !isAdmin}
                  onChange={e => (user.role = blankToNull(e.target.value))}
                >
                  <MenuItem value={""}>None</MenuItem>
                  <MenuItem value={"manager"}>Manager</MenuItem>
                  {isAdmin && <MenuItem value={"admin"}>Admin</MenuItem>}
                </Select>
                <FormHelperText>{this.errorMessages.role || ""}</FormHelperText>
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
                    (this.props.userStore.password = blankToNull(
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
            <Button style={{ marginTop: 20 }} type="submit">
              Submit
            </Button>
          </form>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(UserForm);
