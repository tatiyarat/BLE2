import {createSlice} from '@reduxjs/toolkit';
export const LocationSlice = createSlice({
    name:"location",
    initialState:{
        value:"?"
    },
    reducers:{
        setLocation:(state, action) =>{
            state.value = action.payload
        }
    }
})
// export const {setLocation} = LocationSlice.action;

export const getLocation = state => state.location.value

export default LocationSlice.reducer