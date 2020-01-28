import React from "react";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
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
  },
  daysUntilHeader: {
    backgroundColor: "rgb(255, 255, 255)",
    borderBottomColor: "rgb(224, 224, 224)",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px"
  }
});

const convertDate = date => moment(date).format("M-D-YY");

class TripsTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    const now = moment();

    return (
      <MUIDataTable
        title="Trips"
        data={this.props.trips}
        columns={[
          {
            name: "id",
            options: {
              filter: false,
              sort: false,
              display: "excluded"
            }
          },
          {
            name: "destination",
            label: "Destination",
            options: {
              filter: true,
              sort: true,
              viewColumns: false
            }
          },
          {
            name: "days_until",
            label: "Days until",
            options: {
              filter: false,
              sort: false,
              viewColumns: false,
              customHeadRender: columnMeta => {
                return (
                  <th
                    key={columnMeta.index}
                    className={classes.daysUntilHeader}
                  />
                );
              },
              setCellProps: () => {
                return { style: { textAlign: "right" } };
              },
              customBodyRender: (_, { columnIndex, rowData }) => {
                const daysUntil = getDaysUntilText(
                  moment(rowData[columnIndex + 1]),
                  now
                );

                return (
                  daysUntil && (
                    <span className={classes.daysUntil}>({daysUntil}) </span>
                  )
                );
              }
            }
          },
          {
            name: "start_date",
            label: "Start date",
            options: {
              filter: false,
              sort: true,
              viewColumns: false,
              sortDirection: "asc",
              customBodyRender: value => convertDate(value)
            }
          },
          {
            name: "end_date",
            label: "End date",
            options: {
              filter: false,
              sort: true,
              customBodyRender: value => convertDate(value)
            }
          },
          {
            name: "comment",
            label: "Comment",
            options: {
              filter: false,
              sort: false,
              customBodyRender: value => {
                if (value && value.length > maxCommentLength) {
                  value = value.substring(0, maxCommentLength - 3);
                  value += "...";
                }
                return value;
              }
            }
          }
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

export default withStyles(styles)(TripsTable);
