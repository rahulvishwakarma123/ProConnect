import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";




export const getAllPosts = createAsyncThunk(
    'post/getAllPosts',
    async(_, thunkAPI) =>{
        try {
            const response = await clientServer.get('/posts')
            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const createPost = createAsyncThunk(
    'post/createPost',
    async(userData, thunkAPI) =>{
        try {
            const {file, body} = userData
            const formData = new FormData()
            formData.append('token', localStorage.getItem('token'))
            formData.append('body', body)
            // Backend expects field name 'media' → upload.single('media')
            formData.append('media', file)

            const response = await clientServer.post('/post', formData, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            })

            if(response.status == 200){
                return thunkAPI.fulfillWithValue("Post Uploaded.")
            }else{
                return thunkAPI.rejectWithValue('Post is not uploaded.')
            }

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)



export const deletePost = createAsyncThunk(
    'post/deletePost',
    async(post_id, thunkAPI) =>{
        try{
            const response = await clientServer.delete('/delete_post', {
                data:{
                    token: localStorage.getItem('token'),
                    post_id: post_id.post_id
                }
            })

            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue('Somthing went wrong! Post not deleted.')
        }
    }
)



export const incrementLikes = createAsyncThunk(
    'post/incrementLikes',
    async(post_id, thunkAPI) =>{
        try {
            const response = await clientServer.post('increment_post_likes',{
                token: post_id.token,
                post_id: post_id.post_id
            })
            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)


export const getAllComments = createAsyncThunk(
    'post/getAllComments',
    async(post_id, thunkAPI) =>{
        try {
            const response = await clientServer.get('/get_comments', {
                params: {
                    post_id: post_id.post_id
                }
            })
            return thunkAPI.fulfillWithValue({
                comments: response.data,
                post_id: post_id.post_id
            })
        } catch (error) {
            return thunkAPI.rejectWithValue('Fetching comments went wrong!')
        }
    }
)



export const postComment = createAsyncThunk(
    'post/postComment',
    async (commentData, thunkAPI) =>{
        try {

            const response = await clientServer.post('/comment',{
                token: localStorage.getItem('token'),
                post_id: commentData.post_id,
                commentBody :  commentData.body
            })

            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(`Comment did't post successfully!`)
        }
    }
)