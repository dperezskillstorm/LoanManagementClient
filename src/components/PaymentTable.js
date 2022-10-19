import React, { Fragment, useEffect } from 'react'
import "./table.css"
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";




export default function PaymentTable(){
    let loanId = useSelector((store) => store.loanId.value);
    const [schedule, setSchedule] = React.useState([]);
    const [currentWeek, setCurrentWeek] = React.useState();
    const [transactions, setTransactions] = React.useState([])
    const [data, setData] = React.useState()
    const [paymentLength,setPaymentLength] = React.useState()
    const [formValues, setFormValues] = React.useState({
        _id: "",
            paymentAmount: "",
            date: "",
            period: "",
            loanId: "",
            status:false
      })

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
          ...formValues,
          [name]: value,
      
        });
      };
    

    const getTransactions = async() =>{
        // setLoading(false);
        try{
            const {data: response } = await axios.get('http://localhost:9090/api/v1/loanTransactions')
            setTransactions(response)
        }catch(error){
            console.error(error.message);
        }
        // setLoading(false)
    }



    
    const getData = async() =>{
        // setLoading(false);
        try{
            const {data: response } = await axios.get('http://localhost:9090/api/v1/loanDetails')
            setData(response)
        }catch(error){
            console.error(error.message);
        }
        // setLoading(false)
    }




useEffect(()=>{
    getTransactions()
    getData()

    
 

            },[schedule,loanId])

    




