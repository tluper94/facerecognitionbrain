import React, { useState } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm.js';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

//Sets options for background particles
const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    shape: {
      stroke: {
        width: 4,
        color: '#b63397',
      },
    },
  },
};

//Init clarifia api
const app = new Clarifai.App({
  apiKey: '4a863d5a12c547b0b5a7514674726bd7',
});

const App = () => {
  //States
  const [input, setInput] = useState(''); //User input state
  const [imageUrl, setImageUrl] = useState(''); // Image url state
  const [box, setBox] = useState({}); // Face detection box state
  const [route, setRoute] = useState(''); // Page route state
  const [isSignedIn, setIsSignedIn] = useState(''); // If user is signed in state
  const [user, setUser] = useState({}); // State that stores user info

  //Calculates face detection box
  const calculateFaceLocation = (data) => {
    //Assigns data from Clarifia api to variable
    const clarifiaFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    // Gets image submited by user
    const image = document.getElementById('inputImage');
    // Gets image width
    const width = Number(image.width);
    // Gets image height
    const height = Number(image.height);
    /*Uses data from Clarifia api and image submited from user
    and returns it to the displayFaceBox function */
    return {
      leftCol: clarifiaFace.left_col * width,
      topRow: clarifiaFace.top_row * height,
      rightCol: width - clarifiaFace.right_col * width,
      bottomRow: height - clarifiaFace.bottom_row * height,
    };
  };

  /*Function that recieves dectection box data from calculateFaceLocation
  and set the box state to display box on image*/
  const displayFaceBox = (box) => {
    setBox(box);
  };

  // Set user input url to input state
  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  // Submit user image to clarfia api
  const onSubmit = () => {
    //Sets imageUrl state to user input state
    setImageUrl(input);
    //Submits imageUrl to clarifia api 
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, input)
      .then((response) => {
        //Sends user id to backend to increment user entries everytime user submit an image
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              id: user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              //sets user entries
              setUser({ ...user, entries: count });
            })
            .catch(err => console.log('Error', err))
        }
        /*Send data from clarifia api to calculateFaceLocation function
        to display face detection box on image*/
        displayFaceBox(calculateFaceLocation(response));
      })
      .catch((err) => console.log('Error', err));
  };

  // Handles page routes
  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false);
      setImageUrl('');
      setBox({});
      setUser({});
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  //Gets user info when user signs in or registers
  const getUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };
  return (
    <div className='App'>
      <Particles className='particles' params={particleOptions} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === 'home' ? (
        <div>
          <Logo />
          <Rank user={user} />
          <ImageLinkForm onInputChange={onInputChange} onSubmit={onSubmit} />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      ) : route === 'signin' ? (
        <Signin route={route} getUser={getUser} onRouteChange={onRouteChange} />
      ) : route === 'register' ? (
        <Register route={route} getUser={getUser} onRouteChange={onRouteChange} />
      ) : (
        <Signin route={route} getUser={getUser} onRouteChange={onRouteChange} />
      )}
    </div>
  );
};
export default App;
