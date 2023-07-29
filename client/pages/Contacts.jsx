import React, { useState , useEffect} from "react"; 
import "../styles/Contacts.css";

function Contacts(prop){
    // console.log(prop.contacts)
    // console.log(prop.currentUser)
    // We get currentUser, contacts, and changeChat from Chat.jsx

    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);

    useEffect(()=>{
        if(prop.currentUser){
            setCurrentUserImage(prop.currentUser.profilePhoto)
            setCurrentUserName(prop.currentUser.name)
        }
    },[prop.currentUser]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index)
        prop.changeChat(contact)
    }
    
    return(
        <>
        {currentUserImage && currentUserName && (
            <div className="main-contact-container">
                <div className='contact-container'>
                    {/* <div className="brand"> */}
                        {/* <img src = {`${Logo}` alt ="logo"} /> */}
                        {/* <h3>Adventure Connect</h3>  */}
                    {/* </div> */}
                    <div className="contacts">
                    {prop.contacts.map((contact, index)=>{
                        return(
                            <div className={`contact ${index === currentSelected ? "selected" : " "}`} key ={index} onClick={()=>changeCurrentChat(index, contact)}>

                                <div className="avatar"> 
                                    <img src={`${contact.profilePhoto}`} alt={`${contact.name}'s profile image` }/>
                                </div>
                                <div className = "username">
                                    <h3>{contact.name}</h3>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="current-user">
                    <div className="avatar">
                        <img src ={`${currentUserImage}`} alt={`${currentUserName}'s profile image`}/>
                    </div>
                    <div className = "username">
                         <h2>{currentUserName}</h2>
                     </div>
                </div>
            </div>
            </div>
        )}
        </>
    )
}


export default Contacts;
