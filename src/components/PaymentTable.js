import React, { Fragment, useEffect } from 'react'
import "./table.css"
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { changeGenerateSchedule } from "../store/features/generateScheduleSlice";




export default function PaymentTable(){
    const dispatch = useDispatch()
    let loanId = useSelector((store) => store.loanId.value);
    let loanDetail = useSelector((store) => store.loanDetail.value);
    console.log(loanDetail)
    const [update, setUpdate] = React.useState()
    const [schedule, setSchedule] = React.useState([]);
    const [currentWeek, setCurrentWeek] = React.useState();
    const [transactions, setTransactions] = React.useState([])
    const [formValues, setFormValues] = React.useState({
        _id: "",
            paymentAmount: "",
            date: "",
            period: "",
            loanId: "",
            status:false
      })
      const [customFormValues, setCustomFormValues] = React.useState({
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

      const handleCustomInputChange = (e) => {
        const { name, value } = e.target;
        setCustomFormValues({
          ...customFormValues,
          [name]: value,
      
        });
      };
    

    const getTransactions = async() =>{
        // setLoading(false);
        try{
            const {data: response } = await axios.get('http://localhost:8080/api/v1/loanTransactions')
            setTransactions(response)
        }catch(error){
            console.error(error.message);
        }
        // setLoading(false)
    }



    



useEffect(()=>{
    getTransactions()
    generateSchedule()

        },[update,loanId])

    

let totalDue = loanDetail.loanAmount * (1 + Number(loanDetail.interestRate))



//function generate payment schedule
function generateSchedule(){
    let totalPeriods = loanDetail.periods
    let totalInterest = loanDetail.interestRate
    let date = loanDetail.date
    let paid = transactions.filter((obj)=> {return obj.loanId ===loanId }).sort(function(a,b){return a.period-b.period})
    console.log(`inside generateSchedule Function ${totalInterest}`)
    let paymentAmount = loanDetail.paymentAmount
    let emptyArray = [];
    for (let i=1; i<=totalPeriods ; i++){
            let foundOne = paid.find(elem => elem.period===i)
            if(foundOne){
                emptyArray.push(foundOne)
              
        
            }else{
                const d = new Date(date);
                d.setDate(d.getDate(date)+((7*i)))
                emptyArray.push({_id: i+loanId, loanId: loanId, date: d.toDateString() ,period: i, paymentAmount: paymentAmount,status: ""})
                
            }               
            }
            setSchedule(prevState=> emptyArray)
            dispatch(changeGenerateSchedule(schedule))
            setUpdate(false)
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
    let interest = loanDetail.interestRate
    let periods = loanDetail.periods
    let loanAmount = loanDetail.loanAmount



    console.log(interest, periods, loanAmount)

    const payload = {
        _id:transactionId,
        loanId: loanId , 
        period: period, 
        paymentAmount: loanDetail.paymentAmount,
        date: date,
    status: "Paid",
    }

    await axios.post(`http://localhost:8080/api/v1/loanTransactions`,payload)
    .then(resp =>{console.log(resp.data); generateSchedule()  })
    .catch(error =>{console.error(error); return Promise.reject(error)})

}

async function processPaymentInterest (period,date,payment){
    let interest = loanDetail.interestRate
    console.log(interest)
    let transactionId = String(loanId)+String(period)+"0001"
    const payload = {
        _id:transactionId,
        loanId: loanId , 
        period: period, 
        paymentAmount: loanDetail.interestRate*100, 
        date: date,
    status: "Interest",
    }

    await axios.post(`http://localhost:8080/api/v1/loanTransactions`,payload)
    .then(resp =>{console.log(resp.data); generateSchedule()  })
    .catch(error =>{console.error(error); return Promise.reject(error)})
    setUpdate(true)

}


            function handlePayment(client_Id,period,date,payment){
                processPayment(client_Id,period,date,payment) 
                setUpdate(true)
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
                    await axios.post(`http://localhost:8080/api/v1/loanTransactions`,payload)
                    .then(resp =>{console.log(resp.data); generateSchedule()  })
                    .catch(error =>{console.error(error); return Promise.reject(error)})
              }
    

              async function handleCustomSubmit(event){
                let transactionId = String(loanId)+String(customFormValues.period)
                event.preventDefault()
                //yyyy-mm-dd
                let year = customFormValues.date.slice(0,4)
                let month = customFormValues.date.slice(5,7)
                let day = customFormValues.date.slice(8,10)
                let formatedDate =year+"-"+month+"-"+day
                    const payload =
                    {   
                        _id:transactionId,
                        loanId: customFormValues.loanId,
                        paymentAmount: Number(customFormValues.paymentAmount), 
                        date: formatedDate,
                        period: customFormValues.period,
                        status: customFormValues.status} 
                        //AxiosPost
                        await axios.post(`http://localhost:8080/api/v1/loanTransactions`,payload)
                        .then(resp =>{console.log(resp.data); generateSchedule()  })
                        .catch(error =>{console.error(error); return Promise.reject(error)})
                  }
        



return(
        <Fragment>

<h1>Summary</h1>
    <table id="customers">  
        <thead>
            <tr>
                <th>Payments Lefts</th>
                <th>Balance </th>
                <th>Total Interest Only Payments</th>
                <th>Payments Recieved</th>
            </tr>
        </thead>

        <tbody>
                   <tr>
                   <td>{((loanDetail.loanAmount * (1+ loanDetail.interestRate)) /loanDetail.paymentAmount)  - (schedule.filter(function(obj){return obj.status=="Paid"}).length)}</td>
                   <td>{totalDue -(transactions.filter(function(obj){return obj.loanId===loanId}).filter(function(obj){return obj.status==="Paid"}).reduce((prev,curr)=> prev+curr.paymentAmount ,0))}</td>
                    <td>{transactions.filter(function(obj){return obj.loanId===loanId}).filter(function(obj){return obj.status==="Interest"}).reduce((prev,curr)=> prev+curr.paymentAmount ,0)}</td>
                    <td>{transactions.filter(function(obj){return obj.loanId===loanId}).filter(function(obj){return obj.status==="Paid"}).reduce((prev,curr)=> prev+curr.paymentAmount ,0)}</td> 
                </tr>
            
            
        </tbody>
        </table> 
            <button onClick={()=>generateSchedule()}>Generate Table</button>
    <h1>Payment Schedule: {loanDetail.firstName} {loanDetail.lastName}</h1> 
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
                let currWeek = convertToWeek(item.date) ===currentWeek ? "#04AA6D":""
                return( 
                    <tr key={item._id}  style={{backgroundColor:currWeek}}> 
                     <td>{item.loanId}</td>
                    <td>{item.period}</td>
                    <td>{item.date}</td>
                    <td>{item.paymentAmount}</td>
                    <td>{item.status!=="" ? item.status : convertToWeek(item.date) === currentWeek ? 'Due' : item.status}</td>
                    <td>{item.status!=="Paid" && <button onClick={()=>handlePayment(item.loanId,item.period,item.date,item.paymentAmount)}>Payment</button>}
                    {item.status!=="Paid" && <button onClick={()=>processPaymentInterest(item.period,item.date,item.paymentAmount)}>Interest</button>}</td>

                </tr>
            
    )})} 
      
      
       </tbody> 
       
    </table>
    </form>

                    
    <h1>Custom Transaction</h1>
    <form onSubmit={handleCustomSubmit}>

    <table  id="customers">
        <thead>
            <tr>
                <th>Client Id</th>
                <th>Period</th>
                <th>Date</th>
                <th>Payment Due</th>
                <th>Status</th> 
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
                    <td>{item.status}</td>



                </tr>
            
            )})} 
       <tr>
             
                    <td><input name="loanId" type='text' placeholder="loanId"  value={customFormValues.loanId} onChange={handleCustomInputChange}/></td>
                    <td><input style={{"width":70}} name="period" type='text' placeholder="Period" value={customFormValues.period} onChange={handleCustomInputChange} /></td>
                    <td><input name="date" type='date' value={customFormValues.date} onChange={handleCustomInputChange}/></td>  
                    <td><input name="paymentAmount" type='number' placeholder="Payment Amount"  value={customFormValues.paymentAmount} onChange={handleCustomInputChange} /></td>
                    <td><input name="status" type='text' placeholder="Status"  value={customFormValues.status} onChange={handleCustomInputChange} /></td>

                    <td>    <button type="submit">Add + </button>
</td>
                    </tr>
      
       </tbody>
        
    </table>
            </form>
    
    </Fragment>
    )




                

}