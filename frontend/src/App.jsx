import { React, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  NavLink,
} from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import * as sessionActions from "./store/session";
import "./index.css";
import HomePage from "./components/Homepage";
import SpotDetail from "./components/SpotDetail";
import SpotForm from "./components/SpotForm/SpotForm";
import ManageSpots from "./components/ManageSpots/ManageSpots";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateSpotForm from "./components/UpdateSpotForm";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser ()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <header className="app-header">
        <NavLink to="/" className="app-logo">
          <img src="../assets/hotspotLogo.jpg" alt="HotSpot Logo" className="logo" />
        </NavLink>
        <Navigation isLoaded={isLoaded} />
      </header>
      <main>{isLoaded && <Outlet />}</main>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/spots/:spotId",
        element: <SpotDetail />,
      },
      {
        path: "/spots/create",
        element: <SpotForm />,
      },
      {
        path: "/spots/manage",
        element: <ProtectedRoute component={ManageSpots} />,
      },
      {
        path: "/spots/:spotId/edit",
        element: <ProtectedRoute component={UpdateSpotForm} />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;