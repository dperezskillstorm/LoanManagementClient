import React, { useEffect } from 'react'
import { useAppContext } from '../context/appContext'
import Wrapper from '../Wrappers/WrapperAccountList'
import useSWR from "swr"
import axios from "axios"

const LoanSelectBar = () =>{

const {getLoanTransactions, loanAccounts, getActiveLoan,getLoanDetails,activeLoan}= useAppContext()
let url =  `http://localhost:8080/api/v1/loanDetails/`



const fetcher = (...args) => fetch(...args).then(res => res.json())

const {data, error} =useSWR(url,fetcher)

const handleClick = (key) =>{
    getActiveLoan(key)
    // getLoanDetails(key)
    // getLoanTransactions(key)

}


if(error) return <div>Failed to Load</div>

if(!data) return<div>Loading...</div>

return (
    <Wrapper >
        <table ><tr style={{minLength:30}}><td >Active Loan: {activeLoan}</td></tr></table>
 
         <table style={{display:'inline'}}>
            <tr>
                <td>
                    <li style={{color:"#2cb1bc"}}>Active</li>
                </td>
                <td>
                    <li style={{color:"blue"}}>Selected</li>
                </td>
          
                <td>
            <li style={{color:"red"}}>Closed</li>
                </td>
                <td>
            <li style={{color:"gold"}}>Refinanced</li>
                </td>
            </tr>
          
          
   

         </table>
        
        
          
         

        {data.sort((a, b) => a.status.localeCompare(b.status)).map((item)=>{

                let color;
                if (item._id === activeLoan)  color = "blue"
                if (item.status === "Closed")  color = "red"
                if (item.status === "Pause")  color = "purple"
                if (item.status === "Refinanced")  color = "gold"
                if (item.status === "active")  color = ""
              
            return (
                <nav>



                <button className='btn' style={{backgroundColor : color }} 
                onClick={()=>handleClick(item._id)}
                > {item.firstName} {item.lastName}</button>
                </nav>
            )
        })}
    </Wrapper>

)

}

export default LoanSelectBar;