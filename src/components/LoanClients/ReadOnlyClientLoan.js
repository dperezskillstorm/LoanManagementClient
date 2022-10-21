import React from "react"
import DeleteButton from "../DeleteButton"

export default function ReadOnlyClientLoan({activeLoanHandle,item,handleDelete,handleEditClick}){
return(
    <>
   
                    <th key={item._id}>{item._id}</th>
                    <td>{item.periods}</td>
                    <td>{item.loanAmount}</td>
                    <td>{item.loanAmount * (1+ item.interestRate)}</td>
                    <td>{item.paymentAmount}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.interestRate}</td>
                    <td>{item.date}</td>
                    <td>{item.status}</td>
                    <td><DeleteButton handleDelete={()=>handleDelete(item._id)} />
                    <button className='btn btn-success'  type="button" onClick={(event)=>handleEditClick(event,item)} >

                  Edit  
                </button>
                    </td>
                  
    
    
    </>
)


}