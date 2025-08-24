import UserLayout from '@/layouts/userLayouts'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import s from './login.module.css'
import { loginUser, registerUser } from '@/config/redux/action/authAction'
import { emptyMessage } from '@/config/redux/reducer/authReducer'

const LoginComponent = () => {

  const [userLoginMethod, setuserLoginMethod] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')


  const authState = useSelector((state) => state.auth)
  const router = useRouter()
  const dispatch = useDispatch()


  useEffect(() => {
    if(localStorage.getItem('token')){
      router.push('/dashboard')
    }
  }, [])
  

  useEffect(() => {
    if (authState.loggedIn && localStorage.getItem('token')) {
      router.push('/dashboard')
    }
  }, [authState.loggedIn])

  // Auto-switch to login mode after successful registration
  useEffect(() => {
    if (authState.isSuccess && !authState.loggedIn) {
      setuserLoginMethod(true)
    }
  }, [authState.loggedIn])


  useEffect(() => {
    dispatch(emptyMessage())
  }, [userLoginMethod])

  const [required, setRequired] = useState(false)
  const handleRegister = (event) => {
    if(username === '' || password === '' || email === '' || name === ''){
      setRequired(true)
    }else{
      setRequired(false)
      dispatch(registerUser({ username, password, email, name }))
    }
  }

  const handleLogin = (event)=>{
    dispatch(loginUser({email, password}))
  }

  return (
    <UserLayout>

      <div className={s.container}>
        <div className={s.cardContainer}>
          <div className={s.cardContainer__left}>

            <p className={s.cardLeft__heading}>{userLoginMethod ? "Sign in" : "Sign up"}</p>
            <p style={{ color: authState.isError ? 'red' : 'green' }}>{authState.message.message}</p>
            {required && <p style={{color:'red'}}>All fields are required!</p>}
            <div className={s.inputContainer}>
              {!userLoginMethod && <div className={s.inputRow}>
                <input onChange={(e) => setUsername(e.target.value)} className={s.inputField} type="text" placeholder='Username' />
                <input onChange={(e) => setName(e.target.value)} className={s.inputField} type="text" placeholder='Name' />
              </div>}
              <input onChange={(e) => setEmail(e.target.value)} className={s.inputField} type="email" placeholder='Email' />
              <input onChange={(e) => setPassword(e.target.value)} className={s.inputField} type="password" placeholder='Password' />
              <button onClick={() => {
                if (userLoginMethod) {
                  handleLogin()
                } else {
                  handleRegister()
                }
              }} className={s.buttonWithOutline}>{userLoginMethod ? "Sign in" : "Sign up"}</button>
            </div>
          </div>
          <div className={s.cardContainer__right}>

            <p className={s.rightPara}>{!userLoginMethod ? "Already have an account" : "Don't have an account"}</p>
            <button className={s.toggleButton} onClick={() => {
              setuserLoginMethod(!userLoginMethod)
              setRequired(false)
            }}>{!userLoginMethod ? `Signin` : `Signup`}</button>

          </div>

        </div>
      </div>

    </UserLayout>
  )
}

export default LoginComponent