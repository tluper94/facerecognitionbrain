import React, { Component } from 'react';
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
      value: 130,
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

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    };
  }

  calculateFaceLocation = (data) => {
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

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch((err) => console.log('Error'));
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false });
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, box, route, imageUrl } = this.state;
    const { onRouteChange, onInputChange, onSubmit } = this;
    return (
      <div className='App'>
        <Particles className='particles' params={particleOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={onInputChange} onSubmit={onSubmit} />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === 'signin' ? (
          <Signin onRouteChange={onRouteChange} />
        ) : route === 'register' ? (
          <Register onRouteChange={onRouteChange} />
        ) : (
          <Signin onRouteChange={onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
