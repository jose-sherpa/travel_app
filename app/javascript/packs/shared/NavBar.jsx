import React from "react";
import Button from "@material-ui/core/Button";
import { AppBar } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import { withStyles } from "@material-ui/core/styles";
import { inject, observer } from "mobx-react";
import NavMenu from "./NavMenu";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
});

const Logout = ({ onClick }) => (
  <Button onClick={onClick} color="inherit">
    Logout
  </Button>
);

@inject("rootStore")
@observer
class NavBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <NavMenu />
            <Typography variant="h6" className={classes.title}>
              Travel App
            </Typography>
            <Logout onClick={this.props.rootStore.logout} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(NavBar);
