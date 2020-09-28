import React from 'react';
import Tilt from 'react-tilt';
import brain from './icons8-brain-100.png';
import './logo.css';

const Logo = () => {
  //test
  return (
    <div className='ma4 mt0'>
      <Tilt
        className='Tilt br4 shadow-2 '
        options={{ max: 35 }}
        style={{ height: 150, width: 150 }}
      >
        <div className='Tilt-inner pa3'>
          <img style={{ paddingTop: '5px' }} alt='brain' src={brain}></img>
        </div>
      </Tilt>
    </div>
  );
};
export default Logo;
