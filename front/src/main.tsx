import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import { AuthProvider } from "./contexts/AuthContext";
import TripPage from "./components/TripPage";
import GroupChatWidgets from "./components/GroupChatWidget";
import VerifyPending from "./components/VerifyPending";
import VerifyFailed from "./components/VerifyFailed";
import AdminPanel from "./components/AdminPanel";
import AddTrip from "./components/AddTrip";
import ShowMember from "./components/ShowMember"
import Rides from "./components/Rides";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/chat/:trip_id", element: <TripPage />},
      { path: "/chatgroup", element: <GroupChatWidgets />},
      { path: "/verify-pending", element: <VerifyPending /> },
      { path: "/verify-failed", element: <VerifyFailed />},
      { path: "/admin", element: <AdminPanel /> },
      { path: "/addtrip", element: <AddTrip />},
      { path: "/showmember", element: <ShowMember />},
      {path: "/rides", element: <Rides />}
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);