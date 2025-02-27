import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import { AuthProvider } from "./contexts/AuthContext";
import Chat from "./components/Chat";
import GroupChatWidgets from "./components/GroupChatWidget";
import VerifyPending from "./components/VerifyPending";
import VerifyFailed from "./components/VerifyFailed";
import AdminPanel from "./components/AdminPanel";
import AddRide from "./components/AddRide";
import ShowMember from "./components/ShowMember"

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/chat/:trip_id", element: <Chat />},
      { path: "/chatgroup", element: <GroupChatWidgets />},
      { path: "/verify-pending", element: <VerifyPending /> },
      { path: "/verify-failed", element: <VerifyFailed />},
      { path: "/admin", element: <AdminPanel /> },
      { path: "/addride", element: <AddRide />},
      { path: "/showmember", element: <ShowMember />}
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