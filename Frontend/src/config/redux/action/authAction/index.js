import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Login user thunk
export const loginUser = createAsyncThunk(
    'user/login',
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('/login', {
                email: user.email,
                password: user.password
            });
            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                return response.data.token;
            } else {
                return thunkAPI.rejectWithValue({
                    message: "Token not found."
                });
            }

            return thunkAPI.fulfillWithValue(response.data.token)

        } catch (error) {
            // Handle error response safely
            return thunkAPI.rejectWithValue(response.data.message);
        }
    }
);

// Register user thunk
export const registerUser = createAsyncThunk(
    'user/register',
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('/register', {
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name
            })
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
);


export const getAboutUser = createAsyncThunk(
    'user/getAboutUser',
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get('/get_user_and_profile', {
                params: {
                    token: user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data)

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)


export const getAllUsers = createAsyncThunk(
    'user/getAllUser',
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get('/user/get_all_users')
            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)





export const sendConnectionRequest = createAsyncThunk(
    '/user/sendConnectionRequest',
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post('/user/send_connection_request', {
                token: user.token,
                connectionId: user.connectionId
            })
            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)


export const getConnectionsRequest = createAsyncThunk(
    '/user/getConnectionsRequest',
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get('/user/get_connection_requests', {
                params: {
                    token: localStorage.getItem('token')
                }
            })
            return thunkAPI.fulfillWithValue(response.data.connection)
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)



export const getMyConnectionRequests = createAsyncThunk(
    '/user/getMyConnectionRequests',
    async (user, thunkAPI) =>{
        try {
            const response = await clientServer.get('/user/user_connection_request',{
                params:{
                    token: localStorage.getItem('token')
                }
            })
            // Backend returns an array directly
            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)




export const acceptConnection = createAsyncThunk(
    '/user/acceptConnection', 
    async(user, thunkAPI) =>{
        try {
            const response = await clientServer.post('/user/accept_connection_request',{
                token: user.token,
                requestId: user.connectionId,
                actionType: user.action
            })
            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)