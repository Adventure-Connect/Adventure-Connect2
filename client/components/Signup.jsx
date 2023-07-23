
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import Select from 'react-select';
import ImageUpload from './ImageUpload';

const Signup = () => {

    const list = [
        { label: 'Backpacking',  value: 'Backpacking' },
        { label: 'Camping',  value: 'Camping' },
        { label: 'Climbing',  value: 'Climbing' },
        { label: 'Hiking',  value: 'Hiking' },
        { label: 'Mountain Biking',  value: 'Mountain Biking' },
        { label: 'Rafting',  value: 'Rafting' },
        { label: 'Road Cycling',  value: 'Road Cycling' },
        { label: 'Roller Skating',  value: 'Roller Skating' },
        { label: 'Trail Running',  value: 'Trail Running' }
    ];
    //create ref to image upload child component
    const imageUploadRef = useRef(null);

    const navigate = useNavigate();
    // const [ interestLabels, setInterestLabels ] = useState([]);
    const [ interests, setInterests ] = useState(new Set());
    const [ activities, setActivities ] = useState(list);
    const [ name, setName ] = useState();
    const [ email, setEmail ] = useState();
    const [ password, setPassword ] = useState();
    const [ zipcode, setZipcode ] = useState();
    const [ bio, setBio ] = useState();
    const [ imageCount, setImageCount ] = useState(0);

    //function to update imageCount from child component
    const updateImageCount = (newImageCount) => {
        setImageCount(newImageCount);
    }

    //signup with provided information and call image upload function from ImageUpload child component
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('inside submit', interests)
        const info = {
            name: name,
            email: email,
            password: password,
            zipCode: zipcode,
            interests: Array.from(interests),
            bio: bio,
            imageCount: imageCount
        };
        try {
            await fetch('http://localhost:8080/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(info)
            })
            if (imageUploadRef.current) {
                imageUploadRef.current.handleFileUpload(e, email. imageCount);
            }
            navigate('/dashboard', {state:{email: email}});
            return;
        }
        catch (err) {
            alert(`An error has occurred! ${err.message}`);
            return err;
        };
        
    }

    
    const removeInterest = (e) => {
        e.preventDefault();
        let interest = e.target.parentElement.getAttribute('interest');  
        const tempInt = new Set(interests);
        const tempAct = activities.slice();
        tempInt.delete(interest);
        tempAct.push({label: interest, value: interest});
        setInterests(tempInt);
        setActivities(tempAct.sort((a,b) => a.label.localeCompare(b.label)));
        console.log(interests);
    }
    
    const interestLabels = [];
    interests.forEach(interest => {
        interestLabels.push(<div interest={interest}>{interest}<button className='deleteInterest' onClick={e => removeInterest(e)}>x</button></div>);
    })

    return (
        <div>
            {/* <form onSubmit={handleSubmit} encType='multipart/form-data'> */}
            {/* <form onSubmit={handleSubmit}> */}
                <div>
                    <label >Name</label>
                    <input type='text' require='true' onChange={e => setName(e.target.value)}></input>
                </div>
                <div>
                    <label>Email Address</label>
                    <input type='text' require='true' onChange={e => setEmail(e.target.value)}></input>
                </div>
                <div>
                    <label>Password</label>
                    <input type='password' require='true' onChange={e => setPassword(e.target.value)}></input>
                </div>
                <div>
                    <label>Zipcode</label>
                    <input type='text' require='true' onChange={e => setZipcode(e.target.value)}></input>
                </div>
                {/* <div>
                    <label>Photos</label>
                    <div style={{display: 'grid', gridTemplate: '1fr 1fr 1fr', textAlign: 'center'}}>
                        {imageSelector}
                    </div>
                </div> */}
                <div>
                    <ImageUpload email={email} ref={imageUploadRef} updateImageCount={updateImageCount} imageCount={imageCount}/>
                </div>
                <div>
                    <label>Interests</label>
                    <Select
                        placeholder=''
                        options={activities}
                        onChange={opt => {
                            const tempInt = new Set(interests);
                            let tempAct = activities.slice();
                            tempInt.add(opt.value);
                            tempAct = tempAct.filter(act => act.label !== opt.value);
                            setInterests(tempInt);
                            setActivities(tempAct);
                            console.log(interests);
                        }}
                    />
                    <div id='interestBox'>
                        {interestLabels}
                    </div>
                </div>
                
                <div>
                    <label>Tell us more about yourself</label>
                    <br></br>
                    <input type='text' placeholder='Favorite outdoor memories
                    What are you looking for?' onChange={e => setBio(e.target.value)} style={{height: '150px', width: '250px', textAlign: 'top'}}>
                    </input>
                </div>
                {/* <button className='btn' type='submit'>Create Account</button> */}
                <button className='btn' onClick={handleSubmit}>Create Account</button>
            {/* </form> */}
        </div>
    )
}

export default Signup;