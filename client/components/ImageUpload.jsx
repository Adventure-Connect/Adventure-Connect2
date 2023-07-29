import React, { useState, useEffect, useRef, forwardRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router";
import ImageUpload2 from "./ImageUpload2";
import "../styles/ImageUpload2.css";

const ImageUpload = forwardRef((props, ref) => {
  const [cookies, setCookie] = useCookies();
  const [images, setImages] = useState();
  const [email, setEmail] = useState();
  const [imageCount, setImageCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [files, setFiles] = useState([null, null, null, null, null, null]);
  const [profilePicture, setProfilePicture] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // update files from child component
  const handleChildFileUpdate = (newFile, index) => {
    const newFiles = [...files];
    newFiles[index] = newFile;
    // console.log('newfile: ', newFile);
    // console.log('parent component new file: ', newFiles);
    setFiles(newFiles);
  };

  // update profile picture index from child component
  const handleProfilePictureUpdate = (newProfileIndex) => {
    // console.log('new Profile Pic Index: ', newProfileIndex);
    setProfilePicture(newProfileIndex);
  };

  //grab email from cookies
  useEffect(() => {
    const currentEmailFromCookies = cookies.currentEmail;
    if (currentEmailFromCookies) {
      // console.log('cookiesEmail: ', currentEmailFromCookies)
      setEmail(currentEmailFromCookies);
      setImageCount(parseInt(cookies.imageCount));

      //if the email is in cookies, get the images from the database
      //create an images array that holds the original images from the database
      //populate files with images from database
      const fetchImages = async () => {
        try {
          const data = await fetch(
            `http://localhost:8080/api/getImages/${currentEmailFromCookies}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const json = await data.json();
          const images = [];
          const imageUrl = [];

          console.log("THIS IS THE JSON", json);

          json.forEach((image, index) => {
            images.push(
              <img src={image.image} key={index} alt={`Image ${index}`}></img>
            );
            imageUrl.push(image.image);
            // console.log('image index: ', index);
            // console.log('image url: ', image.image);
            // console.log('images src: ', images[index].props.src)
          });
          const newFiles = files.map((file, index) => imageUrl[index] || null);
          // console.log('newFiles: ', newFiles)
          // console.log('images: ', images)
          setFiles(newFiles);
          setImages(images);
        } catch (err) {
          return err;
        }
      };
      fetchImages();
    }
  }, []);

  //updates email and imageCount from parent component (can likely remove as email can be passed down in upload function from parent)
  useEffect(() => {
    // If props.email or props.imageCount changes, update states
    // console.log('email or imageCount is changing')
    if (!props.email || !props.imageCount) return;
    setEmail(props.email);
    setImageCount(props.imageCount);
  }, [props.email, props.imageCount]);

  // handle file upload
  const handleFileUpload = async (e, email, imageCount, profilePicture) => {
    e.preventDefault();

    const formData = new FormData();

    const deleteData = [];

    console.log("THIS IS THE FILES", files);

    files.forEach((file, index) => {
      if (typeof file !== "string") {
        formData.append("image", file);
        if (images[index] !== null && images[index] !== undefined) {
          deleteData.push(images[index].props.src);
        }
        //delete images that are no longer in the files array
        const deleted = await fetch(`/api/deleteImage/${email}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({image: deleteData})
        });


        //update image count
        // await fetch('/api/api/user', {
        //         method: 'PUT',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         credentials: 'include',
        //         body: JSON.stringify({ imageCount } )
        //     })
        // console.log('imageCount updated');

        //update profile picture
      //  await fetch('/api/api/user', {
      //     method: 'PUT',
      //     headers: {
      //         'Content-Type': 'application/json'
      //     },
      //     credentials: 'include',
      //     body: JSON.stringify({ profileUrl } )
      // })
        // navigate('/dashboard');
      }
    });

    // console.log(deleteData);

    try {
      const response = await fetch(
        `/api/upload-file-to-cloud-storage/${email}`,
        {
          method: "POST",
          body: formData,
        }
      );
      // Check if the response is successful (status code 200-299)
      if (response.ok) {
        const uploadedImages = await response.json();
        console.log("uploaded images: ", uploadedImages.returnUrls);
        const profileUrl = uploadedImages.returnUrls[profilePicture];
      } else {
        // Handle the error if the response is not successful
        console.log("Error: Could not upload images");
      }
      //delete images that are no longer in the files array
      const deleted = await fetch(`/api/deleteImage/${email}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: deleteData }),
      });

      //update image count
      // await fetch('/api/api/user', {
      //         method: 'PUT',
      //         headers: {
      //             'Content-Type': 'application/json'
      //         },
      //         credentials: 'include',
      //         body: JSON.stringify({ imageCount } )
      //     })
      // console.log('imageCount updated');

      //update profile picture
      // await fetch("/api/api/user", {
      //     method: "PUT",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     credentials: "include",
      //     body: JSON.stringify({ profileUrl }),
      //   });
      // navigate('/dashboard');
    } catch (err) {
      console.log(err);
      return alert("Issue uploading your images. Please try again later.");
    }
  };

  //expose handleFileUpload function to parent component
  React.useImperativeHandle(ref, () => ({
    handleFileUpload,
  }));

  // create six image upload elements with files if they already exist
  const imageUploadElements = files.map((file, index) => {
    return (
      <ImageUpload2
        key={index}
        id={index}
        dragActive={dragActive}
        file={file}
        onFileUpdate={handleChildFileUpdate}
        profilePictureIndex={profilePicture}
        selectProfilePic={handleProfilePictureUpdate}
      />
    );
  });

  return (
    <div className="uploadContainer">
      <h3 id="uploadHeader">Photos</h3>
      <div className="imageContainer">
        {imageUploadElements}
        <div style={{ marginBottom: "3%" }}>
          <button
            className="btn"
            onClick={(e) =>
              handleFileUpload(e, email, imageCount, profilePicture)
            }
            id="image_upload"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
});

//   return (
//     <div style={{width: '80%', height:'100%', margin: 'auto', textAlign:'center'}}>
//       <h3>Share Your Favorite Moments from Outdoor Adventures!</h3>
//       <div>
//       <form style={{height: '250px', margin:'5%'}} encType='multipart/form-data' onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
//         <input ref={inputRef} type='file' id='input-file-upload' name='image' accept='image/*' multiple={true} onChange={(e) => handleChange(e, imageCount)}/>
//         <label id='label-file-upload' htmlFor='input-file-upload' className={dragActive ? 'drag-active' : '' }>
//           <div>
//             <p>Drag and drop your file here or</p>
//             <button className='upload-button' onClick={onButtonClick}>Upload a file</button>
//           </div>
//         </label>
//         { dragActive && <div id='drag-file-element' onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={(e) => handleDrop(e, imageCount)}></div> }
//        </form>
//        <div style={{marginBottom: '3%'}}>
//         <button className='btn' onClick={e => handleFileUpload(e, email, imageCount)} id='image_upload'>Upload</button>
//        </div>
//        </div>
//        <div id='preview_container' style={{width:'80%', margin:'auto', display:'grid', gridTemplateColumns: 'repeat(2, 1fr)'}}>
//         {preview}
//        </div>
//        <div>
//         <label>{preview.length}/6 Images Selected</label>
//        </div>
//     </div>
//   );
// });

export default ImageUpload;
