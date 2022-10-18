import React from 'react'

 export default function DeleteButton({_id, handleDelete}){
    return(
        <button type='button' onClick={()=>handleDelete(_id)}>Delete</button>
    )

}