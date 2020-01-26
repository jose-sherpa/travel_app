import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { inject, observer } from "mobx-react";
import { computed } from "mobx";
import moment from "moment";
import { Redirect } from "react-router-dom";
import { getDaysUntilText } from "./utils/MomentHelpers";

const maxCommentLength = 60;

const styles = theme => ({
  root: {
    padding: "2rem"
  },
  title: {
    flexGrow: 1
  },
  table: {
    minWidth: 600
  },
  daysUntil: {
    color: "gray"
  }
});
const useStyles = makeStyles(styles);

const convertDate = date => moment(date).format("M-D-YY");

function TripRow({ trip, onClick, daysUntilText }) {
  const classes = useStyles();

  let { comment } = trip;
  if (comment && comment.length > maxCommentLength) {
    comment = comment.substring(0, maxCommentLength - 3);
    comment += "...";
  }

  return (
    <TableRow hover={true} onClick={onClick}>
      <TableCell>
        {trip.destination}
        {daysUntilText && (
          <span className={classes.daysUntil}> ({daysUntilText})</span>
        )}
      </TableCell>
      <TableCell>{convertDate(trip.start_date)}</TableCell>
      <TableCell>{convertDate(trip.end_date)}</TableCell>
      <TableCell>{comment}</TableCell>
    </TableRow>
  );
}

@inject("tripStore")
@observer
class TripsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.props.tripStore.setTrip(null);
  }

  componentDidMount() {
    console.log("mounting trips index");
    this.props.tripStore.fetchTrips();
  }

  @computed
  get trips() {
    return this.props.tripStore.getTrips();
  }

  render() {
    console.log("rendering trips index");
    const trip = this.props.tripStore.getTrip();
    if (trip) {
      return <Redirect to={`/trips/${trip.id}`} />;
    }

    const now = moment();
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Destination</TableCell>
                <TableCell>Start date</TableCell>
                <TableCell>End date</TableCell>
                <TableCell>Comment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.trips.map(trip => (
                <TripRow
                  key={trip.id}
                  trip={trip}
                  daysUntilText={getDaysUntilText(moment(trip.start_date), now)}
                  onClick={() => this.props.tripStore.setTrip(trip)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withStyles(styles)(TripsIndex);