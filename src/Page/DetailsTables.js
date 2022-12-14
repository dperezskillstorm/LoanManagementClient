import React, { useEffect } from 'react'
import axios from 'axios'
import DeleteButton from '../components/DeleteButton'
import NotesInput from '../components/Form Parts/NotesInput'
import { useAppContext } from '../context/appContext'
import PaymentTableSummary from '../components/PaymentTableSummary'
import useSWR from 'swr'
function DetailsTables({ handleRefresh}) {
  const { loanAccounts,getActiveLoan,getLoanDetails, loanDetails, loanTransactions,getLoanTransactions, activeLoan} = useAppContext()
const [shouldFetch, setShouldFetch]= React.useState(true);
let accountUrl =  `http://localhost:8080/api/v1/loanDetails/${activeLoan}`
let transactionUrl =  `http://localhost:8080/api/v1/loanTransactions/loanNumber/${activeLoan}`


const fetcher = (...args) => fetch(...args).then(res => res.json()).catch(err=>console.log(`error: ${err}`))
const {data, error} =useSWR(accountUrl,fetcher)
const transactionFetcher = (...args) => fetch(...args).then(res => res.json()).catch(err=>console.log(`error: ${err}`))
const {data: transactionData, error: transactionsError} =useSWR(shouldFetch ? transactionUrl :null,transactionFetcher)



  
  const handleClick = () =>{
      setShouldFetch(false)
      setTimeout(()=>{
        setShouldFetch(true)
      },400)
  }



    const [customFormValues,setCustomFormValues] = React.useState({
            assignedTo: ""
})

    const handleCustomInputChange = (e) => {
        const { name, value } = e.target;
        setCustomFormValues({
          ...customFormValues,
          [name]: value,
      
        });
      };



      const StatusOptions = [
        {value: null, text:"↓↓↓"},
        {value: "David", text:"David"},
        {value: "Cristina", text:"Cristina"},
      ]

   async function handleDelete (key){
    
    await axios.delete(`http://localhost:8080/api/v1/loanDetails/${key}`)
    .then(resp =>{console.log(resp.data) })
    .then(resp => { alert(`Deleted Client:${key}`);
    console.log(loanAccounts)
                   handleRefresh()
                  })
    .catch(error =>{console.error(error); return Promise.reject(error)})



}


if (error && transactionsError) return "Error"
if(!data && !transactionData) return "Loading"

if(data && transactionData){
  let totalPaid = transactionData.filter(function(obj){return obj.status === "Paid"}).reduce((prev,curr)=> prev+curr.paymentAmount,0)
  let totalDraws = transactionData.filter(function(obj){return obj.status === "Draw"}).reduce((prev,curr)=> prev+curr.paymentAmount,0)
  let totalDue = totalDraws * (1 + data.interestRate)


return (
  <>
  <table id='customers'>
  <thead>
    <tr>
      <th>Name</th>
      <th>Draws</th>
      <th>Original LoanAmount</th>
      <th>Interest Rate</th>
      <th>Total Due</th>
      <th>Status</th>

    </tr>
  </thead>
  <tbody>
    <tr>
      <td> {data.firstName}, {data.lastName}</td>
      <td>{totalDraws}</td>
      <td>{data.loanAmount}</td>
      <td>{data.interestRate}</td>
      <td>{totalDue}</td>
      <td>{data.status}</td>
    </tr>
  </tbody>
  <thead>
    <tr>
      <th>Periods</th>
      <th>Assigned To</th>
      <th>Paid to Date</th>
      <th>Balance</th>
      <th>Payments Left</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td> {data.periods}</td>
      <td>{data.assignedTo}</td>
      <td>{totalPaid}</td>
      <td>{totalDue - totalPaid}</td>
      <td>{(totalDue - totalPaid) /data.paymentAmount}</td>
      <td> <button onClick={()=>handleDelete(data._id)}>delete</button></td>
    </tr>
  </tbody>
  <thead>
    <th colSpan={5}>Notes</th>
    <th>Update Notes</th>
  </thead>
  <tbody>
    <td style={{height:30}} colSpan={5}>{data.notes}</td>
    <td><button>Update</button></td>
  </tbody>
  </table>
  <PaymentTableSummary accountData={data}data={transactionData}handleRefresh={handleClick}/>
  
  
  
  </>
 
)
}
}

export default DetailsTables
