import { acceptConnection, getAboutUser, getMyConnectionRequests } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layouts/dashboardLayout'
import UserLayout from '@/layouts/userLayouts'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import s from './my_connections.module.css'
import { BASE_URL } from '@/config'
import { useRouter } from 'next/router'

const MyConnections = () => {
  // javaScript


  const router = useRouter()
  const dispatch = useDispatch()
  const authState = useSelector((state) => state.auth)



  useEffect(() => {
    dispatch(getMyConnectionRequests({token: localStorage.getItem('token')}))
    dispatch(getAboutUser({token: localStorage.getItem('token')}))
  }, [])
  

  useEffect(() => {
    if(authState.connectionRequest.length > 0){
    }
  }, [authState.connectionRequest])









// -----------------------JSX-------------------
  return (
    <UserLayout>
        <DashboardLayout>
          <div className={s.myConnections__container}>
          <h4 style={{alignSelf:'flex-start'}}>Myconnections</h4>
              
            {
              authState.connectionRequest.length === 0 &&
                <h2>No connection request pending.</h2>
            }




            

            {
              authState.connectionRequest.length > 0 && authState.connectionRequest.filter(connection => connection.connectionId._id === authState.profileUserId)
              .filter((connection) => connection.statusAccepted === null).map((user, index) =>{
                return (
                  <div onClick={() =>{
                    router.push(`view_profile/${user.userId.username}`)
                  }} className={s.userCard} key={index}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1.2rem'}}>
                      
                      
                      <div className={s.profilePicture}>
                        <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="user profile picture" />
                      </div>

                      <div className={s.userInfo}>
                      <p className={s.cardName}>{user.userId.name}</p>
                      <p className={s.cardUsername}>{user.userId.username}</p>
                      </div>

                      <button onClick={(e) =>{
                        e.stopPropagation()
                        dispatch(acceptConnection({
                          token: localStorage.getItem('token'),
                          requestId: user._id,
                          actionType: "accept"
                        }))
                      }} className={s.acceptBtn}>Accept</button>

                    </div>  
                  </div>
                );
              })
            }
      


            {/* This is the profile whom I got the request */}
            <h4 style={{alignSelf:'flex-start'}}>My Network</h4>
            {
              authState.connectionRequest.length > 0 && authState.connectionRequest.filter(connection => connection.userId._id === authState.profileUserId)
              .filter((connection) => connection.statusAccepted !== null).map((user, index) =>{
                return (
                  <div onClick={() =>{
                    router.push(`view_profile/${user.connectionId.username}`)
                  }} className={s.userCard} key={index}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1.2rem'}}>
                      
                      
                      <div className={s.profilePicture}>
                        <img src={`${BASE_URL}/${user.connectionId.profilePicture}`} alt="user profile picture" />
                      </div>

                      <div className={s.userInfo}>
                      <p className={s.cardName}>{user.connectionId.name}</p>
                      <p className={s.cardUsername}>{user.connectionId.username}</p>
                      </div>
                    </div>  
                  </div>
                );
              })
            }


            {/* This is the profile whom I send the request */}
            {
              authState.connectionRequest.length > 0 && authState.connectionRequest.filter(connection => connection.connectionId._id === authState.profileUserId)
              .filter((connection) => connection.statusAccepted !== null).map((user, index) =>{
                return (
                  <div onClick={() =>{
                    router.push(`view_profile/${user.userId.username}`)
                  }} className={s.userCard} key={index}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1.2rem'}}>
                      
                      
                      <div className={s.profilePicture}>
                        <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="user profile picture" />
                      </div>

                      <div className={s.userInfo}>
                      <p className={s.cardName}>{user.userId.name}</p>
                      <p className={s.cardUsername}>{user.userId.username}</p>
                      </div>
                    </div>  
                  </div>
                );
              })
            }
            </div>
        </DashboardLayout>
    </UserLayout>
  )
}

export default MyConnections