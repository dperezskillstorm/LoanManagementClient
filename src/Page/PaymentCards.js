import React from 'react'
import useSWR from 'swr'
import axios from "axios"
import Wrapper from '../Wrappers/WrapperCard'


const PaymentCards = () => {
    const [paid,setPaid] = React.useState(false)
   
    const [activeRow, setActiveRow] = React.useState(null)

    const handleClick = () =>{
        setShouldFetch(false)
        setTimeout(()=>{
          setShouldFetch(true)
        },400)
    }
  
  


    const [shouldFetch, setShouldFetch]= React.useState(true);

    let accountUrl =  `http://localhost:8080/api/v1/loanDetails/`
    let transactionUrl =  `http://localhost:8080/api/v1/loanTransactions/`
 
    
    
    const fetcher = (...args) => fetch(...args).then(res => res.json()).catch(err=>console.log(`error: ${err}`))
    const {data, error} =useSWR(shouldFetch ? accountUrl: null,fetcher)

    const transactionFetcher = (...args) => fetch(...args).then(res => res.json()).then(console.log(data)).catch(err=>console.log(`error: ${err}`))
    const {data: transactionData, error: transactionsError} =useSWR(shouldFetch ? transactionUrl :null,transactionFetcher)

    function balance(key){
        let account = data.filter(obj=>{return obj._id === key})
        let paid = transactionData.filter(obj=>{return obj.loanId === key}).filter(obj=>{return obj.status === "Paid"}).reduce((prev,curr)=> prev+curr.paymentAmount,0)
        let due = transactionData.filter(obj=>{return obj.loanId === key}).filter(obj=>{return obj.status === "Draw"}).reduce((prev,curr)=> prev+curr.paymentAmount,0)
        let totalDue = due * (1+(account[0].interestRate))
        return (totalDue - paid);
    } 

function getPaymentLeft(key){
    let account = data.filter(obj=>{return obj._id === key})
    let paid = transactionData.filter(obj=>{return obj.loanId === key}).filter(obj=>{return obj.status === "Paid"}).reduce((prev,curr)=> prev+curr.paymentAmount,0)
    let due = transactionData.filter(obj=>{return obj.loanId === key}).filter(obj=>{return obj.status === "Draw"}).reduce((prev,curr)=> prev+curr.paymentAmount,0)
    let totalDue = due * (1+(account[0].interestRate))
    return (totalDue - paid)/account[0].paymentAmount;
}

function getRecentPayment(key){
    let account = data.filter(obj=>{return obj._id === key})
    let transaction = transactionData.filter(obj=>{return obj.loanId === key})
    let orderedTransactions =  transaction.sort((a,b)=>a.periods < b.periods)
    let payment = orderedTransactions[orderedTransactions.length-1]
    return payment

}

function totalDue(key){
    // its total amount of money drawn plus interest rates
    let account = data.filter(obj=>{return obj._id === key})
    let draw = transactionData.filter(obj=>{return obj.loanId === key}).filter(obj=>{return obj.status === "Draw"}).reduce((prev,curr)=> prev+curr.paymentAmount,0)
    let totalDue = draw * (1+(account[0].interestRate))
    return totalDue;
}

const [isLoading,setIsLoading] = React.useState(false)
const [currentPeriod,setCurrentPeriod] = React.useState(1)

async function handleCustomSubmit(key, paymentAmount){
    let transactions = transactionData.filter(obj=>{return obj.loanId === key})
    var maxNumber = transactions.length===0 ? 0 : transactions.reduce(function(prev,cur) {
        return prev > cur.period ? prev : cur.period;
    }, -Infinity);
    setCurrentPeriod(maxNumber+1)
    let transactionId = String(key)+String(Number(maxNumber +1))
 
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    let formatedDate =yyyy+"-"+mm+"-"+dd
        const payload =
        {   
            _id:Number(transactionId),
            loanId: Number(key),
            paymentAmount: Number(paymentAmount), 
            date: formatedDate,
            period: Number(maxNumber +1),
            status: "Paid"} 

         

            //AxiosPost
            await axios.post(`http://localhost:8080/api/v1/loanTransactions`,payload)
            .then(resp =>{console.log(resp.data)})
            .then(setIsLoading(true))
            .then(setActiveRow(key))
            .then(setIsLoading(true))
            .then(setTimeout(()=> {
                setIsLoading(false)
                 handleClick()
            },1500))
           
            .catch(error =>{console.error(error); return Promise.reject(error)})
      }

function todayDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    let formatedDate =yyyy+"-"+mm+"-"+dd
    return formatedDate;
}

function getWeek(key){
    let str = key.split('-')
    let today = new Date(str[0],str[1]-1,str[2])
    var fiscalStartDate = new Date(today.getFullYear(),0,2)
    console.log(today,fiscalStartDate)
    let days = Math.floor((today - fiscalStartDate)/(24*60*60*1000));
    // const weeks =  Math.floor((dateDiff/8.64e7)/7);
    const weeks =  Math.ceil(days/7);
    return weeks
 
  
}




















if (error && transactionsError) return "Error"
if(!data && !transactionData) return <div class="loader"></div>

// if(isLoading ){
//     return(
//         <div class="loader"></div>
//     )
 
// }

if(data && transactionData){

 

  return (
    <>
   <Wrapper>
   <h1 style={{textAlign:"center", marginTop:20}}>Week: {getWeek(todayDate())}</h1>
    <div className='container'>
   

    
    {data.filter(obj=>{return obj.status === "Active"}).map(account => {
        
            let payment = getRecentPayment(account._id) ?  getRecentPayment(account._id) : {date: null, paymentAmount:0}
    
        
            if(isLoading && activeRow === account._id){
                return ( 
                <div className='card'>
                <div class="loader"></div>
                </div>
                )
            }

        return(

            <div class="card" style={{display: getWeek(String(payment.date)) === getWeek(todayDate()) ? "none": ""}}>
  {/* <img class="card-img-top" src="..." alt="Card image cap"/> */}
  <div class="card-block">
    <h4 class="card-title">{account.firstName} {account.lastName}</h4>
    <p class="card-text">Loan Info : Status active</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Loan Amount: {totalDue(account._id)}</li>
    <li class="list-group-item">Payment Lefts: {getPaymentLeft(account._id)}</li>
    <li class="list-group-item">Balance: {balance(account._id)}</li>
  </ul>
  <div class="footer">
   <button style={{marginRight:10}} onClick={()=>handleCustomSubmit(account._id,account.paymentAmount)}>Payment ${account.paymentAmount}</button>
 
</div>
<div class="footer">
    {console.log(payment.date)}
   <div className="infobox" style={{backgroundColor: getWeek(String(payment.date)) === getWeek(todayDate()) ? "lightGreen": ""}}> 
    <div>Recent Payment:</div>
    <div>{payment.date}</div>
    <div>${payment.paymentAmount}</div>
    <div>{payment.status}</div>
    {       
}

   
</div>
</div>
</div>
  
  
        )

    })}
    </div>
    </Wrapper>
        </>
  )
}
}

export default PaymentCards
