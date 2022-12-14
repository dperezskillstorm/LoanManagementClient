import React, {useReducer, useContext} from 'react'
import {RERENDER_COMPONENT, SETUP_USER_BEGIN, SETUP_USER_ERROR, SETUP_USER_SUCCESS, DISPLAY_ALERT,CLEAR_ALERT, TOGGLE_SIDEBAR, GET_DATA, GET_TRANSACTIONS, GET_ALL_LOANACCOUNTS, DATA_LOADED, GET_ACTIVE_LOAN } from './actions'
import reducer from "./reducer"
import axios from "axios"
import swr from "swr"


const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user:user ? JSON.parse(user) : null,
    token: token,
    userLocation: userLocation || " ",
    jobLocation: userLocation || "",
    showSidebar: true,
    activeLoan: 2371,
   
   

}

const AppContext = React.createContext();

const AppProvider = ({children}) =>{
const [state, dispatch] = useReducer(reducer,initialState)

const addUserToLocalStorage = ({user,token,location}) =>{
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token',token)
    localStorage.setItem('location', location)

}

const removeUserToLocalStorage = () =>{
    localStorage.removeItem('token')
    localStorage.removeItem('location')
    localStorage.removeItem('user')

}

const getAllAccounts = async () =>{
    try{
        const res = await axios.get(`http://localhost:8080/api/v1/loanDetails/`)
        const data = res.data
        dispatch({type:GET_ALL_LOANACCOUNTS, payload:{data:data}})
    }catch(error){
        console.error(error.message);
    }



}

const deleteAccount = async (id) =>{
    try{
        const res = await axios.delete(`http://localhost:8080/api/v1/loanDetails/${id}`)
        const data = res.data
        dispatch({type:GET_ALL_LOANACCOUNTS, payload:{data:data}})
    }catch(error){
        console.error(error.message);
    }



}


//create function used in context

const displayAlert = () =>{
    dispatch({type:DISPLAY_ALERT})
    clearAlert()

}

const clearAlert = () =>{
    setTimeout(()=>{
        dispatch({type:CLEAR_ALERT})
    },3000)
}





const toggleSidebar = () =>{
    dispatch({type:TOGGLE_SIDEBAR})
}

const refreshPage = (key) =>{
    getLoanTransactions(key)

}



const getLoanDetails = async (loanNum) =>{
    try{
        const res = await axios.get(`http://localhost:8080/api/v1/loanDetails/${loanNum}`)
        const data = res.data
        dispatch({type:GET_DATA, payload:{data:data}})
   
      
      
              
    }catch(error){
        console.error(error.message);
    }



}

const setupUser = async ({currentUser, endPoint, alertText}) =>{
    dispatch({type: SETUP_USER_BEGIN})

    try {
        const response = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)
        const {user, token, location} = response.data
        dispatch({type:SETUP_USER_SUCCESS, payload:{user,token,location,alertText}})
        addUserToLocalStorage({user,token,location})
    } catch (error) {
        //local staorge later
        dispatch({type:SETUP_USER_ERROR, payload: {msg: error.response.data.msg}})
        
    }
    clearAlert()
}

const getActiveLoan = async (loanNum) =>{
    dispatch({type:GET_ACTIVE_LOAN, payload:loanNum})
   
}




const getLoanTransactions = async (loanNum) =>{
    try{
        const res = await axios.get(`http://localhost:8080/api/v1/loanTransactions/loanNumber/${loanNum}`)
        const data = res.data
        dispatch({type:GET_TRANSACTIONS, payload:{data:data}})
    }catch(error){
        console.error(error.message);
    }



}


return(
    <AppContext.Provider
    value={{...state,refreshPage, displayAlert, toggleSidebar,getLoanDetails, getLoanTransactions, getAllAccounts, getActiveLoan,setupUser}}>
        {children}
    </AppContext.Provider>
)
}


const useAppContext = () =>{
    return useContext(AppContext)
}



export {AppProvider, initialState,useAppContext}



