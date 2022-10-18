import React, { Fragment, useEffect } from 'react'
import "./table.css"
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";




export default function PaymentTable(){
    let loanId = useSelector((store) => store.loanId.value);
    const [schedule, setSchedule] = React.useState([]);
    const [currentWeek, setCurrentWeek] = React.useState();
    const [balance , setBalance] = React.useState("")
    const [transactions, setTransactions] = React.useState()
    const [data, setData] = React.useState()
    const [tableActive, setTableActive] = React.useState(false);




useEffect(()=>{

    const getTransactions = async() =>{
        const res = await axios.get('http://localhost:9090/api/v1/loanTransactions')
        .then(res => {setTransactions(res.data)})
        .catch(err => console.error(err))
        console.log("GET TRANSACTION ")
            }
            getTransactions()
            .catch(console.error)
  

           
                const getData = async() =>{
                    const res = await axios.get('http://localhost:9090/api/v1/loanDetails')
                    .then(res=> setData(res.data))
                    .catch(err => console.error(err))
                    console.log("GET Data ")
            }
            getData()
            .catch(console.error)


            },[schedule])

    




//function generate payment schedule
function generateSchedule(){
    let totalPeriods = data.filter((obj)=> {return obj._id===loanId}).map((item)=>{return item.periods})
    let totalDue = data.filter((obj)=> {return obj._id===loanId}).map((item)=>{return item.loanAmount})
    let totalInterest = data.filter((obj)=> {return obj._id===loanId}).map((item)=>{return item.interestRate})
    let date = data.filter(function(obj){return obj._id===loanId}).map((item)=>{return (item.date)})
    let paid = transactions.filter((obj)=> {return obj.loanId ===loanId }).sort(function(a,b){return a.period-b.period})
    let paymentAmount = totalDue*(1+(Number(totalInterest)))/totalPeriods
    let emptyArray = [];
    for (let i=1; i<=totalPeriods ; i++){
            let foundOne = paid.find(elem => elem.period===i)
            if(foundOne){
                emptyArray.push(foundOne)
              
        
            }else{
                const d = new Date(date);
                d.setDate(d.getDate(date)+((7*i)))
                emptyArray.push({_id: i+loanId, loanId: loanId, date: d.toDateString() ,period: i, paymentAmount: paymentAmount})
                
            }      
                      

            }
         
            setSchedule(prevState=> emptyArray)
            alert("Generating Schedule")
  
        }

     
    React.useEffect(()=>{
        const today = new Date()
        var fiscalStartDate = new Date(2022,1,1)
        const dateDiff = Math.abs(today-fiscalStartDate);
        const weeks =  Math.floor((dateDiff/8.64e7)/7);
        setCurrentWeek(weeks)
    },[])





    



function convertToWeek(date){
    const today = new Date(date)
    var fiscalStartDate = new Date(2022,1,1)
    const dateDiff = Math.abs(today-fiscalStartDate);
    const weeks =  Math.floor((dateDiff/8.64e7)/7);
    return weeks
}


const processPayment = async(loanid,period,date,payment) =>{
    let transactionId = loanId+period
    const payload = {
        _id:transactionId,
        loanId: loanId , 
        period: period, 
        paymentAmount: payment, 
        date: date,
    status: "Paid",
    }
    
        const resp = await axios.post(`http://localhost:9090/api/v1/loanTransactions/`,payload)
        .then(resp =>{console.log(resp.data) ; generateSchedule()})
        .catch(error =>{console.error(error); return Promise.reject(error)})
            }
        
            function handlePayment(client_Id,period,date,payment){
                processPayment(client_Id,period,date,payment) 
           }


return(
        <Fragment>
            <button onClick={()=>generateSchedule()}>Generate Table</button>
    {data && <h1>Payment Schedule: {data.filter(function(obj){return obj._id===loanId}).map((item)=>{return (item.firstName +" "+ item.lastName)})}</h1> }
    <table id="customers">
        <thead>
            <tr>
                <th>Client Id</th>
                <th>Period</th>
                <th>Date</th>
                <th>Payment Due</th>
                <th>Status</th> 
                <th>Action</th>
            </tr>
        </thead>

        <tbody>
         
             {schedule.map((item) => {
                return( 
                    <tr key={item._id}> 
                     <td>{item.loanId}</td>
                    <td>{item.period}</td>
                    <td>{item.date}</td>
                    <td>{item.paymentAmount}</td>
                    <td>{item.status==="Paid" ? item.status : convertToWeek(item.date) === currentWeek ? 'Due' : item.status}</td>
                    <td>{item.status!=="Paid" && <button onClick={()=>handlePayment(item.loanId,item.period,item.date,item.paymentAmount)}>Payment</button>}</td>

                </tr>
            
    )})} 
      
       </tbody> 
    </table>
    <h1>Summary</h1>
    <table id="customers">  
        <thead>
            <tr>
                <th>Total Due w/Interest</th>
                <th>Total Paid</th>
            </tr>
        </thead>

        <tbody>
                    <tr > 
                    {/* <td>{data.reduce((prev,curr)=> prev+curr.loanAmount ,0)}</td> */}
                    <td>{schedule.filter(function(obj){return obj.status!=="Paid"}).reduce((prev,curr)=> prev+curr.paymentAmount ,0)}</td>
                    <td>{schedule.filter(function(obj){return obj.status==="Paid"}).reduce((prev,curr)=> prev+curr.paymentAmount ,0)}</td> 
                </tr>
            
            
        </tbody>
        </table> 
    </Fragment>
    )




                

}