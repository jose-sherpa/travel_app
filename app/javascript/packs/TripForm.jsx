import React from "react";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { inject, observer } from "mobx-react";
import { CircularProgress } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import withStyles from "@material-ui/core/styles/withStyles";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import { computed } from "mobx";

const styles = theme => ({
  form: {},
  datePicker: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
});

@inject("tripStore")
@observer
class TripForm extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      loading: true
    };
    this.props.tripStore.setTrip(this.newTrip());
  }

  componentDidMount() {
    const {
      tripStore,
      match: {
        params: { id }
      }
    } = this.props;
    if (!id) {
      this.setState({ loading: false });
    } else {
      tripStore.fetchTrip(id, () => this.setState({ loading: false }));
    }
  }

  newTrip() {
    return {
      start_date: moment().format(),
      end_date: moment().format()
    };
  }

  submit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    this.props.tripStore.postTrip(response => {
      this.setState({ loading: false, ...response });
    });
  }

  @computed
  get errorMessages() {
    let { errors } = this.state;
    if (!errors) return {};

    let errorMessages = {};
    Object.entries(errors).forEach(
      ([key, value]) => (errorMessages[key] = value[0])
    );
    return errorMessages;
  }

  render() {
    // console.log(`rendering trip form for path ${this.props.location.pathname}`)
    if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />;

    if (this.state.loading) return <CircularProgress />;

    const { classes } = this.props;
    const trip = this.props.tripStore.getTrip();
    return (
      <div>
        <Paper style={{ padding: 10 }}>
          <form className={classes.form} onSubmit={this.submit}>
            <FormGroup style={{ display: "inline-block" }}>
              <FormControl
                error={Boolean(this.errorMessages.destination)}
                style={{ paddingRight: 20 }}
              >
                <InputLabel htmlFor="destination">Destination</InputLabel>
                <Input
                  id="destination"
                  value={trip.destination || ""}
                  placeholder="destination"
                  type="text"
                  required={true}
                  onChange={e => (trip.destination = e.target.value)}
                />
                <FormHelperText>
                  {this.errorMessages.destination || ""}
                </FormHelperText>
              </FormControl>
              <MuiPickersUtilsProvider
                libInstance={moment}
                utils={MomentUtils}
                locale="en"
              >
                <DateTimePicker
                  style={{ paddingRight: 10 }}
                  label="Start date"
                  value={trip.start_date}
                  error={Boolean(this.errorMessages.start_date)}
                  helperText={this.errorMessages.start_date || ""}
                  onChange={e => (trip.start_date = e.format())}
                />
                <DateTimePicker
                  label="End date"
                  value={trip.end_date}
                  error={Boolean(this.errorMessages.end_date)}
                  helperText={this.errorMessages.end_date || ""}
                  onChange={e => (trip.end_date = e.format())}
                />
              </MuiPickersUtilsProvider>
            </FormGroup>
            <FormGroup style={{ paddingTop: 50 }}>
              <FormControl fullWidth={true} size="medium">
                <InputLabel htmlFor="comment">Comments</InputLabel>
                <Input
                  id="comment"
                  value={trip.comment || ""}
                  placeholder="comments"
                  type="text"
                  multiline={true}
                  error={Boolean(this.errorMessages.comment)}
                  rowsMin={4}
                  onChange={e => (trip.comment = e.target.value)}
                />
                <FormHelperText>
                  {this.errorMessages.comment ||
                    "Enter comments about your trip"}
                </FormHelperText>
              </FormControl>
            </FormGroup>
            <Button style={{ marginTop: 20 }} type="submit">
              Submit
            </Button>
          </form>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(TripForm);
