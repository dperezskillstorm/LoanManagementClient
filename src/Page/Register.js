
import {useState, useEffect, React} from 'react'
// import {useNavigate} from 'react-router-dom'
import { Logo, FormRow, Alert } from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from '../context/appContext'


const initialState = {
    name: '',
    email: '',
    password: '',
    isMember:true,
}



const Register = () => {
  
    const [values,setValues] = useState(initialState)
    // registerUser,  loginUser => was refactored into setup User
    const {isLoading, showAlert, displayAlert, setupUser, user } = useAppContext()
 
    // const navigate = useNavigate()

    useEffect(()=>{
      if(user){
        setTimeout(()=>{
        //   navigate('/')
        }, 3000)
      }
    },[user]) //navigate


  const toggleMember = () =>{
    setValues({...values, isMember: !values.isMember})

  }
    
  const handleChange = (e) =>{
   setValues({...values,[e.target.name]:e.target.value})
  }

  const onSubmit = (e) =>{
    e.preventDefault(e.target)
    const {name,email, password,isMember} = values
    if(!email || !password ||( !isMember && !name) ){
    displayAlert()
    return
  }

  const currentUser = {name, email, password}

  if(isMember){
    setupUser({currentUser, endPoint: "login", alertText: "Sucessfully Logged In, redirecting"})
  } else{
    setupUser({currentUser, endPoint: "register", alertText: "User Created, redirecting"})

  }
}


    
    
  return (
    <Wrapper className='full-page'>
    <form className='form' onSubmit={onSubmit}>
        <Logo/>
        <h3>{values.isMember ? "Login": "Register"}</h3>
        {showAlert && <Alert/>}
        {/* Name Input */}
        {!values.isMember &&  
        (<FormRow value={values.name} name="name" type="text" labelText="Name" handleChange={handleChange}/>)
}
          {/* Email Input */}
        <FormRow value={values.email} name="email" type="email" labelText="Email" handleChange={handleChange}/>
          {/* password Input */}
        <FormRow value={values.password} name="password" type="password" labelText="Password" handleChange={handleChange}/>


    
        <button type="submit" className='btn btn-block' disabled={isLoading}>Submit</button>
      <p>
        {values.isMember? 'Not a member yet?': 'Already a member?'}
        <button type='button' onClick={toggleMember} className="member-btn"> {values.isMember ? "Register": "Login"}</button>
      </p>

        
    </form>
    </Wrapper>
  )
}

export default Register
