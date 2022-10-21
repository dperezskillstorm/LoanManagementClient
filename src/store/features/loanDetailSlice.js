import { createSlice } from "@reduxjs/toolkit";



const loanDetailSlice = createSlice({
    name: "loanDetail",
    initialState:{
        value: null
    },
    reducers:{
        
        changeLoanDetail: (state,action) =>{
            state.value = action.payload
        },
      

    },
});

export const {changeLoanDetail} = loanDetailSlice.actions;
export default loanDetailSlice.reducer;