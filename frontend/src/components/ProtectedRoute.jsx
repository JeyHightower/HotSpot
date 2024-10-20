import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// A component that renders a route only if the user is authenticated
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const currentUser = useSelector((state) => state.session.user);

  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? <Component {...props} /> : <Navigate to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
