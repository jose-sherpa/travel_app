import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import { Switch, Route, Link } from "react-router-dom";
import TripsIndex from "./TripsIndex";
import TripForm from "./TripForm";
import { Provider } from "mobx-react";
import TripStore from "./stores/TripStore";
import Trip from "./Trip";
import { inject, observer } from "mobx-react";
import TripItinerary from "./TripItinerary";

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
    <Link to="/trips/new" className={classes.link}>
      <Button>
        <Typography variant="h4" className={classes.title}>
          New trip
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
class Trips extends React.Component {
  constructor(props) {
    super(props);
    this.tripsStore = new TripStore(this.props.rootStore.authStore);
  }

  header() {
    const {
      classes,
      location: { pathname }
    } = this.props;

    if (!pathname.match(/\/trips(\/)?$/)) {
      return (
        <Link to="/trips" className={classes.link}>
          <Button>Back to trips</Button>
        </Link>
      );
    }

    return <AddButton />;
  }

  render() {
    const { classes } = this.props;
    console.log(`rendering trips for path ${this.props.location.pathname}`);
    let { path } = this.props.match;
    return (
      <Provider tripStore={this.tripsStore}>
        <div className={classes.root}>
          <div className={classes.header}>{this.header()}</div>
          <Switch>
            <Route path={`${path}/itinerary`} component={TripItinerary} />
            <Route path={`${path}/new`} component={TripForm} />
            <Route path={`${path}/:id/edit`} component={TripForm} />
            <Route path={`${path}/:id`} component={Trip} />
            <Route path={`${path}`} component={TripsIndex} />
          </Switch>
        </div>
      </Provider>
    );
  }
}

export default withStyles(styles)(Trips);
