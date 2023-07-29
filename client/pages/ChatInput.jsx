import React, { useState } from "react";
import "../styles/ChatInput.css";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

function ChatInput(prop){
    // gets passed handleSentMsg from ChatContainer
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState("");

    const handleEmojiPickerToggleShow = () =>{
        setShowEmojiPicker(!showEmojiPicker);
    }
    const handleEmojiClick = (emojiObject,event) =>{
        let message = msg;
        message += emojiObject.emoji;
        setMsg(message)
    }
    const sendChat = (event) =>{
        event.preventDefault();
        if(msg.length > 0){
            prop.handleSentMsg(msg);
            setMsg('')
        }
    }

    return(
        <div className="main-chat-input-container">
            <div className="button-container">
               <div className="emoji">
                <BsEmojiSmileFill onClick ={handleEmojiPickerToggleShow}/>
                { showEmojiPicker && <Picker onEmojiClick = {handleEmojiClick}/> }
               
               </div>
            </div>
            <form className="input-container" onSubmit={(e)=>{sendChat(e)}}>
                <input type="text" placeholder="Type here for your next experience!" value={msg} onChange={(e)=>setMsg( e.target.value)}/>
                <button className="submit">
                    <IoMdSend />
                </button>
            </form>
        </div>
    )
}

export default ChatInput;