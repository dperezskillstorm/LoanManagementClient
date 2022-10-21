import { createSlice } from "@reduxjs/toolkit";



const generateScheduleSlice = createSlice({
    name: "generateSchedule",
    initialState:{
        value: null
    },
    reducers:{
        
        changeGenerateSchedule: (state,action) =>{
            state.value = action.payload
        },
      

    },
});

export const {changeGenerateSchedule} = generateScheduleSlice.actions;
export default generateScheduleSlice.reducer;