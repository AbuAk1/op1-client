import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Login'
import Tarkistus from './Tarkistus'
import {createBrowserRouter, RouterProvider,} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: 'tarkistus',
    element: <Tarkistus />
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
