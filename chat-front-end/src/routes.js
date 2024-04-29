import {
  createBrowserRouter,
} from "react-router-dom";
import Home from "./Feature/home";
import Chat from "./Feature/chat";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: '/chat/:id/:userId',
    element: <Chat/>
  }
]);