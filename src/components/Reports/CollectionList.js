import React, { useEffect } from 'react'
import axios from 'axios'
import { current } from '@reduxjs/toolkit'




function CollectionList(props) {
    const [data, setData] = React.useState([])
    const [transactions, setTransactions] = React.useState([])
    const [currentWeek, setCurrentWeek] = React.useState()
    const today = new Date()
    


    // const data =[ 
//     {
//         name:'david',
         
//         details: [{
//             info: 1,
//             email: 2,
//             phone:3,
//             add:4}]
//     },
//     {
//         name:'mike', 
//         details: [{
//             info: 1,
//             email: 2,
//             phone:3,
//             add:4}]
//     },

//     {
//         name:'doc', 
//         details: [{
//             info: 1,
//             email: 2,
//             phone:3,
//             add:4}]
//     }
// ]


    const getData = async() =>{
        // setLoading(false);
        try{
            const res = await axios.get(`http://localhost:8080/api/v1/loanDetails/`)
            .then(res=> {setData(res.data)})
            // .then(console.log(data))
        }catch(error){
            console.error(error.message);
        }
    // setLoadingData(true)
    
        }
    
        const getTransactions = async() =>{
            // setLoading(false);
            try{
                const res = await axios.get(`http://localhost:8080/api/v1/loanTransactions/`)
                .then(res=> setTransactions(res.data))
            
            }
            catch(error){
                console.error(error.message);
            }
            return transactions
        // setLoadingTrans(true)
    
            }


    useEffect(()=>{
        getTransactions()
        getData()
        

        
    },[])



    function convertToWeek(date){
        const today = new Date(date)
        var fiscalStartDate = new Date(2022,1,1)
        const dateDiff = Math.abs(today-fiscalStartDate);
        const weeks =  Math.floor((dateDiff/8.64e7)/7);
        return weeks
    }

    React.useEffect(()=>{
        const today = new Date()
        var fiscalStartDate = new Date(2022,1,3)
        const dateDiff = Math.abs(today-fiscalStartDate);
        const weeks =  Math.floor((dateDiff/8.64e7)/7);
        setCurrentWeek(weeks)
    },[])


    const [combinedData,setCombinedData] =React.useState([])

    function matchData(){
        // console.log(`this week is ${currentWeek}`)
        let array = []
            // console.log(convertToWeek(transaction.date))
            for (let i = 0;i<data.length-1; i++){
                if(data[i].status === "Active" && data[i].assignedTo === "Cristina"){
                    console.log(data[i].status)
                    let paymentsReceived = transactions.filter(function(obj){return obj.loanId===data[i]._id}).filter(function(obj){return obj.status==="Paid"}).reduce((prev,curr)=> prev + curr.paymentAmount,0)
                    let name = data[i].firstName +" " + data[i].lastName
                    let status = data[i].status
                    let totalDue = data[i].loanAmount * (1+ Number(data[i].interestRate))
                    let paymentLeft = (totalDue-paymentsReceived)/data[i].paymentAmount
                    let row = {name: name, status: status, paymentLeft: paymentLeft}
                    array.push(row)
             

                } else{
                    
                }
            
            }
            console.log(array)
            setCombinedData(array)
        

        }
         
return (
    <>
    {/* <table id="customers">
        <tr>
            <thead>
                <th>Collected This Week</th>
                <th>Interest Only</th>
                <th>Estimated Return </th>
            </thead>
            <tbody>
                <tr>
                    <td>{combinedData.reduce((prev,curr)=> prev + curr.payment,0)}</td>
                    <td>{combinedData.filter(function(obj){return obj.status==="Interest"}).reduce((prev,curr)=> prev + curr.payment,0)}</td>
                    <td>{combinedData.reduce((prev,curr)=> prev + curr.payment,0) * 0.25}</td>


                </tr>
            </tbody>
        </tr>
    </table> */}
    <button onClick={()=>{matchData()}}>Click</button>
    <h2>{today.toDateString()}</h2>
    <h3>Current Week: {currentWeek}</h3>
    
        <table id="customers">
        <thead>
            <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Payments Left</th>
              
            </tr>
        </thead>
    {console.log(combinedData)}
    {combinedData.map((data)=> {
        return(
            <tbody>
                <tr>
                    <td>{data.status}</td>
                    <td>{data.name}</td>
                    <td>{data.paymentLeft}</td>
                </tr>
                
            </tbody>)
    })} 
     </table> 
    
    </>)


    

}           
    
    export default CollectionList
