import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from 'react-router';

function ImageUpload() {
  const [cookies, setCookie] = useCookies();
  const [images, setImages] = useState();
  const [email, setEmail] = useState();
  const [imageCount, setImageCount] = useState();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [ files, setFiles ] = useState([]);
  const [ previewImg, setPreviewImg ] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  // console.log("cookies email", cookies.currentEmail);
  // console.log('cookies imageCount', cookies.imageCount);
  // if (location.state) console.log('location state imageCount: ', location.state.imageCount);
  // console.log("location state", location.state.email);

  

  const showImg = async () => {
    try {
      const data = await fetch(`http://localhost:8080/api/getImages`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              },
      });
      const json = await data.json();
      const images = [];
      json.forEach(image => {
        images.push(<img src={image.image}></img>)
      })
      setImages(images);
    }
    catch (err) {
      return err;
    }
  }

    // handle drag events
    const handleDrag = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    };

    // triggers when file is dropped
    const handleDrop = function(e, imageCount) {
      console.log('checkImageCount: ', imageCount);
      if (imageCount >= 6) {
        return alert('You\'ve reached the maximum number of files');
      }
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      // if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      //   const temp = files.slice();
      //   temp.push(e.dataTransfer.files[0]);
      //   setFiles(temp);
      //   console.log(files);
      // }
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const temp = {...previewImg};
        // console.log('length Temp Keys + 1: ', Object.keys(temp).length+1);
        const newFiles = e.dataTransfer.files;
        for (let i = 0; i < newFiles.length; i++) {
          // if (Object.keys(temp).length+1 > 6) break;
          if (imageCount + 1 > 6) {console.log('drag break: ', imageCount + 1); break;}
          temp[Object.keys(temp).length+1] = newFiles[i];
          imageCount += 1;
          console.log('imageCount: ', imageCount);
        }
        // temp[Object.keys(temp).length+1] = e.dataTransfer.files[0];
        setPreviewImg(temp);
        setFiles(Object.values(temp)); 
        setImageCount(imageCount);
        // console.log('files: ', files);
        // console.log('files length: ', files.length);
        // console.log(previewImg);
        // console.log(files);
      }
    };

    // triggers when file is selected with click
    const handleChange = function(e, imageCount) {
      
      e.preventDefault();
      if (imageCount >= 6) {
        return alert('You\'ve reached the maximum number of files');
      }
  
      if (e.target.files && e.target.files[0]) {
        const temp = {...previewImg};
        // console.log('length Temp Keys + 1: ', Object.keys(temp).length+1);
        const newFiles = e.target.files;
        for (let i = 0; i < newFiles.length; i++) {
          if (imageCount> 6) break;
          temp[Object.keys(temp).length+1] = newFiles[i];
          imageCount += 1;
          console.log('imageCount: ', imageCount);
        }
        setPreviewImg(temp);
        setFiles(Object.values(temp)); 
        setImageCount(imageCount);
        // console.log('files: ', files);
        // console.log('files length: ', files.length);
        // console.log(previewImg);
        // console.log(files);
      }
    };

    // triggers the input when the button is clicked
    const onButtonClick = () => {
      inputRef.current.click();
    };

    // handle file upload
    const handleFileUpload = async (e, email, imageCount) => {
      e.preventDefault();
      // console.log('inside upload', files);
      console.log('email state', email);
      console.log('imageCount state: ', imageCount);
      const formData = new FormData();
      files.forEach(file => {
        formData.append('image', file);
      });
      // for (var pair of formData.entries()) {
      //   console.log(pair[0]+ ' - ' + pair[1]); 
      // }
      try {
        await fetch(`/api/upload-file-to-cloud-storage/${email}`, {
        // await fetch(`/api/upload-file-to-cloud-storage/shiyu0811liu@gmail.com`, {
              method  : 'POST',
              // headers: {
              //   'Content-Type': 'multipart/form-data'
              // },
              body: formData
            }
        )
        console.log('upload success');
        await fetch('/api/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ imageCount} )
            })
        console.log('imageCount updated');
        navigate('/dashboard');
      }
      catch (err) {
        console.log(err);
        return alert('Issue uploading your images. Please try again later.');
      }
    }
  
  //removes image when 'x' is clicked on image preview, updates imageCount state
  const removeImage = (e, imageCount) => {
    let index = e.target.parentElement.getAttribute('image_index');
    const imageObj = {...previewImg};
    delete imageObj[index];
    setPreviewImg(imageObj);
    setFiles(Object.values(previewImg)); 
    setImageCount(--imageCount);
    // console.log(files);
  }

  const preview = [];
  // files.forEach(file => {
  //   console.log(file);
  //   preview.push(<div><img className='image_preview' src={URL.createObjectURL(file)}/><button className='deleteImage'>x</button></div>)
  // })
  for (const key in previewImg) {
    preview.push(<div image_index={key} style={{overflow: 'hidden', width:'300px', height: '300px'}}><img className='image_preview' src={URL.createObjectURL(previewImg[key])}/><button className='deleteImage' onClick={e => removeImage(e, imageCount)}>x</button></div>)
  }
  // Object.values(previewImg).forEach((file) => {
  //   console.log(file);
  //   preview.push(<div><img className='image_preview' src={URL.createObjectURL(file)}/><button className='deleteImage'>x</button></div>)
  // })

  //update state with email and imageCount from cookies (loggin in user) or location state (newly signed up user)
  useEffect(() => {
    if (!location.state) {
      setEmail(cookies.currentEmail);
      setImageCount(parseInt(cookies.imageCount));
      // console.log('stateImageCount from cookies', imageCount);
    }
    else {
      setEmail(location.state.email);
      setImageCount(parseInt(location.state.imageCount));
      // console.log('stateImageCount from location', imageCount);
    }
  }, [cookies, location.state]);

  return (
    <div style={{width: '80%', height:'100%', margin: 'auto', textAlign:'center'}}>
      <h3>Share Your Favorite Moments from Outdoor Adventures!</h3>
      <form style={{height: '250px', margin:'5%'}} encType='multipart/form-data' onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input ref={inputRef} type='file' id='input-file-upload' name='image' accept='image/*' multiple={true} onChange={(e) => handleChange(e, imageCount)}/>
        <label id='label-file-upload' htmlFor='input-file-upload' className={dragActive ? 'drag-active' : '' }>
          <div>
            <p>Drag and drop your file here or</p>
            <button className='upload-button' onClick={onButtonClick}>Upload a file</button>
          </div> 
        </label>
        {/* <button type='submit' className='profile-order-button'>
          Upload
        </button> */}
        { dragActive && <div id='drag-file-element' onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={(e) => handleDrop(e, imageCount)}></div> }
       </form>
       <div style={{marginBottom: '3%'}}>
        <button className='btn' onClick={e => handleFileUpload(e, email, imageCount)} id='image_upload'>Upload</button>
       </div>
       <div id='preview_container' style={{width:'80%', margin:'auto', display:'grid', gridTemplateColumns: 'repeat(2, 1fr)'}}>
        {preview}
       </div>
       <div>
        <label>{preview.length}/6 Images Selected</label>
       </div>
    </div>
  );
}

export default ImageUpload;