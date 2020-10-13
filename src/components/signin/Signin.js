import React, { useState} from 'react';

//Signin component
const Signin = ({ onRouteChange, getUser, route }) => {
  const [email, setEmail] = useState(''); // Stores email state
  const [password, setPassword] = useState(''); // Stores Password state

  // Sets email state based on user input
  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };

  //set password state based on user input
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Submits users email and password to backend for validation
  const onSubmitSignIn = () => {
    fetch('http://localhost:3000/signin', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.id) {
          console.log(user.id)
          getUser(user);
          onRouteChange('home');
        } else {
          alert('Incorrect Email or Password');
        }
      });
  };
  return (
    <article className='br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center'>
      <main className='pa4 black-80'>
        <div className='measure'>
          <fieldset id='sign_up' className='ba b--transparent ph0 mh0'>
            <legend className='f1 fw7 ph0 mh0'>Sign In</legend>
            <div className='mt3'>
              <label className='db fw8 lh-copy f5' htmlFor='email-address'>
                Email
              </label>
              <input
                onChange={onEmailChange}
                className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                type='email'
                name='email-address'
                id='email-address'
              />
            </div>
            <div className='mv3'>
              <label className='db fw8 lh-copy f8' htmlFor='password'>
                Password
              </label>
              <input
                onChange={onPasswordChange}
                className='b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                type='password'
                name='password'
                id='password'
              />
            </div>
          </fieldset>
          <div className=''>
            <input
              onClick={onSubmitSignIn}
              className='b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 fw7 dib'
              type='submit'
              value='Sign in'
            />
          </div>
          <div className='lh-copy mt3'>
            <p
              onClick={() => onRouteChange('register')}
              href='#0'
              className='f6 fw6 pointer link dim black db'
            >
              Register
            </p>
          </div>
        </div>
      </main>
    </article>
  );
};
export default Signin;
