import React, { useEffect, useState} from "react"
import DeleteButton from "../DeleteButton"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux";
import ClientLoanEdit from "./ClientLoanEdit"
import "../table.css"
import { changeLoanId } from "../../store/features/loanIdSlice";
import { changeLoanDetail } from "../../store/features/loanDetailSlice";
import ReadOnlyClientLoan from "./ReadOnlyClientLoan"

export default function AddNewLoan(){
    const dispatch = useDispatch()

    // const [loading, setLoading] = useState(true)
    
    //States
    const [data, setData] = useState([]);
    const [transactions, setTransactions] = useState([]);

    
    const [formValues, setFormValues] = React.useState({
        _id: "",
            loanAmount: "",
            date: "",
            period: "",
            interestRate: "",
            paymentAmount: "",
            firstName:"",
            lastName: "",
            status:false
      })






//Populates Data on mount
    React.useEffect(()=>{ 
        //Get Api
    },[])

    //Submits Data from Form to Axios Post
    async function handleSubmit(event){
    event.preventDefault()
    //yyyy-mm-dd
    let year = formValues.date.slice(0,4)
    let month = formValues.date.slice(5,7)
    let day = formValues.date.slice(8,10)
    let formatedDate =year+"-"+month+"-"+day
        const payload =
        {   
            loanAmount: Number(formValues.loanAmount), 
            date: formatedDate,
            periods: formValues.period,
            paymentAmount: formValues.paymentAmount,
            interestRate:formValues.interestRate ,  
            firstName: formValues.firstName,
            lastName: formValues.lastName, 
            status: "Active"} 
            //AxiosPost
            const resp = await axios.post(`http://localhost:8080/api/v1/loanDetails/`, payload)
            .then(resp =>{console.log(resp.data) })
            .then(resp =>{alert(`Added New Client: ${payload.firstName} ${payload.lastName} `)})
            .catch(error =>{console.error(error); return Promise.reject(error)})      
      }

//sets data from form to state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
  
    });
  };



    return(
        <>


              <h1> Loan loanDetails</h1>
<form onSubmit={handleSubmit}>
    <table id="customers">
        <thead>
            <tr>
                <th>Period</th>
                <th>Loan Amount</th>
                <th>Payments Amount</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Interest Rate</th>
                <th>Start Date</th>
                <th>Action</th>

            </tr>
            </thead>

        <tbody>
            
           
            
              <tr>

                    <td><input style={{"width":70}} name="period" type='text' placeholder="Period" value={formValues.period} onChange={handleInputChange} /></td>
                    <td><input style={{"width":70}} name="loanAmount" type='number' placeholder="Loan Amount"  value={formValues.loanAmount} onChange={handleInputChange} /></td>
                    <td><input name="paymentAmount" type='number' placeholder="Payment Amount"  value={formValues.paymentAmount} onChange={handleInputChange}/></td>

                    <td><input name="firstName" type='text' placeholder="First Name"  value={formValues.firstName} onChange={handleInputChange}/></td>
                    <td><input name="lastName" type='text' placeholder="Last Name"  value={formValues.lastName} onChange={handleInputChange}/></td>                   
                    <td><input style={{"width":70}} name="interestRate" type='text' placeholder="Interest Rate"  value={formValues.interestRate} onChange={handleInputChange} /></td> 
                    <td><input name="date" type='date' value={formValues.date} onChange={handleInputChange}/></td>  
                    <td>    <button type="submit">Add + </button>
</td>
                    </tr>
        </tbody>
    </table>
</form>


        </>
    )

}