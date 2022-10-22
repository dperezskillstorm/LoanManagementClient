import React, { useEffect, useState} from "react"
import DeleteButton from "../DeleteButton"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux";
import ClientLoanEdit from "./ClientLoanEdit"
import "../table.css"
import { changeLoanId } from "../../store/features/loanIdSlice";
import { changeLoanDetail } from "../../store/features/loanDetailSlice";
import ReadOnlyClientLoan from "./ReadOnlyClientLoan"

export default function LoanClients(){
    const dispatch = useDispatch()

    // const [loading, setLoading] = useState(true)
    
    //States
    const [data, setData] = useState([]);
    const [transactions, setTransactions] = useState([]);

    
    const [editRecordId, setEditRecordId] = useState(null)
    const[activeLoan, setActiveLoan] = useState(220)
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

      const [editFormData, setEditFormData] = useState({
        _id: "",
        loanAmount: "",
        date: "",
        period: "",
        interestRate: "",
        paymentAmount: "",
        firstName:"",
        lastName: "",
        status:""
      
      })

//Functions
    //consumes data from database
    //Not using loading since it results are to quick
    const getData = async() =>{
        // setLoading(false);
        try{
            const {data: response } = await axios.get('http://localhost:8080/api/v1/loanDetails')
            setData(response)
        }catch(error){
            console.error(error.message);
        }
        // setLoading(false)
    }

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

  //Summary Section for Manager
  const totalLoansOut = data.filter(function(obj){return obj.status !=="Closed"}).reduce((prev,curr)=> prev+curr.loanAmount ,0)
  const expectedReturnOnAsset = data.filter(function(obj){return obj.status !=="Closed"}).reduce((prev,curr)=> prev+(curr.loanAmount * (1 + Number(curr.interestRate))) ,0)
  const ROI = (data.filter(function(obj){return obj.status !=="Closed"}).reduce((prev,curr)=> prev+(curr.loanAmount * (1 + Number(curr.interestRate))) ,0)/ data.filter(function(obj){return obj.status !=="Closed"}).reduce((prev,curr)=> prev+curr.loanAmount ,0) - 1) *100
  const paymentRecieved = transactions.filter(function(obj){return obj.status ==="Paid"}).reduce((prev,curr)=> prev+curr.paymentAmount ,0)
  const interestOnlyPayments = transactions.filter(function(obj){return obj.status ==="Interest"}).reduce((prev,curr)=> prev+curr.paymentAmount ,0)


//Populates Data on mount
    React.useEffect(()=>{ 
        //Get Api
        getData();
        getTransactions();
    },[])



    //Deletes Data from form using axios delete
  async function handleDelete (key){
    await axios.delete(`http://localhost:8080/api/v1/loanDetails/${key}`)
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
            paymentAmount: formValues.paymentAmount,
            interestRate:formValues.interestRate ,  
            firstName: formValues.firstName,
            lastName: formValues.lastName, 
            status: "Active"} 
            //AxiosPost
            const resp = await axios.post(`http://localhost:8080/api/v1/loanDetails/`, payload)
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


  //handles edit updates
const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
  
    });
  };



  const handleEditClick = (event,row)=>{
    event.preventDefault()
    setEditRecordId(row._id);
    setEditFormData({
      _id:row._id,
      loanAmount: row.loanAmount,
      date: row.date,
      period: row.periods,
      interestRate: row.interestRate,
      paymentAmount:row.paymentAmount,
      firstName:row.firstName,
      lastName: row.lastName,
      status: row.status
    })
  }
    
  

  const handleSaveClick = async (event,row) =>{
    event.preventDefault()
    //yyyy-mm-dd
    let year = editFormData.date.slice(0,4)
    let month = editFormData.date.slice(5,7)
    let day = editFormData.date.slice(8,10)
    let formatedDate =year+"-"+month+"-"+day
        const payload =
        // {   
        //     _id: row._id,
        //     date: formatedDate,
        //     loanAmount: Number(editFormData.loanAmount), 
        //     periods: editFormData.period,
        //     paymentAmount: editFormData.paymentAmount,
        //     interestRate:editFormData.interestRate ,  
        //     firstName: editFormData.firstName,
        //     lastName: editFormData.lastName, 
        //     status: "Active"} 

            {
              _id: row._id,
              loanAmount: Number(editFormData.loanAmount),
              paymentAmount: editFormData.paymentAmount,
              date: formatedDate,
              periods: editFormData.period,
              interestRate: editFormData.interestRate,
              firstName: editFormData.firstName,
              lastName: editFormData.lastName,
              status: editFormData.status
          }

    
            console.log(payload)
            // AxiosPatch
            const url = `http://localhost:8080/api/v1/loanDetails/${row._id}`
            console.log(url)
            const resp = await axios.patch(url, payload, {
              headers: { 
                'Access-Control-Allow-Origin' : '*',
              },
            })
            .then(resp =>{console.log(resp.data); getData()  })
            .then( setEditRecordId(null))
            .catch(error =>{console.error(error); return Promise.reject(error)}) 
               
      }



  //select active user on row click
  // and sets it to state
  function activeLoanHandle(item){
    setActiveLoan(item._id)
    dispatch(changeLoanId(item._id))
    localStorage.setItem("loanId", JSON.stringify(item._id))
    dispatch(changeLoanDetail({...item}))



  }

    return(
        <>
<table id="customers">
        <thead>
            <tr>
              <th>Original Loan Amounts</th>
              <th>ROI</th>
              <th>Payment Recieved</th>
            </tr>
            </thead>
          <tbody>
            <tr> 
              <td>{totalLoansOut}</td>
              <td>{ROI}</td>
               <td>{paymentRecieved}</td>
            </tr>
   
        </tbody>
        <thead>
            <tr>
              <th>Total Interest Only Payments</th>
              <th>Actual Assets Out</th>
              <th>Expected Return on Assets</th>
        
            </tr>
            </thead>
          <tbody>
            <tr> 
              <td>{interestOnlyPayments}</td>
              <td>{totalLoansOut-paymentRecieved}</td>
              <td>{expectedReturnOnAsset}</td>
           
            </tr>
   
        </tbody>
    </table>


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
                <th>Payments Amount</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Interest Rate</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Action</th>

            </tr>
            </thead>

        <tbody>
            
             {data.filter(function(obj){return obj.status!=="Closed"}).map((item) => {
              let active = item._id === activeLoan ? "#04AA6D":"";
                return( 
                    <>
                    <tr key={item._id} onClick={()=>activeLoanHandle(item)} style={{backgroundColor: active}}>
                    {editRecordId ===  item._id ?
                   
          
          <ClientLoanEdit row={item} editFormData={editFormData} handleInputChange={handleEditInputChange} handleSaveClick={handleSaveClick} activeLoanHandle={activeLoanHandle}/>:
          <ReadOnlyClientLoan row={item}  handleEditClick={handleEditClick} handleDelete={handleDelete} item={item} activeLoanHandle={activeLoanHandle}/>
                    }
                    </tr>
             
                    </>
    )})}
            
              <tr>
              <td></td>

                    <td><input style={{"width":70}} name="period" type='text' placeholder="Period" value={formValues.period} onChange={handleInputChange} /></td>
                    <td><input style={{"width":70}} name="loanAmount" type='number' placeholder="Loan Amount"  value={formValues.loanAmount} onChange={handleInputChange} /></td>
                    <td></td>
                    <td><input name="paymentAmount" type='number' placeholder="Payment Amount"  value={formValues.paymentAmount} onChange={handleInputChange}/></td>

                    <td><input name="firstName" type='text' placeholder="First Name"  value={formValues.firstName} onChange={handleInputChange}/></td>
                    <td><input name="lastName" type='text' placeholder="Last Name"  value={formValues.lastName} onChange={handleInputChange}/></td>                   
                    <td><input style={{"width":70}} name="interestRate" type='text' placeholder="Interest Rate"  value={formValues.interestRate} onChange={handleInputChange} /></td> 
                    <td><input name="date" type='date' value={formValues.date} onChange={handleInputChange}/></td>  
                    <td></td>
                    <td>    <button type="submit">Add + </button>
</td>
                    </tr>
        </tbody>
    </table>
</form>


        </>
    )

}