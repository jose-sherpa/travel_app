import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { inject, observer } from "mobx-react";
import { computed } from "mobx";
import moment from "moment";
import { getDaysUntilText } from "../utils/MomentHelpers";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ReactToPrint from "react-to-print";
import PrintIcon from "@material-ui/icons/Print";

const styles = theme => ({
  root: {
    padding: "1rem"
  },
  container: {
    padding: "1rem"
  },
  table: {
    minWidth: 600
  },
  daysUntil: {
    color: "gray"
  },
  card: {
    marginTop: theme.spacing(2),
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  link: {
    color: "#000",
    textDecoration: "none"
  }
});

const useStyles = makeStyles(styles);

const convertDate = date => moment(date).format("MMM D YYYY [at] h:mm a");

function TripCard({ trip }) {
  const classes = useStyles();

  const { destination, start_date, end_date, comment } = trip;
  const startDate = convertDate(start_date);
  const endDate = convertDate(end_date);
  const now = moment();
  const startMoment = moment(start_date);
  const daysUntilText = getDaysUntilText(startMoment, now);

  return (
    <Card elevation={2} className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {destination}
          {daysUntilText && (
            <Typography
              color="textSecondary"
              variant="h5"
              className={classes.daysUntil}
              component="span"
            >
              ({daysUntilText})
            </Typography>
          )}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {startDate} - {endDate}
        </Typography>
        <Typography variant="body1" component="p">
          {comment}
        </Typography>
      </CardContent>
    </Card>
  );
}

@inject("tripStore")
@observer
class TripItinerary extends React.Component {
  constructor(props) {
    super(props);
    this.props.tripStore.setTrip(null);
    this.state = {
      startOfMonth: moment()
        .endOf("month")
        .add(1, "second")
    };
  }

  componentDidMount() {
    this.props.tripStore.fetchItinerary(this.state.startOfMonth);
  }

  @computed
  get trips() {
    return this.props.tripStore.getTrips();
  }

  tripContent() {
    if (this.trips.length === 0) {
      return (
        <Typography variant="h6">
          You have no trips planned during this month.
        </Typography>
      );
    }

    return this.trips.map(trip => <TripCard key={trip.id} trip={trip} />);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ReactToPrint
          trigger={() => (
            <Button>
              <PrintIcon />
            </Button>
          )}
          content={() => this.componentRef}
        />
        <div className={classes.container} ref={el => (this.componentRef = el)}>
          <Typography variant="h3">
            Itinerary for {this.state.startOfMonth.format("MMM YYYY")}
          </Typography>
          {this.tripContent()}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TripItinerary);
