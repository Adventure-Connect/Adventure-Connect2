import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from 'react-router';
import "../styles/ImageUpload2.css";

const ImageUpload2 = forwardRef((props, ref) => {
  const [images, setImages] = useState();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [ files, setFiles ] = useState(null);
  const [ imageCount, setImageCount ] = useState(0);
  

   // handle drag events
   const handleDrag = function(e) {
    console.log('handleDrag activated')
    console.log('dragActive', dragActive)
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function(e, imageCount, index) {
    console.log('handleDrop activated')
    
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {

      const newFile = e.dataTransfer.files[0];
      imageCount += 1;

      setFiles(newFile); 
      setImageCount(imageCount);

      //updates imageCount in parent component if it exists
      if (props.updateImageCount) {
        props.updateImageCount(imageCount);
      }
      //need to update ImageUploadContainer state
    }
  };

  // triggers when file is selected with click
  const handleChange = function(e, imageCount) {
      
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files[0])
      
     const newFile = e.target.files[0];
      imageCount += 1;
  
      setFiles(newFile); 
      setImageCount(imageCount);
      //updates parent component imageCount state if it exists
      if (props.updateImageCount) {
        props.updateImageCount(imageCount);
      }
      //need to update ImageUploadContainer state
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  //removes image when 'x' is clicked on image preview, updates imageCount state
  const removeImage = (e, imageCount) => {
    // let index = e.target.parentElement.getAttribute('image_index');
    // // const imageObj = {...previewImg};
    // const image = files;
    // delete imageObj[index];
    setFiles(null); 
    setImageCount(--imageCount);
    console.log(imageCount);
    //updates imageCount in parent component if it exists
    if (props.updateImageCount) {
      props.updateImageCount(--imageCount);
    }
    //need to update ImageUploadContainer state
  }
  //image_index={key}
  const ImageComponent = files !== null ? (
    <div key={props.id} className="image-wrapper">
      <img className='image-preview' src={URL.createObjectURL(files)}/>
      <button className='deleteImage' onClick={e => removeImage(e, imageCount)}>x</button>
    </div>
  ) : (
    <div key={props.id} className='upload-component'>
         <form encType='multipart/form-data' onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
           <input ref={inputRef} type='file' id='input-file-upload' name='image' accept='image/*' multiple={true} onChange={(e) => handleChange(e, imageCount)}/>
           <label id='label-file-upload' htmlFor='input-file-upload' className={dragActive ? 'drag-active' : '' }>
             <div>
               <p>Drag and drop your file here or</p>
               <button className='upload-button' onClick={onButtonClick}>Upload a file</button>
             </div> 
          </label>
          { dragActive && <div id='drag-file-element' onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={(e) => handleDrop(e, imageCount)}></div> }
          </form>
    </div>
  );

    return (
      ImageComponent
    )
  })

  export default ImageUpload2;