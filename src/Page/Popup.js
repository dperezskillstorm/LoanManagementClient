import React from 'react'
import "./popup.css"

function Popup(props) {
  console.log(props)
  return (props.show) ? (
    <div className='popup'>
      <div className='popup-inner'>
                <button onClick={()=>props.handleClosePopUp(false)} className='close-btn'>Close</button>
        {props.children}


      </div> 
    </div>
  ): "";

}

export default Popup
