import React, { useState, useEffect } from 'react';
import "../styles/Chat.css";
import Contacts from "../pages/Contacts";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';


function Chat(){

    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined)

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

    return(
        <div className="main-container">
            <div className='container'>
                {/* {contacts.map(contact => (
                    // Step 3: Map through contacts array and pass the name prop to Contacts component
                    <Contacts key={contact.user_id} contactName={contact.name} contactProfilePhoto ={contact.profilePhoto} contactIdInfo ={contact.user_id} currentUser={currentUser}/>
                ))}  */}
                <Contacts contacts = {contacts} currentUser = { currentUser }/>
            
            </div>
        </div>
    )
}

export default Chat;