import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import Home from "./components/Home";
import SpotDetail from "./components/SpotDetail";
import CreateSpotForm from "./components/CreateSpotForm/CreateSpotForm"; // Import the new component
import * as sessionActions from "./store/session";
import ManageSpots from "./components/ManageSpots";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/spots/:spotId",
        element: <SpotDetail />,
      },
      {
        path: "/spots/new",
        element: <CreateSpotForm />,
      },
      {
        path: "/spots/manage",
        element: <ManageSpots />,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
