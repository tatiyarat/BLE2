import {configureStore} from '@reduxjs/toolkit'
import LocationReducer from './LocationSlice'

const store = configureStore({
    reducer : {
        location:LocationReducer
    }
})
export default store