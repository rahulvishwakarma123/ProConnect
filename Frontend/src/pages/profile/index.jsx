import { getAboutUser } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layouts/dashboardLayout'
import UserLayout from '@/layouts/userLayouts'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import s from './profile.module.css'
import { BASE_URL, clientServer } from '@/config'
import { getAllPosts } from '@/config/redux/action/postAction'

const ProfilePage = () => {

    // ------------------------javaScript--------------------------------
    const dispatch = useDispatch()
    const authState = useSelector((state) => state.auth)
    const postReducer = useSelector((state) => state.post)



    const [isModalOpen, setIsModalOpen] = useState(false)
    const [userProfile, setUserProfile] = useState({})
    const [userPost, setUserPost] = useState([])
    const [companyName, setCompanyName] = useState('')
    const [position, setPosition] = useState('')
    const [experience, setExperience] = useState(0)

    const [workInputData, setWorkInputData] = useState({
        company: '',
        position: '',
        years: 0,
    })

    const handleWork = (e) =>{
        const {name, value} = e.target;
        setWorkInputData({...workInputData, [name]: value})
    }


    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem('token') }))
        dispatch(getAllPosts())
    }, [])


    useEffect(() => {
        setUserProfile(authState.user)

        if (authState.user != undefined) {
            let post = postReducer.posts.filter((post) => {
                return post.userId.username === authState.user.userId.username
            })
            setUserPost(post)
        }

    }, [authState.user, postReducer.posts])



    const handleUploadProfile = async (file) => {
        try {
            const formData = new FormData()
            formData.append('profile_picture', file)
            formData.append('token', localStorage.getItem('token'))
    
            const response = await clientServer.post('/update_profile_picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            if (response.status === 200) {
                // Immediately refetch user data to update UI
                dispatch(getAboutUser({ token: localStorage.getItem('token') }))
            }
        } catch (error) {
            console.error("Profile upload failed:", error.response?.data || error.message)
        }
    }
    


    const updateProfileData = async () => {
        const request = clientServer.post('/user_update', {
            token: localStorage.getItem('token'),
            name: userProfile.userId.name
        })


        const response = clientServer.post('update_profile_data', {
            token: localStorage.getItem('token'),
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork: userProfile.pastWork,
            education: userProfile.education
        })


        dispatch(getAboutUser({ token: localStorage.getItem('token') }))
    }



    useEffect(() => {

    }, [userProfile])










    // ------------------------JSX--------------------------------
    return (
        <UserLayout>
            <DashboardLayout>
                {authState.user && userProfile?.userId &&
                    <div className={s.container}>
                        <div className={s.backdropContainer}>
                            <label htmlFor='profilePictureUpload' className={s.backdrop__overlay}>
                                <p>Edit</p>
                            </label>
                            <input onChange={(e) => {
                                handleUploadProfile(e.target.files[0])
                            }} style={{ display: 'none' }} type="file" name="profilePictureUpload" id="profilePictureUpload" />
                            <img className={s.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="user profile picture" />
                        </div>


                        <div className={s.profileContainer__details}>
                            <div className={s.profileContainer__child}>

                                <div style={{ flex: '.8' }}>

                                    <div className={s.profileUsername__container}>
                                        <input type="text" className={s.nameEdit} value={userProfile.userId.name} onChange={(e) => {
                                            setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })
                                        }} />
                                        <p style={{ color: 'grey' }}>@{userProfile.userId.username}</p>

                                    </div>


                                    <div>
                                        <textarea className={s.bioTextarea} value={userProfile.bio}
                                            onChange={(e) => {
                                                setUserProfile({ ...userProfile, bio: e.target.value })
                                            }}
                                            rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                                            style={{ width: '100%' }}
                                            placeholder='Enter your bio'></textarea>

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
                                    userProfile?.pastWork?.map((work, index) => {
                                        return (
                                            <div key={index} className={s.workHistoryCard}>
                                                <p style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '.8rem' }}>{work.company} - {work.position}</p>
                                                <p>{work.years}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <button className={s.AddWordButton}
                                onClick={() => {
                                    setIsModalOpen(true)
                                }}>
                                Add Work
                            </button>

                            {/* Comments Container */}
                            {
                                isModalOpen &&
                                <div className={s.commentsContainer} onClick={() =>{
                                    setIsModalOpen(false)
                                }}>

                                    <div onClick={(e) => {
                                        e.stopPropagation()
                                    }} className={s.allCommentsContainer}>
                                        <input onChange={handleWork} name='company' className={s.inputField} type="text" placeholder='Enter Companu Name' />
                                        <input onChange={handleWork} name='position' className={s.inputField} type="text" placeholder='Enter your position' />
                                        <input onChange={handleWork} name='years' className={s.inputField} type="number" placeholder='Enter your work experience in years' />
                                        <button onClick={() =>{
                                            // setUserProfile({...userProfile, pastWork: {...userProfile.pastWork, workInputData}})
                                            setUserProfile({
                                                ...userProfile,
                                                pastWork: [
                                                  ...(Array.isArray(userProfile.pastWork) ? userProfile.pastWork : []),
                                                  workInputData
                                                ]
                                              })
                                              
                                            setIsModalOpen(false)
                                        }} className={s.updateWorkButton}>Add work</button>
                                    </div>
                                </div>
                            }


                        </div>

                        {
                            userProfile != authState.user &&
                            <div className={s.updateButton}
                                onClick={() => {
                                    updateProfileData()
                                }}>
                                Update Profile
                            </div>
                        }

                    </div>
                }
            </DashboardLayout>
        </UserLayout>
    )
}

export default ProfilePage