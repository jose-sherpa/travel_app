import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import { Provider } from "mobx-react";
import { inject, observer } from "mobx-react";
import UsersIndex from "./manager/UsersIndex";
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

const useStyles = makeStyles(styles);

@inject("rootStore")
@observer
class Account extends React.Component {
  constructor(props) {
    super(props);
    this.accountStore = new AccountStore(this.props.rootStore.authStore);
  }

  render() {
    console.log(`rendering account for path ${this.props.location.pathname}`);
    const { classes } = this.props;
    let { path } = this.props.match;
    console.log(path);
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
