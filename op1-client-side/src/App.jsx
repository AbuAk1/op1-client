import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from "./pages/Login"
import Tarkistus from './pages/Tarkistus'
import Myynti from './pages/Myynti'
import {createBrowserRouter, RouterProvider,} from "react-router-dom";

import Home from './pages/Home'


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
