import React from 'react'
import { useAppContext } from '../context/appContext'

const Alert = () => {
   const {alertType,alertText} = useAppContext()

  return (
    <div className={`alert alert-${alertType}`}>{alertText || "Alert - Danger Will Robinson"}</div>
  )
}

export default Alert
