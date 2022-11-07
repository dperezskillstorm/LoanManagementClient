import React from 'react'
import Popup from '../Page/Popup'


 export default function DeleteButton({ handleDelete}){
const [showOption, setShowOption] = React.useState(false);

    function confirmDelete(){
        console.log("do you want ot delte")
        setShowOption(true)
    
    }

    function handleDeleteInner(){
        handleDelete()
        setShowOption(false)


    }
    

   
    return(
        <>

        { !showOption &&
      
        <button type='button' onClick={confirmDelete}>Delete</button>
        }

{showOption &&
      
      <button type='button' style={{backgroundColor: "red"}} onClick={handleDeleteInner}>ConfirmDelete</button>
      }


        </>
    ) 
    }

