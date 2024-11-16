import React from 'react'
import { useNavigate } from 'react-router-dom';


function Home() {

    const navigate = useNavigate();

    return (

        <>
            <div>Home</div>
            <button  onClick={()=>navigate("/tarkistus")} >Siiry Tarkistukseen</button>
            <button  onClick={()=>navigate("/myynti")} >Siiry Myyntiin</button>



        </>
    )
}

export default Home