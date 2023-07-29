import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from 'react-router';

const ImageUpload = forwardRef((props, ref) => {
  const [cookies, setCookie] = useCookies();
  const [images, setImages] = useState();
  const [email, setEmail] = useState();
  const [imageCount, setImageCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [ files, setFiles ] = useState([]);
  const [ previewImg, setPreviewImg ] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentEmailFromCookies = cookies.currentEmail;
    if (currentEmailFromCookies) {
      console.log('cookies')
      setEmail(currentEmailFromCookies);
      setImageCount(parseInt(cookies.imageCount));
    }
  }, []);

  useEffect(() => {
    // If props.email or props.imageCount changes, update states
    console.log('email or imageCount is changing')
    if (!props.email || !props.imageCount) return;
    setEmail(props.email);
    setImageCount(props.imageCount);
  }, [props.email, props.imageCount]);

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