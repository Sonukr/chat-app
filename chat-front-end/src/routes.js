import Home from "./Feature/home";
import Chat from "./Feature/chat";

export const router = [
  {
    key: 'root',
    path: "/",
    component: Home,
  },
  {
    key: 'chat',
    path: '/chat/:id/',
    component: Home
  },
  {
    key: 'chat',
    path: '/chat/:id/:userId',
    component: Chat
  }
];