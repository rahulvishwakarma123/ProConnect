import React from 'react'
import s from './navbar.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { reset } from '@/config/redux/reducer/authReducer'

const NavbarComponent = () => {

    const router = useRouter()

    const dispatch = useDispatch()

    const authState = useSelector((state) => state.auth)

    return (
        <div className={s.container}>
            <div className={s.navbar}>

                <h2 style={{ cursor: 'pointer' }} onClick={() => {
                    router.push('/')
                }}>Pro Connect</h2>

                {authState.profileFetched && <div className={s.nav__greets}>
                    {/* <p>Hey! {authState.user.userId.name}</p> */}
                    <p onClick={() =>{
                        router.push('/profile')
                    }} className={s.nav__profile}>Profile</p>
                    <p onClick={() =>{
                        localStorage.removeItem('token')
                        router.push('/login')
                        dispatch(reset())
                    }} className={s.nav__profile}>Logout</p>
                </div>}


                {!authState.profileFetched && <div className={s.navbarOptionContainer}>
                    <div onClick={() => {
                        router.push('/login')
                    }} className={s.buttonJoin}>
                        Be a part
                    </div>
                </div>}


            </div>
        </div>
    )
}

export default NavbarComponent