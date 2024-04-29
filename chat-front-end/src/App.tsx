import React from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.css';
import { router } from './routes';
import Signup from './Feature/signup';
import Login from './Feature/login';
import Navbar from './Components/Navbar/index';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
      
          {router
            && router.map((route) => (
              <Route
                key={route.key}
                path={route.path}
                element={(
                  <route.component />
                )}
              />
            ))}
       
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
