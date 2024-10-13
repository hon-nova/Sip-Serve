import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import statusCode from "../utils/statusCode";
// import { useDispatch,useSelector } from "react-redux";

// const cartItems = useSelector((state)=>state.cart)

export const getMyStripe = createAsyncThunk("myStripe/get", async (cartItems,totalAmount) => {
  
   console.log(`cartItems:: ${cartItems}`)
   console.log(`totalAmount `,totalAmount)
  try {
    const response = await fetch(
      "http://localhost:3001/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         items: cartItems,
         totalAmount: totalAmount
        })
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch client secret.`);
    }
    const data = await response.json();
    return data.clientSecret;
  } catch (error) {
    console.log(`ERROR:: `, error.message);
  }
});
const initialState ={
   data: null,
   status: statusCode.IDLE,
   error: null
}
const paymentSlice = createSlice({
   name: 'payment',
   initialState,
   reducers: {

   },
   extraReducers: (builder)=>{
      builder
         .addCase(getMyStripe.fulfilled,(state,action)=>{
         state.data = action.payload
         state.status = statusCode.IDLE
      })
         .addCase(getMyStripe.rejected,(state,action)=>{
         state.status = statusCode.ERROR
      })
         .addCase(getMyStripe.pending,(state,action)=>{
         state.status = statusCode.PENDING
      })
   }
})
export default paymentSlice.reducer
