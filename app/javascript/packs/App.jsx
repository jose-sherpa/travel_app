import React from "react";
import ReactDOM from "react-dom";
import Home from "./Home";
import RootStore from "./stores/RootStore";
import { Provider } from "mobx-react";
import {CircularProgress} from "@material-ui/core";

const rootStore = new RootStore();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    if (!rootStore.apiKey) {
      rootStore
        .fetchToken(() => this.setState({loading: false}));
    }
  }

  render() {
    if (this.state.loading) {
      return (<CircularProgress />)
    }

    return (
      <Provider rootStore={rootStore}>
        <Home />
      </Provider>
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <App />,
    document.body.appendChild(document.createElement("div"))
  );
});
