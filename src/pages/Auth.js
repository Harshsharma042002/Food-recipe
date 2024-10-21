import React, { useState } from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useNavigate } from "react-router-dom"
import '../Styles/Auth.css'
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className='auth'>
      {isLogin ? <Login /> : <Register />}
      <div className='toggle-auth'>
        {isLogin ? (
          <>
            <p>Don't have an account? <span onClick={() => setIsLogin(false)}>Register here</span></p>
          </>
        ) : (
          <>
            <p>Already have an account? <span onClick={() => setIsLogin(true)}>Login here</span></p>
          </>
        )}
      </div>
    </div>
  )
}
const Login = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [_, setCookies] = useCookies(["access_token"])
  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });
      setCookies("access_token", response.data.token)
      window.localStorage.setItem("userID", response.data.userID)
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  }
  return <Form username={username} setUserName={setUserName} password={password} setPassword={setPassword} label="Login" onSubmit={onSubmit} />
}

const Register = () => {
  const [username, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
      })
      alert("Registration completed, Now Login")
    } catch (err) {
      console.log(err)
    }
  }
  return <Form username={username} setUserName={setUserName} password={password} setPassword={setPassword} label="Register" onSubmit={onSubmit} />
}
const Form = ({ username, setUserName, password, setPassword, label, onSubmit }) => {
  return (
    <div className='auth-container'>
      <form onSubmit={onSubmit}>
        <h2>{label}</h2>
        <div className='form-group'>
          <label htmlFor='username'>Username:</label>
          <input type='text' id='username' value={username} onChange={(event) => setUserName(event.target.value)} />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input type='password' id='password' value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button type='submit'>{label}</button>
      </form>
    </div>
  )
}
export default Auth
