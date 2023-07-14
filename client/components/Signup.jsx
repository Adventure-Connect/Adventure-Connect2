
import React, { useState } from 'react';
import Select from 'react-select';

const activities = [
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

const createUser = async (info) => {
    try {
        fetch('http://localhost:8080/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(info)
        })
        return;
    }
    catch (err) {
        alert(`An error has occurred! ${err.message}`);
        return err;
    }

}

const Signup = () => {
    const [ interestLabels, setInterestLabels ] = useState([]);
    const [ interests, setInterests ] = useState([]);
    // const [ activities, setActivities ] = useState(activities);
    const [ name, setName ] = useState();
    const [ email, setEmail ] = useState();
    const [ password, setPassword ] = useState();
    const [ zipcode, setZipcode ] = useState();
    const [ bio, setBio ] = useState();
    const [ images, setImages ] = useState([]);
    const [ imageData, setImageData ] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            createUser({
                name: name,
                email: email,
                password: password,
                zipCode: zipcode,
                interests: interests,
                bio: bio,
            })
        }
        catch (err) {
            return err;
        }
    }

    const imageSelector = [];
    for (let i = 0; i < 1; i++) {
        imageSelector.push(
            <div>
                <input type='file' name={`image${i}`} id={`image${i}`} key={`image${i}`} accept='image/*' style={{display: 'none'}}></input>
                <label htmlFor={`image${i}`} style={{color: 'lightgray', border: 'dashed', width:'90px', height: '90px', fontSize: '72px'}}>+</label>
            </div>
        )
    }

    return (
        <div>
            {/* <form onSubmit={handleSubmit} encType='multipart/form-data'> */}
            <form action='/api/signup/upload_images' method='post' encType='multipart/form-data' onSubmit={handleSubmit}>
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
                <div>
                    <label>Photos</label>
                    <div style={{display: 'grid', gridTemplate: '1fr 1fr 1fr', textAlign: 'center'}}>
                        {imageSelector}
                    </div>
                </div>
                <div>
                    <label>Interests</label>
                    <Select
                        options={activities}
                        onChange={opt => {
                            const temp = interestLabels.slice();
                            const interestsTemp = interests.slice();
                            temp.push(<label key={opt.value.toLowerCase()}>{opt.value}</label>);
                            interestsTemp.push(opt.value);
                            interestsTemp.push(opt.value)
                            setInterestLabels(temp);
                            setInterests(interestsTemp);
                            form.set(interests, interests);
                            console.log(interests);
                        }}
                    />
                    <div id='interestBox'>{interestLabels}</div>
                </div>
                <div>
                    <label>Tell us more about yourself</label>
                    <br></br>
                    <input type='text' placeholder='Favorite outdoor memories
                    What are you looking for?' onChange={e => setBio(e.target.value)} style={{height: '150px', width: '250px', textAlign: 'top'}}></input>
                </div>
                <button type='submit'>Create Account</button>
            </form>
        </div>
    )
}

export default Signup;