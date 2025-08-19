import { BASE_URL, clientServer } from '@/config'
import DashboardLayout from '@/layouts/dashboardLayout'
import UserLayout from '@/layouts/userLayouts'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import s from './viewProfile.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts } from '@/config/redux/action/postAction'
import { getConnectionsRequest, sendConnectionRequest } from '@/config/redux/action/authAction'

export default function ViewProfilePage({ userProfile }) {


    const router = useRouter()
    const postState = useSelector((state) => state.post)
    const dispatch = useDispatch()
    const authState = useSelector((state) => state.auth)
    const searchParams = useSearchParams()



    const [userPost, setUserPost] = useState([])
    const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false)
    const [isConnectionNull, setIsConnectionNull] = useState(true)


    const getUserPost = async () => {
        await dispatch(getAllPosts())
        await dispatch(getConnectionsRequest({ token: localStorage.getItem('token') }))
    }



    useEffect(() => {
        let post = postState.posts.filter((post) => {
            return post.userId.username === router.query.username
        })
        setUserPost(post)

    }, [postState.posts])



    useEffect(() => {
        if (!userProfile || !userProfile.userId) return

        // In ConnectionRequest, userId = sender (current user), connectionId = receiver (profile user)
        // We fetched connections that the current user SENT, so match by connectionId
        if (Array.isArray(authState.connections) && authState.connections.length > 0) {
            const connection = authState.connections.find((conn) => {
                const receiverId = String(conn.connectionId)
                const viewedProfileId = String(userProfile.userId._id)
                return receiverId === viewedProfileId
            })

            if (connection) {
                setIsCurrentUserInConnection(true)
                if (connection.statusAccepted === true) {
                    setIsConnectionNull(false)
                }
            }
        }
    }, [authState.connections, userProfile])





    useEffect(() => {
        getUserPost()
    }, [])






    if (!userProfile) {
        return (
            <UserLayout>
                <DashboardLayout>
                    <div className={s.container}>
                        <div className={s.profileContainer__details}>
                            <p>Profile not found.</p>
                        </div>
                    </div>
                </DashboardLayout>
            </UserLayout>
        )
    }

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={s.container}>
                    <div className={s.backdropContainer}>
                        <img className={s.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="user profile picture" />
                    </div>


                    <div className={s.profileContainer__details}>
                        <div style={{ display: 'flex', gap: '.7rem' }}>

                            <div style={{ flex: '.8' }}>

                                <div style={{ display: 'flex', width: 'fit-content', alignItems: 'center', gap: '1.2rem' }}>
                                    <h2>{userProfile.userId.name}</h2>
                                    <p style={{ color: 'grey' }}>{userProfile.userId.username}</p>

                                </div>

                                <div style={{ display: 'flex', alignItems:'center', gap:'1rem'}}>
                                    {
                                        isCurrentUserInConnection ?
                                            <button className={s.connectedBtn}>{isConnectionNull ? "Pending" : "Connected"}</button>
                                            :
                                            <button className={s.connectBtn} onClick={async () => {
                                                console.log('connected.')
                                                console.log(authState.connections, userProfile.userId._id)
                                                await dispatch(sendConnectionRequest({ token: localStorage.getItem('token'), connectionId: userProfile.userId._id }))
                                                await dispatch(getConnectionsRequest({ token: localStorage.getItem('token') }))
                                            }}>
                                                Connect
                                            </button>
                                    }

                                    <div onClick={async () =>{
                                        const response = await clientServer.get(`/user/download_profile?id=${userProfile.userId._id}`)
                                        window.open(`${BASE_URL}/${response.data.message}`, '_blank')
                                    }}>
                                        <svg style={{ width: '1.2rem', cursor:'pointer', paddingBlock:'1rem'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>

                                    </div>
                                </div>

                                <div>
                                    <p>{userProfile.bio}</p>
                                </div>



                            </div>



                            <div style={{ flex: '.2' }}>
                                <h3>Recent Activity</h3>
                                {
                                    userPost.map((post) => {
                                        return (
                                            <div key={post._id} className={s.postCard}>
                                                <div className={s.card}>
                                                    <div className={s.card__profileContainer}>
                                                        {
                                                            post.media !== "" ?
                                                                <img src={`${BASE_URL}/${post.media}`}></img>
                                                                : <div style={{ width: '3.4rem', height: '3.4rem' }}></div>
                                                        }
                                                    </div>
                                                    <p>{post.body}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>




                        </div>
                    </div>


                    <div className="workHistory">
                        <h4>Work History</h4>

                        <div className={s.workHistoryContainer}>
                            {
                                userProfile.pastWork.map((work, index) => {
                                    return (
                                        <div key={index} className={s.workHistoryCard}>
                                            <p style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '.8rem' }}>{work.company} - {work.position}</p>
                                            <p>{work.years}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                </div>
            </DashboardLayout>
        </UserLayout>
    )
}



// There are several problems in the code:
// 1. The function should be named `getServerSideProps` (Next.js convention), not `serverSideProps`.
// 2. The function should return an object with a `props` key, otherwise Next.js will throw an error.
// 3. The axios `get` call returns a promise; you should `await` the promise, not `request.data`.
// 4. The endpoint in your backend is `/user/profile_based_on_username`, not `/user/get_profile_based_on_username`.
// 5. You should access the data from the response as `response.data` after awaiting the request.
// 6. You should not use `console.log` for production code in SSR functions, but it's okay for debugging.

export async function getServerSideProps(context) {
    // For debugging
    console.log('From view');
    console.log(context.query.username);

    try {
        const response = await clientServer.get('/user/profile_based_on_username', {
            params: {
                username: context.query.username
            }
        });
        return {
            props: {
                userProfile: response.data.Profile || null,
            }
        };
    } catch (error) {
        // Handle error, maybe return notFound or an error prop
        return {
            props: {
                userProfile: null,
                error: error.message || 'Failed to fetch profile'
            }
        };
    }
}



