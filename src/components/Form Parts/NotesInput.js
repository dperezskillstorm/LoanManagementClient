import React from 'react'
import axios from 'axios'

function NotesInput({data, colspan}) {
const [show, setShow] = React.useState(false)
const [customFormValues,setCustomFormValues] = React.useState({
    _id: 0,
    loanAmount: 0,
    paymentAmount: 0,
    date: "",
    periods: 0,
    interestRate: 0,
    firstName: "",
    lastName: "",
    status: "",
    assignedTo: "",
    notes:""
});

const [editFormData, setEditFormData] = React.useState({
    _id: 0,
    loanAmount: 0,
    paymentAmount: 0,
    date: "",
    periods: 0,
    interestRate: 0,
    firstName: "",
    lastName: "",
    status: "",
    assignedTo: "",
    notes: "add Notes"
  
  })

  const handleEditClick = (row)=>{
    setShow(true)
    setEditFormData({
        _id: row._id,
        loanAmount: row.loanAmount,
        paymentAmount: row.paymentAmount,
        date: row.date,
        periods: row.periods,
        interestRate: row.interestRate,
        firstName: row.firstName,
        lastName: row.lastName,
        status: row.status,
        assignedTo: row.assignedTo,
        notes: row.notes
    })
    setShow(true)
  }
    
  const handleChange = e => {
 
    const {name,value} = e.target;
    setCustomFormValues({
        ...customFormValues,
        [name] : value,
        });
  

    
  };

  const handleSubmit = async (event) =>{
    event.preventDefault();
    console.log(customFormValues.notes)
    const payload =
        {
          _id: data._id,
          loanAmount: Number(data.loanAmount),
          paymentAmount: data.paymentAmount,
          date: data.date,
          periods: data.periods,
          interestRate: data.interestRate,
          firstName: data.firstName,
          lastName: data.lastName,
          status: data.status,
          assignedTo: data.assignedTo,
          notes: customFormValues.notes
      }


        console.log(payload)
        // AxiosPatch
        const url = `http://localhost:8080/api/v1/loanDetails/${data._id}`
        console.log(url)
        const resp = await axios.patch(url, payload, {
          headers: { 
            'Access-Control-Allow-Origin' : '*',
          },
        })
        .then(resp =>{console.log(resp.data); setShow(false) })
        .catch(error =>{console.error(error); return Promise.reject(error)}) 
           
  }


        
        

    

  return (
    <>
                <td colspan="4" style={{ width: 700, height: 100 }}>
                {show ? 
                <form onSubmit={handleSubmit}>  
                    <textarea placeholder='Notes Here' name="notes" id="notes" defaultValue={editFormData.notes} onChange={handleChange} style={{ width: 700, height: 100 }}></textarea>
                    <button type='submit'>Submit</button>

                </form> :
               
                <>{data.notes}
                <br/>
                <button onClick={()=>handleEditClick(data)}>Edit</button>
                </>
}                        
                </td>
 

 
     
     </>  
    
  )
}

export default NotesInput
