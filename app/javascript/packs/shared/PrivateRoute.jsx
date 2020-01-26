import React from "react";
import { Route, Redirect } from "react-router-dom";
import { inject, observer } from "mobx-react";

const privateRoute = ({ component: Component, rootStore, ...rest }) => {
  let authed = rootStore.apiKey;
  return (
    <Route
      {...rest}
      rootStore={rootStore}
      render={props => {
        let newProps = { ...props, ...rest.componentProps };
        return authed ? (
          <Component {...newProps} />
        ) : (
          <Redirect
            to={{
              pathname: "/users/login",
              state: newProps.location?.state
            }}
          />
        );
      }}
    />
  );
};

const PrivateRoute = inject("rootStore")(observer(privateRoute));

export default PrivateRoute;
