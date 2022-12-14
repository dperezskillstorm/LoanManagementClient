import './App.css';
import React, { useEffect } from 'react';
import {Dashboard, HomePage} from './Page';
import LoanClients from './components/LoanClients/LoanClients';
import PaymentTable from './components/PaymentTable';
import Popup from './Page/Popup';
import LoanSelectBar from './components/LoanSelectionBar';
import Register from './Page/Register';
import { useAppContext } from './context/appContext';
import PaymentCards from './Page/PaymentCards';
import 'bootstrap/dist/css/bootstrap.min.css';




function App() {
  const {loanAccounts,getAllAccounts, loanDetails, activeLoan}= useAppContext()


// useEffect(()=>{
//   window.addEventListener('storage', () => {
//     console.log("useeffect")
//      setActiveLoan(JSON.parse(localStorage.getItem('loanNum')) || [])   
//   });},[activeLoan])


  return (
    <>

  <HomePage/>
  <PaymentCards/>

 

  </>
  
  );
}

export default App;
