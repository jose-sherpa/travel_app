import React from "react";
import ReactDOM from "react-dom";
import Home from "./Home";
import RootStore from "./stores/RootStore";
import { Provider } from "mobx-react";

const rootStore = new RootStore();

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!rootStore.apiKey) {
      rootStore.fetchToken()
    }
  }

  render() {
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
