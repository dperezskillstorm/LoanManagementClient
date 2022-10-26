import React, { Fragment, useEffect } from 'react'
import "./table.css"
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";




export default function PaymentTableSummary(props){
    const dispatch = useDispatch()
    let loanId = props.loanId
    let loanDetails = props.loanDetails
 
    const [currentWeek, setCurrentWeek] = React.useState();
    const transactions = props.transactions
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
    let interest = loanDetails.interestRate
    let periods = loanDetails.periods
    let loanAmount = loanDetails.loanAmount



    console.log(interest, periods, loanAmount)

    const payload = {
        _id:transactionId,
        loanId: loanId , 
        period: period, 
        paymentAmount: loanDetails.paymentAmount,
        date: date,
    status: "Paid",
    }

    await axios.post(`http://localhost:8080/api/v1/loanTransactions`,payload)
    .then(resp =>{console.log(resp.data);  })
    .catch(error =>{console.error(error); return Promise.reject(error)})

}

async function processPaymentInterest (period,date,payment){
    let interest = loanDetails.interestRate
    console.log(interest)
    let transactionId = String(loanId)+String(period)+"0001"
    const payload = {
        _id:transactionId,
        loanId: loanId , 
        period: period, 
        paymentAmount: loanDetails.interestRate*100, 
        date: date,
    status: "Interest",
    }

    await axios.post(`http://localhost:8080/api/v1/loanTransactions`,payload)
    .then(resp =>{console.log(resp.data);   })
    .catch(error =>{console.error(error); return Promise.reject(error)})

}


            function handlePayment(client_Id,period,date,payment){
                processPayment(client_Id,period,date,payment) 
           }


              async function handleCustomSubmit(event){
                let transactionId = String(loanDetails._id)+String(Number(transactions.length +1))
                event.preventDefault()
                //yyyy-mm-dd
                let year = customFormValues.date.slice(0,4)
                let month = customFormValues.date.slice(5,7)
                let day = customFormValues.date.slice(8,10)
                let formatedDate =year+"-"+month+"-"+day
                    const payload =
                    {   
                        _id:Number(transactionId),
                        loanId: Number(loanDetails._id),
                        paymentAmount: Number(customFormValues.paymentAmount), 
                        date: formatedDate,
                        period: Number(transactions.length +1),
                        status: customFormValues.status} 

                        //AxiosPost
                        await axios.post(`http://localhost:8080/api/v1/loanTransactions`,payload)
                        .then(resp =>{console.log(resp.data); props.handleRefresh()})
                        .catch(error =>{console.error(error); return Promise.reject(error)})
                  }

            //Deletes Data from form using axios delete
  async function handleDelete (key){
    await axios.delete(`http://localhost:8080/api/v1/loanTransactions/${key}`)
    .then(resp =>{console.log(resp.data); props.handleRefresh()  })
    .catch(error =>{console.error(error); return Promise.reject(error)})

}


        



return(
        <Fragment>
    <h1>Payment Schedule: {props.loanDetails.firstName} {props.loanDetails.lastName}</h1>           
   <form onSubmit={handleCustomSubmit}>

    <table  id="customers">
        <thead>
            <tr>
                <th>Client Id</th>
                <th>Period</th>
                <th>Date</th>
                <th>Payment Due</th>
                <th>Status</th> 
                <th>Actions</th>
            </tr>
            <tr>
             
             <td><input name="loanId" type='text' placeholder="loanId"  value={loanDetails._id} onChange={handleCustomInputChange}/></td>
             <td><input style={{"width":70}} name="period" type='text'   value={transactions.length+1} onChange={handleCustomInputChange} /></td>
             <td><input name="date" type='date' value={customFormValues.date} onChange={handleCustomInputChange}/></td>  
             <td><input name="paymentAmount" type='number' placeholder="Payment Amount"  value={customFormValues.paymentAmount} onChange={handleCustomInputChange} /></td>
             <td><input name="status" type='text' placeholder="Status"  value={customFormValues.status} onChange={handleCustomInputChange} /></td>

             <td>    <button type="submit">Add + </button>
</td>
             </tr>
        </thead>
        <tbody>
         
             {transactions.map((item) => {
                return( 
                    <tr key={item._id}> 
                     <td>{item.loanId}</td>
                    <td>{item.period}</td>
                    <td>{item.date}</td>
                    <td>{item.paymentAmount}</td>
                    <td>{item.status}</td>
                    <td><button onClick={()=>handleDelete(item._id)}>Delete</button></td>
                  



                </tr>
            
            )})} 
 
      
       </tbody>
        
    </table>
            </form>
    
    </Fragment>
    )




                

}