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
            return thunkAPI.rejectWithValue(response.data.message );
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
    async (user, thunkAPI) =>{
        try {
            const response = await clientServer.get('/get_user_and_profile', {
                params:{
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
    async (_, thunkAPI) =>{
        try {
            const response = await clientServer.get('/user/get_all_users')
            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)