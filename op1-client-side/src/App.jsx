import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Login'
import Tarkistus from './Tarkistus'
import Myynti from './Myynti'
import {createBrowserRouter, RouterProvider,} from "react-router-dom";

import Home from './Home'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: 'home',
    element: <Home />
  },
  {
    path: 'tarkistus',
    element: <Tarkistus />
  },
  {
    path: 'myynti',
    element: <Myynti />
  },
]);


function App() {



  return (
    <>
      <RouterProvider router={router} />
      {/* <Login></Login> */}
    </>
  )
}

export default App
