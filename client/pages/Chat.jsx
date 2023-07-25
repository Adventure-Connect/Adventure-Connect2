import React, { useState, useEffect } from 'react';
import "../styles/Chat.css";
// import axios from "axios";

function Chat(){

    const [contact, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined)
    //should i check if their is no user profile image because there must be an image to get this far in the app so this check is not necessary


    // useEffect(async () => {
    //     if()
    // }, [])

    return(
        <div className = "main-container">
            <div className ='container'>
                
            </div>
            
        </div>
    )
}

export default Chat;