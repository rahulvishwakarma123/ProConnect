import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

// 
// Steps for stateManagement =>
//      Submit action
//      handle action in it's reducer
//      Register here -> reducer
// 



export const store = configureStore({
    reducer : {
         auth: authReducer,
         post: postReducer
    }
})