//function generate payment schedule
function generateSchedule(){
    let totalPeriods = data.filter((obj)=> {return obj._id===loanId}).map((item)=>{return item.periods})
    let totalDue = data.filter((obj)=> {return obj._id===loanId}).map((item)=>{return item.loanAmount})
    let totalInterest = data.filter((obj)=> {return obj._id===loanId}).map((item)=>{return item.interestRate})
    let date = data.filter(function(obj){return obj._id===loanId}).map((item)=>{return (item.date)})
    let paid = transactions.filter((obj)=> {return obj.loanId ===loanId }).sort(function(a,b){return a.period-b.period})
    setPaymentLength(paid.length)
    console.log(paymentLength)
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
            console.log("schedule Set", schedule)
  
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

//to avoid double transation sql table reuiqre transaction Id to be unique
// transactionid is based on loan number and payperiod

async function processPayment (loanid,period,date,payment){
    let transactionId = String(loanId)+String(period)
    let interest = data.filter(function(obj){return obj._id===loanId}).map((item)=>{return (item.interestRate)})
    let periods = data.filter(function(obj){return obj._id===loanId}).map((item)=>{return (item.periods)})
    let loanAmount = data.filter(function(obj){return obj._id===loanId}).map((item)=>{return (item.loanAmount)})



    console.log(interest, periods, loanAmount)

    const payload = {
        _id:transactionId,
        loanId: loanId , 
        period: period, 
        paymentAmount: (loanAmount * (1 + Number(interest) ))/periods,
        date: date,
    status: "Paid",
    }

    await axios.post(`http://localhost:9090/api/v1/loanTransactions`,payload)
    .then(resp =>{console.log(resp.data); generateSchedule()  })
    .catch(error =>{console.error(error); return Promise.reject(error)})

}

async function processPaymentInterest (period,date,payment){
    let interest = data.filter(function(obj){return obj._id===loanId}).map((item)=>{return (item.interestRate)})
    console.log(interest)
    let transactionId = String(loanId)+String(period)+"0001"
    const payload = {
        _id:transactionId,
        loanId: loanId , 
        period: period, 
        paymentAmount: interest*100, 
        date: date,
    status: "Interest",
    }

    await axios.post(`http://localhost:9090/api/v1/loanTransactions`,payload)
    .then(resp =>{console.log(resp.data); generateSchedule()  })
    .catch(error =>{console.error(error); return Promise.reject(error)})

}


            function handlePayment(client_Id,period,date,payment){
                processPayment(client_Id,period,date,payment) 
           }

           async function handleSubmit(event){
            let transactionId = String(loanId)+String(formValues.period)
            event.preventDefault()
            //yyyy-mm-dd
            let year = formValues.date.slice(0,4)
            let month = formValues.date.slice(5,7)
            let day = formValues.date.slice(8,10)
            let formatedDate =year+"-"+month+"-"+day
                const payload =
                {   
                    _id:transactionId,
                    loanId: formValues.loanId,
                    paymentAmount: Number(formValues.paymentAmount), 
                    date: formatedDate,
                    period: formValues.period,
                    status: formValues.status} 
                    //AxiosPost
                    await axios.post(`http://localhost:9090/api/v1/loanTransactions`,payload)
                    .then(resp =>{console.log(resp.data); generateSchedule()  })
                    .catch(error =>{console.error(error); return Promise.reject(error)})
              }
    



return(
        <Fragment>
            <button onClick={()=>generateSchedule()}>Generate Table</button>
    {data && <h1>Payment Schedule: {data.filter(function(obj){return obj._id===loanId}).map((item)=>{return (item.firstName +" "+ item.lastName)})}</h1> }
   <form onSubmit={handleSubmit}>
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
                    <td>{item.status!=="Paid" && <button onClick={()=>handlePayment(item.loanId,item.period,item.date,item.paymentAmount)}>Payment</button>}
                    {item.status!=="Paid" && <button onClick={()=>processPaymentInterest(item.period,item.date,item.paymentAmount)}>Interest</button>}</td>

                </tr>
            
    )})} 
      
      
       </tbody> 
       
    </table>
    <h1>Extra Payments</h1>
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
         
             {transactions.filter(function(obj){return obj.loanId === loanId}).filter(function(obj){return obj.period > schedule.length}).map((item) => {
                return( 
                    <tr key={item._id}> 
                     <td>{item.loanId}</td>
                    <td>{item.period}</td>
                    <td>{item.date}</td>
                    <td>{item.paymentAmount}</td>
                    <td>{item.status==="Paid" ? item.status : convertToWeek(item.date) === currentWeek ? 'Due' : item.status}</td>
                    <td>{item.status!=="Paid" && <button onClick={()=>handlePayment(item.loanId,item.period,item.date,item.paymentAmount)}>Payment</button>}
                    {item.status!=="Paid" && <button onClick={()=>processPaymentInterest(item.period,item.date,item.paymentAmount)}>Interest</button>}</td>

                </tr>
            
    )})} 
       <tr>
             
                    <td><input name="loanId" type='text' placeholder="loanId"  value={formValues.loanId} onChange={handleInputChange}/></td>
                    <td><input style={{"width":70}} name="period" type='text' placeholder="Period" value={formValues.period} onChange={handleInputChange} /></td>
                    <td><input name="date" type='date' value={formValues.date} onChange={handleInputChange}/></td>  
                    <td><input name="paymentAmount" type='number' placeholder="Payment Amount"  value={formValues.paymentAmount} onChange={handleInputChange} /></td>
                    <td><input name="status" type='text' placeholder="Status"  value={formValues.status} onChange={handleInputChange} /></td>

                    <td>    <button type="submit">Add + </button>
</td>
                    </tr>
      
       </tbody>
        
    </table>
    <h1>Summary</h1>
    <table id="customers">  
        <thead>
            <tr>
                <th>Total Due</th>
                <th>Total Interest Only Payments</th>
                <th>Payments Recieved</th>
            </tr>
        </thead>

        <tbody>
                   <tr>
                   <td>{schedule.filter(function(obj){return obj.status!=="Interest"}).filter(function(obj){return obj.status!=="Paid"}).reduce((prev,curr)=> prev+curr.paymentAmount ,0)}</td>
                    <td>{transactions.filter(function(obj){return obj.loanId===loanId}).filter(function(obj){return obj.status==="Interest"}).reduce((prev,curr)=> prev+curr.paymentAmount ,0)}</td>
                    <td>{transactions.filter(function(obj){return obj.loanId===loanId}).filter(function(obj){return obj.status==="Paid"}).reduce((prev,curr)=> prev+curr.paymentAmount ,0)}</td> 
                </tr>
            
            
        </tbody>
        </table> 
        </form>
    </Fragment>
    )




                

}