import React from "react";
import { inject, observer } from "mobx-react";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Link, Redirect } from "react-router-dom";
import moment from "moment";
import AlertDialog from "../shared/AlertDialog";
import { getDaysUntilText } from "../utils/MomentHelpers";

const useStyles = makeStyles({
  card: {
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
  },
  daysUntil: {
    marginLeft: 10
  }
});

const convertDate = date => moment(date).format("MMM D YYYY [at] h:mm a");

function TripCard(props) {
  const classes = useStyles();
  const { userId } = props;
  const { id, destination, start_date, end_date, comment } = props.trip;

  const editUrl = userId
    ? `/admin/users/${userId}/trips/${id}/edit`
    : `/trips/${id}/edit`;

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
      <CardActions>
        <Button size="small">
          <Link className={classes.link} to={editUrl}>
            Edit
          </Link>
        </Button>
        <Button size="small" onClick={props.onDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

@inject("tripStore")
@observer
class Trip extends React.Component {
  constructor(props) {
    super(props);
    this.deleteTrip = this.deleteTrip.bind(this);
    this.tripDeleteConfirmation = this.tripDeleteConfirmation.bind(this);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.props.tripStore.fetchTrip(this.tripID(), () =>
      this.setState({ loading: false })
    );
  }

  tripID() {
    return this.props.match.params.id;
  }

  deleteTrip() {
    this.setState({ confirmDelete: true });
  }

  tripDeleteConfirmation(result) {
    if (result) {
      this.props.tripStore.deleteTrip(() => this.props.tripStore.setTrip(null));
    }
    this.setState({ confirmDelete: false });
  }

  render() {
    if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />;

    if (this.state.loading) {
      return <CircularProgress />;
    }

    const trip = this.props.tripStore.getTrip();
    const userId = this.props.tripStore.getUser()?.id;

    if (!trip) {
      const redirect = userId ? `/admin/users/${userId}/trips` : "/trips";
      return <Redirect to={redirect} />;
    }

    return (
      <div>
        <AlertDialog
          open={this.state.confirmDelete || false}
          onClose={() => this.tripDeleteConfirmation(false)}
          title="Confirm trip deletion"
          text="Are you sure you want to delete this trip?"
        >
          <Button
            onClick={() => this.tripDeleteConfirmation(false)}
            color="primary"
            autoFocus
          >
            No
          </Button>
          <Button
            onClick={() => this.tripDeleteConfirmation(true)}
            color="primary"
          >
            Yes
          </Button>
        </AlertDialog>
        <TripCard
          trip={trip}
          onDelete={this.deleteTrip}
          userId={this.props.tripStore.user?.id}
        />
      </div>
    );
  }
}

export default Trip;
