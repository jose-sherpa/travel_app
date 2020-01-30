import React from "react";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import { getDaysUntilText } from "./../utils/MomentHelpers";

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
  },
  daysUntilHeader: {
    backgroundColor: "rgb(255, 255, 255)",
    borderBottomColor: "rgb(224, 224, 224)",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px"
  }
});

const convertDate = date => moment(date).format("M-D-YY");

class UsersTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <MUIDataTable
        title="Users"
        data={this.props.users}
        columns={[
          {
            name: "id",
            options: {
              filter: false,
              sort: true,
            }
          },
          {
            name: "email",
            label: "Email",
            options: {
              filter: true,
              sort: true,
              viewColumns: false,
              sortDirection: "asc",
            }
          },
          {
            name: "role",
            label: "Role",
            options: {
              filter: true,
              sort: true,
              viewColumns: false,
            }
          },
        ]}
        options={{
          filterType: "dropdown",
          responsive: "scrollFullHeight",
          selectableRows: false,
          ...this.props.tableOptions
        }}
      />
    );
  }
}

export default withStyles(styles)(UsersTable);
