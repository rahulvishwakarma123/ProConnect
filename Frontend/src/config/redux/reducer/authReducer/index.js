import { getAboutUser, getAllUsers, loginUser, registerUser } from "../../action/authAction"
import { createSlice } from "@reduxjs/toolkit"



const initialState = {
    user: undefined,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    isTokenThere: false,
    message: '',
    profileFetched: false,
    connections: [],
    connectionRequest: [],
    all_users: [],
    all_profiles_fetched: false
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser : (state) =>{
            state.message = 'hello'
        },
        emptyMessage: (state) =>{
            state.message = ''
        },
        setTokenThere: (state) =>{
            state.isTokenThere = true
        },
        setTokenIsNotThere: (state) =>{
            state.isTokenThere = false
        }

    },
    extraReducers: (builder) =>{
        builder
        .addCase(loginUser.pending, (state) =>{
            state.isLoading = true
            state.message = { message: 'Knocking the door...'}
        })
        .addCase(loginUser.fulfilled, (state,action) =>{
            state.isLoading = false
            state.isError = false
            state.isSuccess = true
            state.loggedIn = true
            state.message = { message: 'Login is Successful.'}
        })
        .addCase(loginUser.rejected, (state, action) =>{
            state.isError = true
            state.isLoading = false
            state.message = action.payload
        })
        .addCase(registerUser.pending, (state, action) =>{
            state.isLoading = true
            state.message = { message: 'Registering you...'}
        })
        .addCase(registerUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = { message: "Registration Successful! Please login."};
        })
        .addCase(registerUser.rejected, (state, action) =>{
            state.isError = true
            state.isLoading = false
            state.message = action.payload
        })
        .addCase(getAboutUser.fulfilled, (state, action) =>{
            state.isError = false
            state.isLoading = false
            state.profileFetched = true
            state.user = action.payload.profile
        })
        .addCase(getAllUsers.fulfilled, (state, action) =>{
            state.isLoading = false,
            state.isError = false,
            state.all_profiles_fetched = true,
            state.all_users = action.payload.profiles
        })
    }
})
export const { reset, handleLoginUser, emptyMessage, setTokenThere, setTokenIsNotThere } = authSlice.actions;

export default authSlice.reducer