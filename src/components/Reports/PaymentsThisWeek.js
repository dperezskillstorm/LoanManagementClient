import React, { useEffect } from 'react'
import axios from 'axios'
import { current } from '@reduxjs/toolkit'




function PaymentsThisWeek(props) {
    const [data, setData] = React.useState([])
    const [transactions, setTransactions] = React.useState([])
    const [currentWeek, setCurrentWeek] = React.useState()
    


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



    function convertToWeek(customDate){
 
        const today = new Date(customDate)
        var fiscalStartDate = new Date(today.getFullYear(),0,1)
        const dateDiff = Math.floor((today - fiscalStartDate)/(24*60*60*1000));
        // const weeks =  Math.floor((dateDiff/8.64e7)/7);
        const weeks =  Math.ceil((today.getDay()+ dateDiff)/7);
        return weeks

}

function convertToYear(customDate){
 
    const today = new Date(customDate)
    return today.getFullYear()

}


    React.useEffect(()=>{
        const today = new Date()
        var fiscalStartDate = new Date(today.getFullYear(),0,1)
        const dateDiff = Math.floor((today - fiscalStartDate)/(24*60*60*1000));
        // const weeks =  Math.floor((dateDiff/8.64e7)/7);
        const weeks =  Math.ceil((today.getDay()+ 1+ dateDiff)/7);
        setCurrentWeek(weeks)
    },[])


    const [combinedData,setCombinedData] =React.useState([])

    function matchData(){
        // console.log(`this week is ${currentWeek}`)
        let array = []
            // console.log(convertToWeek(transaction.date))
            for (let i = 0;i<transactions.length; i++){
                if((convertToWeek(transactions[i].date) === currentWeek)&& (convertToYear(transactions[i].date)===2022)){
                    console.log(convertToWeek(transactions[i].date))
                    console.log(convertToYear(transactions[i].date))
                    let payment = transactions[i].paymentAmount
                    let date = transactions[i].date
                    let week = convertToWeek(date)
                    let name = data.filter(function(obj){return obj._id ===transactions[i].loanId })
                    let status = transactions[i].status
                    let row = {interestRate: name[0].interestRate ,loanNum: transactions[i].loanId, firstName: name[0].firstName, lastName: name[0].lastName, payment:payment, status: status, date: date, week:week}
                    array.push(row)
             

                } else{
                    console.log(`week does not match ${transactions[i].date}`)
                }
            
            }
            setCombinedData(array)
        

        }
         
return (
    <>
    <table id="customers">
        <tr>
            <thead>
                <th>This Week</th>
                <th></th>
                <th></th>
                <th style={{backgroundColor:"cornflowerblue"}}>Total</th>
                <th style={{backgroundColor:"cornflowerblue"}} ></th>
                <th style={{backgroundColor:"cornflowerblue"}}></th>
                <th style={{backgroundColor:"cornflowerblue"}}></th>
                <th style={{backgroundColor:"cornflowerblue"}}></th>

            </thead>
            <thead>
                <th>Collected This Week</th>
                <th>Interest Only</th>
                <th>Estimated Return </th>
                <th>Total Loans Out </th>
                <th>Total Estimated Returns </th>
                <th>Esimated ROI </th>
                <th>Extra Earnings Interest Only</th>
                <th>Total Balance</th>

            </thead>
            <tbody>
                <tr>
                    <td>{combinedData.reduce((prev,curr)=> prev + curr.payment,0)}</td>
                    <td>{combinedData.filter(function(obj){return obj.status==="Interest"}).reduce((prev,curr)=> prev + curr.payment,0)}</td>
                    <td>{combinedData.reduce((prev,curr)=> prev + curr.interestRate,0) * 100}</td>
                    <td>{data.reduce((prev,curr)=> prev + curr.loanAmount,0)}</td>
                    <td>{data.reduce((prev,curr)=> prev + curr.loanAmount * (1+ curr.interestRate),0)}</td>
                    <td>{data.reduce((prev,curr)=> prev + curr.loanAmount * (1+ curr.interestRate),0) -
                    data.reduce((prev,curr)=> prev + curr.loanAmount,0)}</td>
                    <td>{transactions.filter(function(obj){return obj.status ==="Interest"}).reduce((prev,curr)=> prev + curr.paymentAmount, 0)}</td>
                    <td>{data.reduce((prev,curr)=> prev + curr.loanAmount * (1+ curr.interestRate),0) -
                    transactions.filter(function(obj){return obj.status ==="Paid"}).reduce((prev,curr)=> prev + curr.paymentAmount, 0)}
                    </td>





                </tr>
            </tbody>
        </tr>
    </table>
    <button onClick={()=>{matchData()}}>Click</button>
    <h2>Current Week: {currentWeek}</h2>
        <table id="customers">
        <thead>
            <tr>
                <th>Loan Number</th>
                <th>Name</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Week</th>
            </tr>
        </thead>
    {console.log(combinedData)}
    {combinedData.map((data)=> {
        return(
       
            <tbody>
                <tr>
                    <td>{data.firstName} {data.lastName}</td>
                    <td>{data.loanNum}</td>
                    <td>{data.date}</td>
                    <td>{data.payment}</td>
                    <td>{data.status}</td>
                    <td>{data.week}</td>

    
                </tr>
                
            </tbody>)
    })} 
     </table> 
    
    </>)


    

}           
    
    export default PaymentsThisWeek
