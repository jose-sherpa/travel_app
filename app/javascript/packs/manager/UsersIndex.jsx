import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { inject, observer } from "mobx-react";
import { computed } from "mobx";
import { Redirect } from "react-router-dom";
import UsersTable from "./UsersTable";

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

@inject("userStore")
@observer
class UsersIndex extends React.Component {
  constructor(props) {
    super(props);
    this.props.userStore.user = null;
  }

  componentDidMount() {
    this.props.userStore.fetchUsers();
  }

  @computed
  get users() {
    return this.props.userStore.users;
  }

  render() {
    const user = this.props.userStore.user;
    if (user) {
      return <Redirect to={`/manager/users/${user.id}`} />;
    }

    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <UsersTable
          users={this.users}
          tableOptions={{
            print: false,
            download: false,
            onRowClick: (rowData, rowMeta) => {
              this.props.userStore.user = this.users[rowMeta.dataIndex];
            }
          }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(UsersIndex);
