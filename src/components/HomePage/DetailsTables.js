import React from 'react'
import axios from 'axios'

function DetailsTables({data,transactions, handleRefresh}) {
    let totalPaid = transactions.filter(function(obj){return obj.status === "Paid"}).reduce((prev,curr)=> prev+curr.paymentAmount,0)
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
        {value: null, text:"Change"},
        {value: "David", text:"David"},
        {value: "Cristina", text:"Cristina"},
      ]

   async function handleDelete (key){
    await axios.delete(`http://localhost:8080/api/v1/loanDetails/${key}`)
    .then(resp =>{console.log(resp.data) })
    .then(resp => alert(`Deleted Client:${key}`))
    .catch(error =>{console.error(error); return Promise.reject(error)})

    window.location.reload()

}

const handleAssignTo = async (row) =>{
    const payload =
        {
          _id: row._id,
          loanAmount: Number(row.loanAmount),
          paymentAmount: row.paymentAmount,
          date: row.date,
          periods: row.periods,
          interestRate: row.interestRate,
          firstName: row.firstName,
          lastName: row.lastName,
          status: row.status,
          assignedTo: customFormValues.assignedTo
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
        .then(resp =>{console.log(resp.data); window.location.reload() })
        .catch(error =>{console.error(error); return Promise.reject(error)}) 
           
  }


const handleStatus = async (row,status) =>{
        const payload =
            {
              _id: row._id,
              loanAmount: Number(row.loanAmount),
              paymentAmount: row.paymentAmount,
              date: row.date,
              periods: row.periods,
              interestRate: row.interestRate,
              firstName: row.firstName,
              lastName: row.lastName,
              status: status
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
            .then(resp =>{console.log(resp.data); window.location.reload() })
            .catch(error =>{console.error(error); return Promise.reject(error)}) 
               
      }





  return (


    <div className="Info-Table" style={{width:1000,height:200}}>
         
                     <table  id="customers">
                    <thead>
                <tr>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>InterestRate</th>
                    <th>Terms</th>
                    <th>Assigned</th>
                </tr>
                </thead>

<tbody>
                <tr>
                    <td>{data.status}</td>
                    <td>{data.loanAmount}</td>
                    <td>{data.interestRate}</td>
                    <td>{data.periods}</td>
                    <td><div>{data.assignedTo}</div>
                    <div>       <select required="true" name="assignedTo" value={customFormValues.assignedTo} onChange={handleCustomInputChange}>
        {StatusOptions.map(option => (
            <option key={option.value} value={option.value}>
            {option.text}
            </option>))}
        </select>  </div>
                        
                    

                            </td>

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
                    <td><button onClick={()=>handleDelete(data._id)}> Delete </button>
                    <button onClick={()=>handleStatus(data,"Closed")}> Close </button>
                    <button onClick={()=>handleStatus(data,"Pause")}> Pause </button>
                    <button onClick={()=>handleAssignTo(data)}> Change</button>
                    </td>

                </tr>
                </tbody>
                <thead>
                    <tr>
                        <th>Payment Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{data.paymentAmount}</td>
                    </tr>
                </tbody>


                </table>
              




    </div>
      
    
  )
}

export default DetailsTables
