import React, { useEffect, useState} from "react"
import DeleteButton from "./DeleteButton"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux";

import "./table.css"
import { changeLoanId } from "../store/features/loanIdSlice";


export default function LoanClients(){
    const dispatch = useDispatch()

    // const [loading, setLoading] = useState(true)
    
    //States
    const [data, setData] = useState([]);
    const[activeLoan, setActiveLoan] = useState(220)
    const [formValues, setFormValues] = React.useState({
        _id: "",
            loanAmount: "",
            date: "",
            period: "",
            interestRate: "",
            firstName:"",
            lastName: "",
            status:false
      })

//Functions
    //consumes data from database
    //Not using loading since it results are to quick
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


//Populates Data on mount
    React.useEffect(()=>{ 
        //Get Api
        getData();
    },[])


    //Deletes Data from form using axios delete
  async function handleDelete (key){
    await axios.delete(`http://localhost:9090/api/v1/loanDetails/${key}`)
    .then(resp =>{console.log(resp.data); getData()  })
    .catch(error =>{console.error(error); return Promise.reject(error)})

}

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
            interestRate:formValues.interestRate ,  
            firstName: formValues.firstName,
            lastName: formValues.lastName, 
            status: "Active"} 
            //AxiosPost
            const resp = await axios.post(`http://localhost:9090/api/v1/loanDetails/`, payload)
            .then(resp =>{console.log(resp.data); getData()  })
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

  //select active user on row click
  // and sets it to state
  function activeLoanHandle(key){
    setActiveLoan(key)
    dispatch(changeLoanId(key))
    localStorage.setItem("loanId", JSON.stringify(key))

  }

    return(
        <>
              <h1> Loan loanDetails</h1>
              <h1>Active Loan: {activeLoan ? activeLoan: "Pick the loan"}</h1>
<form onSubmit={handleSubmit}>
    <table id="customers">
        <thead>
            <tr>
                <th>Loan#</th>
                <th>Period</th>
                <th>Loan Amount</th>
                <th>Total Due</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Interest Rate</th>
                <th>Start Date</th>
                <th>Action</th>

            </tr>
            </thead>

        <tbody>
             {data.filter(function(obj){return obj.status==="Active"}).map((item) => {
                return( 
                    <tr onClick={()=>activeLoanHandle(item._id)}  key={item._id}>
                    <th>{item._id}</th>
                    <td>{item.periods}</td>
                    <td>{item.loanAmount}</td>
                    <td>{item.loanAmount * (1+ item.interestRate)}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.interestRate}</td>
                    <td>{item.date}</td>
                    <td><DeleteButton handleDelete={()=>handleDelete(item._id)} /></td>
                    </tr>
    )})}
            
              <tr>
              <td></td>

                    <td><input style={{"width":70}} name="period" type='text' placeholder="Period" value={formValues.period} onChange={handleInputChange} /></td>
                    <td><input name="loanAmount" type='number' placeholder="Loan Amount"  value={formValues.loanAmount} onChange={handleInputChange} /></td>
                    <td><input name="firstName" type='text' placeholder="First Name"  value={formValues.firstName} onChange={handleInputChange}/></td>
                    <td><input name="lastName" type='text' placeholder="Last Name"  value={formValues.lastName} onChange={handleInputChange}/></td>                   
                    <td><input name="interestRate" type='text' placeholder="Interest Rate"  value={formValues.interestRate} onChange={handleInputChange} /></td> 
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