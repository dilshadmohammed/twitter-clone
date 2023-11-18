import React , { useEffect, useState } from "react";
import './Login.css'
import axios from './axios';
import {useNavigate} from 'react-router-dom';

function Login() {

  // const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name,SetName] = useState('');
  const [userName,setUserName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] =useState('');
  const [cofmPass,setCofmPass] = useState('');
  const [errMsg,SetErrMsg] = useState('');
  const [showPassword,setShowPassword] = useState(false);
  useEffect(()=>{
    SetErrMsg('');
  },[isSignUp,email,password,cofmPass,userName])

  const handleSignUp = (event) => {
    event.preventDefault();
    if (password === cofmPass) {
      axios
        .post('/sign-up', {
          name,
          username:userName,
          email,
          password,
        })
        .then((response) => {
          if (response.status) {
            console.log('Registration successful');
            localStorage.setItem('user',JSON.stringify(response.data));
            window.location.reload()
          } else {
            console.error('Registration failed:', response.data.message);
            SetErrMsg(response.data.message);
          }
        })
        .catch((error) => {
          console.error('An error occurred during registration:', error.message);
          SetErrMsg('An error occurred during registration');
        });
    } else {
      SetErrMsg('Passwords do not match');
    }
  };
  
  const handleSignIn = (event) => {
    event.preventDefault();
    axios
      .post('/sign-in', {
        email,
        password,
      })
      .then(async (response) => {
        console.log(response.data)
        if (response.status) {
          localStorage.setItem('user',JSON.stringify(response.data));
          window.location.reload()
        } else {
          console.error('Login failed:', response.data.message);
          SetErrMsg(response.data.message);
        }
      })
      .catch((error) => {
        console.error('An error occurred during login:', error.message);
        SetErrMsg('An error occurred during login');
      });
  };

  

  const handlePanelToggle = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="login-page">
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`}>
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignUp} >
          <h1>Create Account</h1><br />
          <input onChange={(e)=>{SetName(e.target.value)}} type="text" placeholder="Name" />
          <input onChange={(e)=>{setUserName(e.target.value)}} type="text" placeholder="user name" />
          <input onChange={(e)=>{setEmail(e.target.value)}}  type="email" placeholder="Email" />
          <input onChange={(e)=>{setPassword(e.target.value)}} type={showPassword?"text":"password"} placeholder="Password" />
          <input onChange={(e)=>{setCofmPass(e.target.value)}} type={showPassword?"text":"password"} placeholder="Confirm" />
          <div className="checkbox">
            <input type="checkbox" checked={showPassword} onChange={()=>{setShowPassword(!showPassword)}} />
            <label htmlFor="signUpCheckbox">Show password</label>
          </div>
          <button type="submit">Sign Up</button>
          <div className="error-message">{errMsg}</div>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={handleSignIn}>
          <h1>SignIn</h1><br />
          <input className="signInEmail" onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="Email" />
          <input className="signInPassword" onChange={(e)=>{setPassword(e.target.value)}} type={showPassword?"text":"password"} placeholder="Password" />
          <div className="checkbox">
            <input type="checkbox" checked={showPassword} onChange={()=>{setShowPassword(!showPassword)}} />
            <label >show password</label>
          </div>
          <button type="submit">Sign In</button>
          <div className="error-message">{errMsg}</div>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn" onClick={handlePanelToggle}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start the journey with us</p>
            <button className="ghost" id="signUp" onClick={handlePanelToggle}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>        
  </div>
  );

}

export default Login
