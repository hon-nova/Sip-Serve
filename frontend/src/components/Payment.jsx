import { useSelector, useDispatch } from "react-redux";
import statusCode from "../utils/statusCode";
import { loadStripe } from '@stripe/stripe-js';
import "../css/payment-style.css";
import { getMyStripe } from '../slices/paymentSlice';
import { CheckoutForm } from './CheckoutForm'
import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export const Payment = () => {
   // const dispatch = useDispatch();
   const { data, status, error } = useSelector((state) => state.myStripe);
   // const cartItems = useSelector((state) => state.cart);
   // const totalPay = useSelector((state) => state.totalPay);

   const [clientSecret, setClientSecret] = useState("");
   const [dpmCheckerLink, setDpmCheckerLink] = useState("")

   useEffect(() => {
      // Create PaymentIntent as soon as the page loads
      fetch("http://localhost:3001/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: "xl-tshirt", amount: 1000 }] }),
      })
        .then((res) => res.json())
        .then((data) => {         
            setClientSecret(data.clientSecret);
            console.log(`clientSecret: `,clientSecret)
            // [DEV] For demo purposes only
            setDpmCheckerLink(data.dpmCheckerLink);
        });
    }, []);
   
   const appearance = {
      theme: 'stripe',
    };
    // Enable the skeleton loader UI for optimal loading.
    const loader = 'auto';

   if (status === statusCode.PENDING) {
      return <p className="alert alert-warning">Loading Payment...</p>;
   }
   if (status === statusCode.ERROR) {
      return <p className="alert alert-danger">Error: {error}</p>;
   }
   if (status === statusCode.IDLE) {     
      return (
         <div className="container">
            <h2>Payment</h2>
            {clientSecret && (
         <Elements options={{clientSecret, appearance, loader}} stripe={stripePromise}>
            <CheckoutForm dpmCheckerLink={dpmCheckerLink}/>
         </Elements>
        )}
         </div>
      );
   }
   return null;
};


