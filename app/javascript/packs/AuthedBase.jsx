import React from "react";
import { inject, observer } from "mobx-react";
import {BrowserRouter, Route} from "react-router-dom"
import NavBar from "./shared/NavBar";
import Signup from "./Signup";

@inject("rootStore")
@observer
class AuthedBase extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <NavBar />
      </div>
    );
  }
}

export default AuthedBase;
