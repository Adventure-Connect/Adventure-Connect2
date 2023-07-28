import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import Select from 'react-select';
import ImageUpload from './ImageUpload';
import '../styles/Signup.css';


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
        if (!name || !email || !password || !zipcode || !bio) {
            alert('Please fill out all required fields');
            return;
        }
        if (zipcode.length !== 5) {
            alert('Please enter a valid zipcode');
            return;
        }
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
                imageUploadRef.current.handleFileUpload(e, email);
            }
            navigate('/dashboard', {state:{email: email}});
            return;
        }
        catch (err) {
            alert(`An error has occurred! ${err.message}`);
            return err;
        };
        
    }

    //button to remove interest from selected list
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
    
    //rotating colors for the background of the interest labels
    const rotatingColors = ['#877767', '#b98d5c', '#2c2b27', '#a09487', '#c7a57e', '#595855'];
    let colorIndex = 0;
    
    //push selected interests into interestLabels array to display, applying background color
    const interestLabels = [];
    interests.forEach((interest, index) => {
        const bgColor = rotatingColors[colorIndex % rotatingColors.length];
        const labelStyle = { backgroundColor: bgColor };
        interestLabels.push(
            <div className="interest-label" key={index} interest={interest} style={labelStyle}>
                {interest}
                <button className='deleteInterest' key={index} onClick={e => removeInterest(e)}>x</button>
            </div>);
        colorIndex++;
    })

    return (
        <div className="signup-container">
                <div className="form-group">
                    <label className="form-label" >Name</label>
                    <input className="form-input" type='text' required='true' onChange={e => setName(e.target.value)}></input>
                </div>
                <div className="form-group">
                    <label className="form-label" >Email Address</label>
                    <input className="form-input" type='email' required='true' onChange={e => setEmail(e.target.value)}></input>
                </div>
                <div className="form-group">
                    <label className="form-label" >Password</label>
                    <input className="form-input" type='password' required='true' onChange={e => setPassword(e.target.value)}></input>
                </div>
                <div className="form-group">
                    <label className="form-label" >Zipcode</label>
                    <input className="form-input" type='text' required='true' onChange={e => setZipcode(e.target.value)}></input>
                </div>
                <div>
                    <ImageUpload ref={imageUploadRef}/>
                </div>
                <div className="form-group">
                    <label className="form-label" >Interests</label>
                    <Select
                        className="select-input"
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
                
                <div className="form-group">
                    <label className="form-label">Tell us more about yourself</label>
                    <br></br>
                    <input className="form-input" type='text' placeholder='Favorite outdoor memories
                    What are you looking for?' onChange={e => setBio(e.target.value)} style={{height: '20vh', width: '30vw', textAlign: 'top'}}>
                    </input>
                </div>
                {/* <button className='btn' type='submit'>Create Account</button> */}
                <button className='btn btn-primary' onClick={handleSubmit}>Create Account</button>
            {/* </form> */}
        </div>
    )
}

export default Signup;