import React from 'react';

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      registerName: '',
      registerEmail: '',
      registerPassword: '',
    };
  }

  onNameChange = (event) => {
    this.setState({ registerName: event.target.value });
  };
  onEmailChange = (event) => {
    this.setState({ registerEmail: event.target.value });
  };
  onPasswordChange = (event) => {
    this.setState({ registerPassword: event.target.value });
  };

  onRegisterSubmit = () => {
    fetch('http://localhost:3000/register', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: this.state.registerName,
        email: this.state.registerEmail,
        password: this.state.registerPassword,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user) {
          console.log('Response', user);
          this.props.getUser(user);
          this.props.onRouteChange('home');
        } else {
          alert('Please enter the required fields');
        }
      });
  };

  render() {
    return (
      <article className='br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center'>
        <main className='pa4 black-80'>
          <div className='measure'>
            <fieldset id='sign_up' className='ba b--transparent ph0 mh0'>
              <legend className='f1 fw7 ph0 mh0'>Register</legend>
              <div className='mt3'>
                <label className='db fw8 lh-copy f5' htmlFor='name'>
                  Name
                </label>
                <input
                  className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                  type='text'
                  name='name'
                  id='name'
                  onChange={this.onNameChange}
                />
              </div>
              <div className='mt3'>
                <label className='db fw8 lh-copy f5' htmlFor='email-address'>
                  Email
                </label>
                <input
                  className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                  type='email'
                  name='email-address'
                  id='email-address'
                  onChange={this.onEmailChange}
                />
              </div>
              <div className='mv3'>
                <label className='db fw8 lh-copy f8' htmlFor='password'>
                  Password
                </label>
                <input
                  className='b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                  type='password'
                  name='password'
                  id='password'
                  onChange={this.onPasswordChange}
                />
              </div>
            </fieldset>
            <div className=''>
              <input
                onClick={this.onRegisterSubmit}
                className='b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 fw7 dib'
                type='submit'
                value='Register'
              />
            </div>
          </div>
        </main>
      </article>
    );
  }
}
export default Register;
