import React from 'react';

import './App.css';
import Chat from './Feature/chat';
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './routes';

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
