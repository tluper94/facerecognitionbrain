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

const app = new Clarifai.App({
  apiKey: '4a863d5a12c547b0b5a7514674726bd7',
});

const App = () => {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('');
  const [isSignedIn, setIsSignedIn] = useState('');
  const [user, setUser] = useState({});

  const calculateFaceLocation = (data) => {
    const clarifiaFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifiaFace.left_col * width,
      topRow: clarifiaFace.top_row * height,
      rightCol: width - clarifiaFace.right_col * width,
      bottomRow: height - clarifiaFace.bottom_row * height,
    };
  };

  const displayFaceBox = (box) => {
    setBox(box);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onSubmit = () => {
    setImageUrl(input);
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, input)
      .then((response) => {
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
              console.log(count);
              setUser({ ...user, entries: count });
            });
        }
        displayFaceBox(calculateFaceLocation(response));
      })
      .catch((err) => console.log('Error', err));
  };

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false);
      setImageUrl('');
      setBox({});
    } else if (route === 'home') {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  const getUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
    console.log('App', data);
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
