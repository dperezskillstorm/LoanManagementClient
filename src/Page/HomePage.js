import React from 'react'
import "./homepage.css"
import axios from "axios"
import PaymentTableSummary from '../components/PaymentTableSummary';
import DetailsTables from './DetailsTables';
import Popup from './Popup';
import AddNewLoan from '../components/LoanClients/AddNewLoan';
import PaymentsThisWeek from '../components/Reports/PaymentsThisWeek';
import CollectionList from '../components/Reports/CollectionList';
import LoanSelectBar from '../components/LoanSelectionBar';
import Wrapper from '../Wrappers/WrapperDashboard copy';
import { useAppContext } from '../context/appContext';


export default function HomePage(){
    
    const [currentWeek, setCurrentWeek] =React.useState();
    const {loanAccounts,getAllAccounts, loanDetails}= useAppContext()
    

            React.useEffect(()=>{
                const today = new Date()
                var fiscalStartDate = new Date(today.getFullYear(),0,1)
                const dateDiff = Math.floor((today - fiscalStartDate)/(24*60*60*1000));
                // const weeks =  Math.floor((dateDiff/8.64e7)/7);
                const weeks =  Math.ceil((today.getDay()+ dateDiff)/7);
                setCurrentWeek(weeks)
            },[])

    const [showPopUp, setShowPopUp] = React.useState(false)
    const [popUpSelection, SetPopUpSelection] = React.useState("")


   function showPopUpAddLoan(){
    SetPopUpSelection("ADD_LOAN")
    setShowPopUp(true)

   } 

   function showPopUpCollections(){
    SetPopUpSelection("COLLECTIONS")
    setShowPopUp(true)


   } 

   function showPopUpWeeklyTransactions(){
    SetPopUpSelection("WEEKLY_TRANSACTIONS")
    setShowPopUp(true)

   } 





    return(

    <>
    <Popup show={showPopUp} handleClosePopUp={()=>setShowPopUp(false)}>
      { popUpSelection === "COLLECTIONS" && <CollectionList/>}
      { popUpSelection === "ADD_LOAN" && <AddNewLoan/>}
      { popUpSelection === "WEEKLY_TRANSACTIONS" && <PaymentsThisWeek/>}

 

    </Popup>
        <Wrapper>
            <div className='main'>
                <div className='sidebar' style={{backgroundColor:"#e0fcff"}}>
                    <LoanSelectBar/>
                </div>
                <div >
                    <header style={{backgroundColor: "lightBlue", height:150, width:900}}>
                        <h1>
                            <button className='btn' onClick={()=>showPopUpCollections()} >Collection List</button>
                            <button className='btn' onClick={()=>showPopUpWeeklyTransactions()} style={{marginLeft:5}}>Weekly Transactions</button>
                            <button className='btn' onClick={()=>showPopUpAddLoan()} style={{marginLeft:5}}>New Loan</button>


                            </h1>  
                    </header>
            
                      <DetailsTables/>
           

                </div>
            </div>
        </Wrapper>
        </>

    )
    }
  
    