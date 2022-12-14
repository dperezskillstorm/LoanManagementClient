import {RERENDER_COMPONENT, GET_ACTIVE_LOAN, DISPLAY_ALERT, CLEAR_ALERT,TOGGLE_SIDEBAR, GET_DATA, GET_TRANSACTIONS, GET_ALL_LOANACCOUNTS} from "./actions"

const reducer = (state, action) =>{
    if(action.type === DISPLAY_ALERT){
        return{...state, showAlert:true, alertType:"danger", alertText:"Transaction Submited"}
    }

    if(action.type ===CLEAR_ALERT){
        return{...state, showAlert:true, alertType:"", alertText:""}
    }

    if(action.type === TOGGLE_SIDEBAR){
        return {...state, showSidebar:!state.showSidebar}
    }

      if(action.type ===GET_DATA){
        return{...state, loanDetails: action.payload.data}
    }

    if(action.type ===GET_TRANSACTIONS){
        return{...state, loanTransactions: action.payload.data}
    }

    if(action.type ===GET_ALL_LOANACCOUNTS){
        return{...state, loanAccounts: action.payload.data}
    }

    if(action.type ===GET_ACTIVE_LOAN){
        return{...state, activeLoan: action.payload}

    }

    if(action.type ===RERENDER_COMPONENT){
        return{...state, rerender: !state.rerender}

    }

    
       
        
        
    

    throw new Error(`no such action: ${action.type}`)

}

export default reducer
