import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { inject, observer } from "mobx-react";
import { computed } from "mobx";
import { Redirect } from "react-router-dom";
import TripsTable from "./TripsTable";

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

@inject("tripStore")
@observer
class TripsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.props.tripStore.setTrip(null);
  }

  componentDidMount() {
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
      const userId = this.props.tripStore.getUser()?.id;
      const redirect = userId
        ? `/admin/users/${userId}/trips/${trip.id}`
        : `/trips/${trip.id}`;
      return <Redirect to={redirect} />;
    }

    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <TripsTable
          trips={this.trips}
          tableOptions={{
            print: false,
            download: false,
            onRowClick: (rowData, rowMeta) => {
              this.props.tripStore.setTrip(this.trips[rowMeta.dataIndex]);
            }
          }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(TripsIndex);
