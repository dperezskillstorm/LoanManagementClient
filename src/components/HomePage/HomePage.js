import React from 'react'
import "../HomePage/homepage.css"
import axios from "axios"
import { useSelector } from 'react-redux';
import PaymentTableSummary from '../PaymentTableSummary';
import DetailsTables from './DetailsTables';
import Popup from './Popup';
import LoanClients from '../LoanClients/LoanClients';
import AddNewLoan from '../LoanClients/AddNewLoan';


export default function HomePage(){

    const [_id,set_Id] = React.useState(2373)
    const [totalPaid,setTotalPaid] = React.useState()




    

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
    
    function convertToWeek(date){
        const today = new Date(date)
        var fiscalStartDate = new Date(2022,1,1)
        const dateDiff = Math.abs(today-fiscalStartDate);
        const weeks =  Math.floor((dateDiff/8.64e7)/7);
        return weeks
    }

    function handleClick(item){
        console.log(`item number clicked is ${item}`)
        // dispatch({type: "toggle", id: item});
        set_Id(item)
    


    }



    
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
                var fiscalStartDate = new Date(2022,1,1)
                const dateDiff = Math.abs(today-fiscalStartDate);
                const weeks =  Math.floor((dateDiff/8.64e7)/7);
                setCurrentWeek(weeks)
            },[])

    const [trigger, setTrigger] = React.useState(false)

   function handleAddClient(){
    setTrigger(true)

   } 


  let homeScreenArray = [{title:"+ New Loan",handle: handleAddClient},{title:"TBD",link:"",description:"some stuff right here"},{title:"Collect Payments",link:"",description:"some stuff right here"}, {title:"Reports",link:"",description:"some stuff right here"}]
    const [update,setUpdate] = React.useState(false);




    React.useEffect(()=>{ 
        //Get Api
        getData();
        getTransactions();
        
    },[update,_id])

    function handleRefresh(){
        setUpdate(prevState=>(!prevState))

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
    
<h1 className='button-24' style={{backgroundColor:"grey"}}>Select Loan</h1>
    {accounts.map((item)=>{
            return(

             <button class="button-24"   onClick={()=>handleClick(item._id)} >
             
                            <h3>{item.firstName} {item.lastName}</h3>
                       
                        </button>)
                        
            })} 
 </div>


     {/**Data Tables */}
     <div style={{marginTop:20}}>

     {(loadingData && loadingTrans) &&
   <DetailsTables transactions={transactions} data={data.filter(function(obj){return obj._id === _id})[0]}handleRefresh={handleRefresh} />
    }
    {(loadingData && loadingTrans) &&
    <PaymentTableSummary transactions={transactions} loanDetails ={data.filter(function(obj){return obj._id === _id})[0]} handleRefresh={handleRefresh}/>
    }
 

<button onClick={handleRefresh}>Refresh</button>



    </div>

  

    </div>
    <Popup trigger={trigger} setTrigger={setTrigger} children={<AddNewLoan/>} />


   </>       
    )}
 

    