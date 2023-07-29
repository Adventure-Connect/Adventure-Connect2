import React, {useState, useEffect}from 'react'
import Stitch from '../images/s3.gif'
import "../styles/Welcome.css";

function Welcome(prop){
    //we get currentUser from Chat.jsx
    // console.log(prop.currentUser.name)
    const [currentUserName, setCurrentUserName] = useState(undefined);
    

    useEffect(()=>{
        if(prop.currentUser){
            setCurrentUserName(prop.currentUser.name)
           
        }
    },[prop.currentUser]);
    
   
   

    return(
        <div className='main-welcome-container'>
            <img src={Stitch} alt = "Stitch Waving"/>
            <h1>Welcome <span>{currentUserName}</span>!</h1>
            {/* <h1>Welcome!</h1> */}
            <h3>Select a chat to get started on your next Adventure!</h3>
        </div>
    )

}

export default Welcome;