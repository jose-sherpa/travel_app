import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import { Provider } from "mobx-react";
import { inject, observer } from "mobx-react";
import User from "./account/User";
import UserForm from "./account/UserForm";
import AccountStore from "./stores/AccountStore";

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

@inject("rootStore")
@observer
class Account extends React.Component {
  constructor(props) {
    super(props);
    this.accountStore = new AccountStore(this.props.rootStore.authStore);
  }

  render() {
    const { classes } = this.props;
    const { path } = this.props.match;

    return (
      <Provider accountStore={this.accountStore}>
        <div className={classes.root}>
          <Switch>
            <Route path={`${path}/edit`} component={UserForm} />
            <Route path={`${path}`} component={User} />
          </Switch>
        </div>
      </Provider>
    );
  }
}

export default withStyles(styles)(Account);
