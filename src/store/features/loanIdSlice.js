import { createSlice } from "@reduxjs/toolkit";



const loanIdSlice = createSlice({
    name: "loanId",
    initialState:{
        value: null
    },
    reducers:{
        
        changeLoanId: (state,action) =>{
            state.value = action.payload
        },
      

    },
});

export const {changeLoanId} = loanIdSlice.actions;
export default loanIdSlice.reducer;