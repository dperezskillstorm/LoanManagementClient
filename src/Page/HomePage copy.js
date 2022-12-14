import React, { useEffect } from 'react'
import "./homepage.css"
import axios from "axios"
import PaymentTableSummary from '../components/PaymentTableSummary';
import DetailsTables from './DetailsTables';
import Popup from './Popup';
import AddNewLoan from '../components/LoanClients/AddNewLoan';
import PaymentsThisWeek from '../components/Reports/PaymentsThisWeek';
import CollectionList from '../components/Reports/CollectionList';


export default function HomePage(){
    const [tableLength, setTableLength] = React.useState(10);
    const [_id,set_Id] = React.useState(2373)
    const [accounts, setAccounts] = React.useState( [])
    const [data,setData] = React.useState([{
        date:"2022-02-10",
        firstName  : "Nikki",
        interestRate : 0.25,
        lastName : "Littleford",
        loanAmount : 1400,
        paymentAmount : 125,
        periods : 14,
        status : "Active",
        _id : 2373}]);



    const [transactions, setTransactions] = React.useState();
    const [loadingData, setLoadingData] = React.useState(false);
    const [loadingTrans, setLoadingTrans] = React.useState(false);
    const [currentWeek, setCurrentWeek] =React.useState();
    

//Click to select which view to
    function handleClick(item){
        set_Id(item)
    }


    useEffect(()=>{
        //fetch item by adding url
            fetch(`http://localhost:8080/api/v1/loanDetails`)
            // we grab jason and convert to readyable array data
            .then(resp => resp.json())
            //
            .then(data => console.log(data))

            


    },[])

    
    const getData = async() =>{
        // setLoading(false);
        try{
            const res = await axios.get(`http://localhost:8080/api/v1/loanDetails`)
            .then(res=> {setData(res.data);setAccounts(res.data)})
            .then(console.log(data))
        }catch(error){
            console.error(error.message);
        }
    setLoadingData(true)

        }

        const getTransactions = async() =>{
            // setLoading(false);
            try{
                const res = await axios.get(`http://localhost:8080/api/v1/loanTransactions/loanNumber/${_id}`)
                .then(res=> setTransactions(res.data))
            }
            catch(error){
                console.error(error.message);
            }
        setLoadingTrans(true)
    
            }


            React.useEffect(()=>{
                const today = new Date()
                var fiscalStartDate = new Date(today.getFullYear(),0,1)
                const dateDiff = Math.floor((today - fiscalStartDate)/(24*60*60*1000));
                // const weeks =  Math.floor((dateDiff/8.64e7)/7);
                const weeks =  Math.ceil((today.getDay()+ dateDiff)/7);
                setCurrentWeek(weeks)
            },[])

    const [trigger, setTrigger] = React.useState(false)
    const [reportTrigger, setReportTrigger] = React.useState(false)
    const [collectionTrigger, setCollectionTrigger] = React.useState(false)


   function handleAddClient(){
    setTrigger(true)

   } 

   function handleReportButton(){
    setReportTrigger(true)

   } 

   function handleCollectionButton(){
    setCollectionTrigger(true)

   } 



  let homeScreenArray = [
    {title:"+ New Loan",handle: handleAddClient},
    {title:"TBD",link:"",description:"some stuff right here"},
    {title:"Collect Payments",handle:handleCollectionButton}, 
    {title:"Reports",handle: handleReportButton}]
    const [update,setUpdate] = React.useState(false);




    React.useEffect(()=>{ 
        //Get Api
        getData();
        getTransactions();

        
    },[update,_id])

    React.useEffect(()=>{ 
        //Get Api
        setTableLength(10)
        
        
    },[_id])

    function handleRefresh(){
        setUpdate(prevState=>(!prevState))

    }

    function handleShowMore(){
        setTableLength((prev)=>(prev+10) )
    }

  
    

    return(
        <>
        {/**Header */}
        <header className='header'>
        <h1 style={{backgroundColor:"#04AA6D"}}> Doc Holliday Financial</h1>
        <nav className='nav'>
            {homeScreenArray.map((item) =>{
    
    return(
        <>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
            <div className='button-24' style={{marginRight:10}}  >
                <header >
                    <h3 onClick={item.handle}>{item.title}</h3>
            
                </header>
            </div>
            </> )})}
                


</nav>
            <div className='header-left'>

            </div>
        </header>
     


<div class="main-section">
    
        {/**Side Bar */}
  <div className='side-bar'>
<h1>{accounts.filter(function(obj){return obj.status==="Active"}).length} Active</h1>
<h1 className='button-24' style={{backgroundColor:"grey", minHeight:50}}>Select Loan</h1>

    {accounts.sort((a, b) => a.status.localeCompare(b.status))
 .map((item)=>{
        let color = item.status === "Closed" ? "red" : item.status==="Pause" ? "blue" : ""
        
        let agent = item.assignedTo === null ? null : String(item.assignedTo).slice(0,1)
            return(   
        
             <div className="button-24 badge1" data-badge= {agent} style={{ backgroundColor: _id === item._id ? "orange" : color }}   onClick={()=>handleClick(item._id)} >

                            <h3>{item.firstName} {item.lastName}</h3>
                          
                        </div>
                    
                        
                        )
      
                        
            })} 
 </div>



     {/**Data Tables */}
     <div style={{marginTop:20}}>

     {(loadingData && loadingTrans) &&
   <DetailsTables transactions={transactions} data={data.filter(function(obj){return obj._id === _id})[0]}handleRefresh={handleRefresh} />
    }
    
    {(loadingData && loadingTrans) &&
    <PaymentTableSummary transactions={transactions} loanDetails ={data.filter(function(obj){return obj._id === _id})[0]} handleRefresh={handleRefresh} handleShowMore={handleShowMore} tableLength={tableLength}/>
    }
 

<button onClick={handleRefresh}>Refresh</button>



    </div>

  

    </div>
    <Popup trigger={trigger} setTrigger={setTrigger} children={<AddNewLoan/>} />
    <Popup trigger={reportTrigger} setTrigger={setReportTrigger} children={<PaymentsThisWeek/>} />
    <Popup trigger={collectionTrigger} setTrigger={setCollectionTrigger} children={<CollectionList/>} />



   </>       
    )}
 

    