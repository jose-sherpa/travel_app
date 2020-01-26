import React from "react";
import Typography from "@material-ui/core/Typography";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {inject, observer} from "mobx-react";
import {computed} from "mobx";
import moment from "moment";
import { Redirect } from "react-router-dom";

const maxCommentLength = 40;

const styles = theme => ({
  root: {
    padding: '2rem',
  },
  title: {
    flexGrow: 1
  },
  table: {
    minWidth: 600,
  },
});
// const useStyles = makeStyles(styles);

const convertDate = date => moment(date).format('M-D-YY');

function TripRow({trip, onClick}) {
  // const classes = useStyles();

  let { comment } = trip;
  if (comment && comment.length > maxCommentLength) {
    comment = comment.substring(0, maxCommentLength-3);
    comment += '...'
  }

  return (
    <TableRow hover={true} onClick={onClick}>
      <TableCell>{trip.id}</TableCell>
      <TableCell>{trip.destination}</TableCell>
      <TableCell>{convertDate(trip.start_date)}</TableCell>
      <TableCell>{convertDate(trip.end_date)}</TableCell>
      <TableCell>{comment}</TableCell>
    </TableRow>
  )
}

@inject('tripStore')
@observer
class TripsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.props.tripStore.setTrip(null)
  }

  componentDidMount() {
    console.log('mounting trips index')
    this.props.tripStore.fetchTrips()
  }

  @computed
  get trips() {
    return this.props.tripStore.getTrips()
  }

  render() {
    console.log('rendering trips index')
    const trip = this.props.tripStore.getTrip();
    if (trip) {
      return <Redirect to={`/trips/${trip.id}`}/>
    }

    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <TableContainer component={Paper}>
          <Table
            className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Start date</TableCell>
                <TableCell>End date</TableCell>
                <TableCell>Comment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.trips.map(trip => <TripRow
                key={trip.id}
                trip={trip} onClick={
                () => this.props.tripStore.setTrip(trip)
              }/>)}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }
}

export default withStyles(styles)(TripsIndex)