import React from 'react'
import axios from 'axios'

function DetailsTables({data,transactions, handleRefresh}) {
   let totalPaid = transactions.filter(function(obj){return obj.status === "Paid"}).reduce((prev,curr)=> prev+curr.paymentAmount,0)
   console.log(totalPaid)

   async function handleDelete (key){
    await axios.delete(`http://localhost:8080/api/v1/loanDetails/${key}`)
    .then(resp =>{console.log(resp.data) })
    .then(resp => alert(`Deleted Client:${key}`))
    .catch(error =>{console.error(error); return Promise.reject(error)})

    window.location.reload()

}


  return (


    <div className="Info-Table" style={{width:1000,height:200}}>
         
                     <table id="customers">
                    <thead>
                <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>InterestRate</th>
                    <th>Terms</th>
                    <th>Payment Amount</th>
                </tr>
                </thead>

<tbody>
                <tr>
                    <td>{data.firstName}</td>
                    <td>{data.loanAmount}</td>
                    <td>{data.interestRate}</td>
                    <td>{data.periods}</td>
                    <td>{data.paymentAmount}</td>
                </tr>
                </tbody>
                <thead>
                <tr>
                    <th>Start Date</th>
                    <th>Payments left</th>
                    <th>Total Paid</th>
                    <th>Total Due</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{data.date}</td>
                    <td>{((data.loanAmount* (1+data.interestRate))- totalPaid)/data.paymentAmount}</td>
                    <td>{totalPaid}</td>
                    <td>{data.loanAmount* (1+data.interestRate)}</td>
                    <td><button onClick={()=>handleDelete(data._id)}> Delete Account</button></td>


                </tr>
                </tbody>


                </table>
              




    </div>
      
    
  )
}

export default DetailsTables
