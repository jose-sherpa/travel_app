import React from "react";
import {inject, observer} from "mobx-react";
import {CircularProgress} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Link, Redirect} from "react-router-dom";
import moment from "moment";
import AlertDialog from "./shared/AlertDialog";

const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  link: {
    color: '#000',
    textDecoration: 'none',
  }
});

const convertDate = date => moment(date).format('MMM D YYYY');

function TripCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const { id, destination, start_date, end_date, comment } = props.trip;
  const startDate = convertDate(start_date);
  const endDate = convertDate(end_date);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {destination}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {startDate} - {endDate}
        </Typography>
        <Typography variant="body2" component="p">
          {comment}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small"><Link className={classes.link} to={`/trips/${id}/edit`}>Edit</Link></Button>
        <Button size="small" onClick={props.onDelete}>Delete</Button>
      </CardActions>
    </Card>
  );
}

const styles = {
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

@inject('tripStore')
@observer
class Trip extends React.Component {
  constructor(props) {
    super(props);
    this.deleteTrip = this.deleteTrip.bind(this);
    this.tripDeleteConfirmation = this.tripDeleteConfirmation.bind(this);
    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    this.props.tripStore.fetchTrip(this.tripID(),
      () => this.setState({loading: false}))
  }

  tripID() {
   return this.props.match.params.id
  }

  deleteTrip() {
    this.setState({confirmDelete: true})
  }

  tripDeleteConfirmation(result) {
    if (result) {
      this.props.tripStore.deleteTrip(() => this.setState({ redirectTo: '/trips' }))
    }
    this.setState({confirmDelete: false})
  }

  render() {
    console.log(`rendering trip for path ${this.props.location.pathname}`);
    if (this.state.redirectTo) return <Redirect to={this.state.redirectTo}/>;

    if (this.state.loading) {
      return <CircularProgress/>
    }

    const trip = this.props.tripStore.getTrip();
    if (!trip) {
      return <Redirect to="/trips"/>
    }

    return (
      <div>
        <AlertDialog
          open={this.state.confirmDelete || false}
          onClose={() => this.tripDeleteConfirmation(false)}
          title="Confirm trip deletion"
          text="Are you sure you want to delete this trip?">
          <Button onClick={() => this.tripDeleteConfirmation(false)} color="primary" autoFocus>
            No
          </Button>
          <Button onClick={() => this.tripDeleteConfirmation(true)} color="primary">
            Yes
          </Button>
        </AlertDialog>
        <TripCard trip={trip} onDelete={this.deleteTrip}/>
      </div>
    )
  }
}

export default Trip
