import { useSelector } from "react-redux"
import {useState} from 'react'
export const Payment =()=>{

   const [payment,setPayment]= useState({digit:"",amount:""})
   const [error,setError] = useState({digit:"",amount:""})
   const [success,setSuccess] = useState("")
   const totalPay  = useSelector((state)=>state.totalPay)

   const areValidInputs = ()=>{
      if(typeof Number(payment.digit) !=='number'){
         setError((prevState)=>({
            ...prevState,
            digit:'This field should contain digits only.'
         }))
         return false
      } else if(typeof parseFloat(payment.amount) !=='number'){
         setError((prevState)=>({
            ...prevState,
            amount: 'Please enter the exact amount shown above.'
         }))
         return false
      }
      setSuccess("Success Transaction. Continue shopping? ")
      setTimeout(()=>
         setError({digit:"",amount:""}),
         setSuccess('')
      ,2000)
      return true
   }
   console.log(`totalPay in Payment::${totalPay}`)
   const handleSubmitPayment =(e)=>{
      e.preventDefault()
      areValidInputs()     
      
   }
   const handleInputChange =(e)=>{
      const {name,value} =e.target
      
      setPayment((prevState)=>({
         ...prevState,
         [name]:parseFloat(value)
      }))
      
   }
   console.log(`payment.digit: `,payment.digit)
   console.log(  `payment.amount: `,payment.amount)
   return(
      <div className="container">Payment
      {success & <p className="alert alert-success">{success}</p>}
      <div>
         <form onSubmit={handleSubmitPayment}>
         <div>
             <label htmlFor="digit">Enter 16 digits</label><br/>
             <input type="text" id="digit" name="digit" value={payment.digit}
               onChange={handleInputChange}
             />
             {error.digit && <p className="alert alert-danger">{error.digit}</p>}
         </div>
         <div>
            <label htmlFor="amount">Amount to pay:$ {totalPay.toFixed(2)}</label><br/>
            <input type="text" id="amount" name="amount" placeholder="Enter exact amount" value={payment.amount}
                  onChange={handleInputChange}/>
         {error.amount && <p className="alert alert-warning">{error.amount}</p>}
         </div>
         <button type="submit">Pay</button>
           
         </form>
      </div>
      </div>
   )
}