import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import { Provider } from "mobx-react";
import UserStore from "../stores/UserStore";
import { inject, observer } from "mobx-react";
import UsersIndex from "./UsersIndex";
import User from "./User";
import UserForm from "./UserForm";

const styles = theme => ({
  root: {
    padding: "2rem"
  },
  title: {
    flexGrow: 1,
    textTransform: "none"
  },
  addButton: {
    color: "green",
    paddingLeft: 5
  },
  link: {
    textDecoration: "none",
    color: "#000"
  },
  header: {
    marginBottom: 20
  }
});

const useStyles = makeStyles(styles);

function AddButton() {
  const classes = useStyles();

  return (
    <Link to="/manager/users/new" className={classes.link}>
      <Button>
        <Typography variant="h4" className={classes.title}>
          New user
        </Typography>
        <Icon fontSize="large" className={classes.addButton}>
          add_circle
        </Icon>
      </Button>
    </Link>
  );
}

@inject("rootStore")
@observer
class Users extends React.Component {
  constructor(props) {
    super(props);
    this.userStore = new UserStore(this.props.rootStore.authStore);
  }

  header() {
    const {
      classes,
      location: { pathname }
    } = this.props;

    if (!pathname.match(/\/users(\/)?$/)) {
      return (
        <Link to="/manager/users" className={classes.link}>
          <Button>Back to users</Button>
        </Link>
      );
    }

    return <AddButton />;
  }

  render() {
    const user = this.userStore.authStore.currentUser;
    const isManager =
      user && (user.role === "admin" || user.role === "manager");
    if (!isManager) return <Redirect to="/" />;

    const { classes } = this.props;
    let { path } = this.props.match;

    return (
      <Provider userStore={this.userStore}>
        <div className={classes.root}>
          <div className={classes.header}>{this.header()}</div>
          <Switch>
            <Route path={`${path}/new`} component={UserForm} />
            <Route path={`${path}/:id/edit`} component={UserForm} />
            <Route path={`${path}/:id`} component={User} />
            <Route path={`${path}`} component={UsersIndex} />
          </Switch>
        </div>
      </Provider>
    );
  }
}

export default withStyles(styles)(Users);
