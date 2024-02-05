import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: 'user',
    initialState: { 
        token: "",
        details: null,
     },
    reducers: {
        setUserData: (state, action) => { 
            Object.keys(action.payload).forEach(key=>state[key]=action.payload[key])
         },
        clearUserData: (state) => { 
            state.token = "";
            state.details = null;
        },
    },
})

// Extract and export each action creator by name
export const { setToken, clearToken, setUserData, clearUserData } = userSlice.actions
// Export the reducer, either as a default or named export
export default userSlice.reducer