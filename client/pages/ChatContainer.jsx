import React, {useState, useEffect}from "react";
import "../styles/ChatContainer.css";
import ChatInput from "../pages/ChatInput";
import Messages from "../pages/Messages";

function ChatContainer(prop){
    // We are passed the currentChat and currentUser from Chat.jsx
    const [currentChatName, setCurrentChatName] = useState(undefined);
    const [currentChatImage, setCurrentChatImage] = useState(undefined);

    useEffect(()=>{
        if(prop.currentChat){
            setCurrentChatImage(prop.currentChat.profilePhoto)
            setCurrentChatName(prop.currentChat.name)
        }
    },[prop.currentChat]);

    // const [messages,setMessages] = useState([])

    // useEffect(async()=>{
    //     // POST request using fetch()
    //     await fetch(`http://localhost:3000/api/messages/getMsgs`, {
            
    //     // Adding method type
    //     method: "POST",
        
    //     // Adding body or contents to send
    //     body: JSON.stringify({
    //         from: prop.currentUser._id,
    //         to: prop.currentChat._id
    //     }),
        
    //     // Adding headers to the request
    //     headers: {
    //         "Content-type": "application/json; charset=UTF-8"
    //     }
    //     })
    //     // Converting to JSON
    //     .then(response => response.json())
    //     /*.then(response => setMessages(response.json))*/
    //     // Displaying results to console
    //     .then(json => console.log(json));
    // },[prop.currentChat]);

    const handleSentMsg = async(msg) =>{
        alert(msg);
        // POST request using fetch()
        fetch(`http://localhost:3000/api/messages/addMsg`, {
            
        // Adding method type
        method: "POST",
        
        // Adding body or contents to send
        body: JSON.stringify({
            from: prop.currentUser._id,
            to: prop.currentChat._id,
            message: msg
        }),
        
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        })
        // Converting to JSON
        .then(response => response.json())
        // Displaying results to console
        .then(json => console.log(json));
   
    }

    return(
        <div className="main-chat-c-container">
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                        <img src={`${currentChatImage}`} alt={`${currentChatName}'s Profile Photo`}/>
                    </div>
                    <div className="username">
                        <h3>{currentChatName}</h3>
                    </div>
                </div>
            </div>

            {/* <div className="chat-messages">

            </div> */}
            <Messages/>

            <ChatInput handleSentMsg = {handleSentMsg}/>
        </div>
    )
}

export default ChatContainer;