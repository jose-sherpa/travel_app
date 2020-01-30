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
import AlertDialog from "./../shared/AlertDialog";

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

function UserCard(props) {
  const classes = useStyles();
  const { id, email, role } = props.user;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {email}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {id} {role}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">
          <Link className={classes.link} to={`/manager/users/${id}/edit`}>
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

@inject("userStore")
@observer
class User extends React.Component {
  constructor(props) {
    super(props);
    this.deleteUser = this.deleteUser.bind(this);
    this.userDeleteConfirmation = this.userDeleteConfirmation.bind(this);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.props.userStore.fetchUser(this.userID(), () =>
      this.setState({ loading: false })
    );
  }

  userID() {
    return this.props.match.params.id;
  }

  deleteUser() {
    this.setState({ confirmDelete: true });
  }

  userDeleteConfirmation(result) {
    if (result) {
      this.props.userStore.deleteUser(() =>
        this.setState({ redirectTo: "/manager/users" })
      );
    }
    this.setState({ confirmDelete: false });
  }

  render() {
    console.log(`rendering user for path ${this.props.location.pathname}`);
    if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />;

    if (this.state.loading) {
      return <CircularProgress />;
    }

    const user = this.props.userStore.user;
    if (!user) {
      return <Redirect to="/manager/users" />;
    }

    return (
      <div>
        <AlertDialog
          open={this.state.confirmDelete || false}
          onClose={() => this.userDeleteConfirmation(false)}
          title="Confirm user deletion"
          text="Are you sure you want to delete this user?"
        >
          <Button
            onClick={() => this.userDeleteConfirmation(false)}
            color="primary"
            autoFocus
          >
            No
          </Button>
          <Button
            onClick={() => this.userDeleteConfirmation(true)}
            color="primary"
          >
            Yes
          </Button>
        </AlertDialog>
        <UserCard user={user} onDelete={this.deleteUser} />
      </div>
    );
  }
}

export default User;
