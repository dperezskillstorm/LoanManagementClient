import React, { Fragment, useState } from 'react'
import "./table.css"
import axios from 'axios';
import Button from './button';
import { useAppContext } from '../context/appContext';
import { mutate } from 'swr';




export default function PaymentTableSummary({accountData, data, handleRefresh}){





    const StatusOptions = [
      
        {value: "-", text:"Select"},
        {value: "Paid", text:"Paid"},
        {value: "Interest", text:"Interest"},
        {value: "Draw", text:"Draw"}, 
      
]
 
    const [isLoading,setIsLoading] = React.useState(false)
    const [activeRow, setActiveRow] = React.useState(null)
    const transactions = data
    const loanDetails = accountData;

    const defaultValues = {   _id: "",
    paymentAmount: "",
    date: "",
    period: "",
    loanId: "",
    status:""
}


      const [customFormValues, setCustomFormValues] = React.useState({
        _id: "",
            paymentAmount: "",
            date: "",
            period: "",
            loanId: "",
            status:""
      })

 
      const handleCustomInputChange = (e) => {
        const { name, value } = e.target;
        setCustomFormValues({
          ...customFormValues,
          [name]: value,
      
        })
        console.log(customFormValues)
        ;
      };

   

      const [currentPeriod,setCurrentPeriod] = React.useState(1)


              async function handleCustomSubmit(event){
                setIsLoading(true)
                var maxNumber = transactions.length===0 ? 0 : transactions.reduce(function(prev,cur) {
                    return prev > cur.period ? prev : cur.period;
                }, -Infinity);
                setCurrentPeriod(maxNumber+1)
                let transactionId = String(loanDetails._id)+String(Number(maxNumber +1))
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
                        period: Number(maxNumber +1),
                        status: customFormValues.status} 

                     

                        //AxiosPost
                        await axios.post(`http://localhost:8080/api/v1/loanTransactions`,payload)
                        .then(resp =>{console.log(resp.data)})
                        .then(setTimeout(()=> {
                            setIsLoading(false)
                            handleRefresh(payload.loanId)
                        }
                            ,700))
                        .then(setCustomFormValues(defaultValues))
                    
                        .catch(error =>{console.error(error); return Promise.reject(error)})
                  }

            //Deletes Data from form using axios delete
  async function handleDelete (key){
    setIsLoading(true)
    setActiveRow(key)
    await axios.delete(`http://localhost:8080/api/v1/loanTransactions/${key}`)
    .then(setTimeout(()=>{
        setIsLoading(false)
        setActiveRow(null)
        handleRefresh()


    },500))
    .catch(error =>{console.error(error); return Promise.reject(error)})

}

const handleButton = () =>{
    console.log("handleBUtton")
}
        



return(
        <Fragment>
            <div className='paymentTable'>
    {/* <h1 >Payment Schedule: {loanDetails.firstName} {loanDetails.lastName}</h1>  <button onClick={"handleShowMore"}>Show More</button>          */}
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
             <td><input style={{"width":70}} name="period" type='text'   value={"-"} onChange={handleCustomInputChange} /></td>
             <td><input name="date" type='date' value={customFormValues.date} onChange={handleCustomInputChange}/></td>  
             <td><input name="paymentAmount" type='number' placeholder="Payment Amount"  value={customFormValues.paymentAmount} onChange={handleCustomInputChange} /></td>
             <td>
            <select required="true" name="status" defaultValue={customFormValues.status} onChange={handleCustomInputChange}>
        {StatusOptions.map(option => (
            <option key={option.value} value={option.value}>
            {option.text}
            </option>))}
        </select>
      </td>

             <td>    <button type="submit" disabled={isLoading} style={{backgroundColor: (isLoading && activeRow=== null) ?"red":""}}>Add + </button>
</td>
             </tr>
        </thead>
        <tbody>
         
             {transactions.slice(0,100).sort((a,b)=> b.period - a.period).map((item) => {
                return( 
                    <tr key={item._id}> 
                     <td>{item.loanId}</td>
                    <td>{item.period}</td>
                    <td>{item.date}</td>
                    <td>{item.paymentAmount}</td>
                    <td>{item.status}</td>
                    <td><button onClick={()=>handleDelete(item._id,item.loanId)} style={{backgroundColor:(isLoading && activeRow===item._id) ? "red": ""}} disabled={isLoading}>Delete</button></td>
                  



                </tr>
            
            )})} 
 
      
       </tbody>
        
    </table>
            </form>

            </div>
    
    </Fragment>
    )




                

}