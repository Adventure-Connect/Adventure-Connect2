import React, { useState, useEffect } from 'react';
import "../styles/Chat.css";
import Contacts from "../pages/Contacts";
import Welcome from "../pages/Welcome";
import ChatContainer from "../pages/ChatContainer";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';


function Chat(){

    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);

    //current user Information from cookies
    const [cookies, setCookies] = useCookies();
    const currentEmail = cookies.currentEmail;
    
    
  
    const userCheck = async () =>{
         //if user does not exist aka if user email is not found reroute to login page
         if(!currentEmail){
            navigate("/");
        }else{
            //look for user in database
            fetch(`http://localhost:3000/api/${currentEmail}`)
            //make response into json
                .then(response => {
                    return response.json()
                })
                .then(userData => {
                    //set current user to current user data
                    // console.log(userData)
                    setCurrentUser(userData)
                    setIsLoaded(true);
                })
        }
       
    }

    useEffect( () => {
        userCheck();
    }, [])

    useEffect(() => {
        if (currentUser) {
            // Step 2: Extract an array of contact objects from currentUser?.connections
            setContacts(currentUser?.connections || []);
        }
    }, [currentUser])
    const handleChatChange = (chat) =>{
        setCurrentChat(chat)
    }

    return(
        <div className="main-chat-container">
            <div className='chat-container'>
                <Contacts contacts = {contacts} currentUser = { currentUser } changeChat = {handleChatChange}/>
                {isLoaded && currentChat === undefined ? (
                    <Welcome currentUser = { currentUser }/>
                ):(
                    <ChatContainer currentChat = { currentChat } currentUser = { currentUser }/>
                )}
                
            </div>
        </div>
    )
}

export default Chat;