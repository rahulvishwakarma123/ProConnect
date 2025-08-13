import { createSlice } from "@reduxjs/toolkit"
import { getAllPosts } from "../../action/postAction"
import { getAboutUser } from "../../action/authAction"



const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    loggedIn: false,
    message: '',
    comment: [],
    postId: ''
}




const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {

        reset: () => initialState
    },
    resetPostId: (state) => {
        state.postId = ''
    },
    extraReducers: (builders) => {
        builders
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true
                state.message = 'Fetching all the posts...'
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isError = false
                state.isLoading = false
                state.postFetched = true
                state.posts = action.payload.posts.reverse()
                state.message = 'Post Loaded Successfully!'
            })
            .addCase(getAllPosts.rejected, (state, action) =>{
                state.isError = true
                state.isLoading = false
                state.message = action.payload
            })
            
    }
})

export default postSlice.reducer