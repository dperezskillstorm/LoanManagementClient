import React from 'react'

export default function ClientLoanEdit({editFormData,handleInputChange,handleSaveClick, row}){
    return(

        <>


    <td></td>
            
    <td><input style={{"width":70}} name="period" type='text' placeholder="Period" value={editFormData.period} onChange={handleInputChange} /></td>
    <td><input style={{"width":70}} name="loanAmount" type='number' placeholder="Loan Amount"  value={editFormData.loanAmount} onChange={handleInputChange} /></td>
    <td></td>
    <td><input name="paymentAmount" type='number' placeholder="Payment Amount"  value={editFormData.paymentAmount} onChange={handleInputChange}/></td>

    <td><input name="firstName" type='text' placeholder="First Name"  value={editFormData.firstName} onChange={handleInputChange}/></td>
    <td><input name="lastName" type='text' placeholder="Last Name"  value={editFormData.lastName} onChange={handleInputChange}/></td>                   
    <td><input style={{"width":70}} name="interestRate" type='text' placeholder="Interest Rate"  value={editFormData.interestRate} onChange={handleInputChange} /></td> 
    <td><input name="date" type='date' value={editFormData.date} onChange={handleInputChange}/></td>  
    <td><input name="status" type='text' value={editFormData.status} onChange={handleInputChange}/></td>  

    <td>    
    <button type="button" onClick={(event)=>handleSaveClick(event,row)} >
                  Save
                </button>
    </td>


        </>
    )
}