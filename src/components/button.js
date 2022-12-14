import React from 'react'
//not working yet



const Button = (props) => {
   const item = props.item
   const isLoading = props.isLoading
   const activeRow = props.activeRow
   const handleDelete = props.handleDelete()
  return (
    <button onClick={ ()=>handleDelete(item.id)} style={{backgroundColor:(isLoading && activeRow===item.id) ? "red": ""}} disabled={isLoading}>Delete</button>

  )
}

export default Button



