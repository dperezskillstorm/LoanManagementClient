import React from 'react';
import main from "../assets/main-image.svg"
import Wrapper from '../Wrappers/WrapperAccountList';







const Dashboard = () => {
    return(

         <Wrapper>
         <nav>
           {/* <Logo/> */}
         </nav>
         <div className='container page'>
             <div className='info'>
                 <h1>
                 Finance<span>Tracking</span>App
                 </h1>
                 <p>
                 Loan Tracking, Collection, and Origination Dashboard 
                 </p>
                 {/* <Link to={'/register'} className='btn btn-hero'>Login/Register</Link> */}
             </div>
             <img src = {main} alt="banking" className='img main-img'/>
                     </div>
     </Wrapper>
    )
}

export default Dashboard