import { BASE_URL } from '@/config';
import { getAllUsers } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layouts/dashboardLayout';
import UserLayout from '@/layouts/userLayouts';
import React, { useEffect } from 'react'
import s from './discover.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const DiscoverPage = () => {

  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const router = useRouter()


  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers())
    }
  }, [])



  return (
    <UserLayout>
      <DashboardLayout>
        <p className={s.discoverHeading}>Discover</p>
        <div className={s.allUserProfile}>
          {authState.all_profiles_fetched && authState.all_users.map((user) => {
            return (
              <div onClick={() => {
                router.push(`view_profile/${user.userId.username}`)
              }} key={user.userId._id} className={s.userCard}>
                <img className={s.userCardImage} src={`${BASE_URL}/${user.userId.profilePicture}`} alt="Profile Picture" />
                <div>
                  <p className={s.cardName}>{user.userId.name}</p>
                  <p className={s.cardUsername}>{user.userId.username}</p>
                </div>
              </div>
            )
          })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default DiscoverPage