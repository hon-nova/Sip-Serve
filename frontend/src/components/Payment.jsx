import { useSelector,useDispatch } from "react-redux"
// import {useState} from 'react'
import statusCode from "../utils/statusCode"
import {  useCustomCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from "react";
import { getMyStripe } from '../slices/paymentSlice'
import { Elements } from '@stripe/react-stripe-js';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export const Payment =()=>{
   
   const dispatch = useDispatch()
   const { data: clientSecret, status, error } = useSelector((state) => state.myStripe);
   const cartItems = useSelector((state)=>state.cart)
   const totalPay  = useSelector((state)=>state.totalPay)
  
   console.log(`clientSecret: `,clientSecret)
   console.log(`cartItems: `,cartItems)
   console.log(`totalPay: `,totalPay)
   

   useEffect(()=>{
      if(cartItems && cartItems.length >0 ){
         console.log(`dispatch getMyStripe useEffect:  `,dispatch(getMyStripe()))
          dispatch(getMyStripe({cartItems,totalPay}))
      }
     
   },[dispatch,cartItems,totalPay])

   if(status===statusCode.PENDING) {
      return <p className="alert alert-warning">Loading Payment...</p>
   }
   if(status ===  statusCode.ERROR){
      return <p className="alert alert-danger">Error: {error}</p>
   }
   if(status === statusCode.IDLE && clientSecret){
      const options = {
         clientSecret,
         cartItems,
         totalPay
      }
      console.log(`options: `,options.clientSecret)
      return(
         <div className="container">
         <h2>Payment</h2>
         <Elements stripe={stripePromise} options={options}>
           <CheckoutForm />
         </Elements>
       </div>
      )
   }
   return null;  
   
}
const CheckoutForm = () => {
   
   const checkout = useCustomCheckout();   
   console.log(checkout);
 
   return (
     <div>
       <h2>Checkout</h2>
       <pre>{JSON.stringify(checkout.lineItems, null, 2)}</pre>
     </div>
   );
 };