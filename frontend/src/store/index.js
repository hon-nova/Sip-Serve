import {configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getMenu = createAsyncThunk('menu/fetchMenu', async () => {
   const response = await fetch('http://localhost:3001/menu');
   if(!response.ok){
      throw new Error(`Errors fetching data from the db`)
   }
   // const result = await response.json()
   const text = await response.text();     
   const data = JSON.parse(text)  
   return data.menu;  
 });


const menuSlice  = createSlice({
   name: 'menu',
   initialState: {menu: [],status: 'idle', error: null},
   reducers: {
      addMenu(state,action){
         state.menu.push(action.payload)
      },
      updateMenu(state,action){
        let {updatedItem} = action.payload
         const thisIndex = state.menu.findIndex((item)=>item.id === updatedItem.id)
         if(thisIndex!==-1){
            state.menu[thisIndex] = {...state.menu[thisIndex],...updatedItem}
         }       
      },
      deleteMenu(state,action){
         state.menu = state.menu.filter((item)=>item.id!== action.payload)
      }
   },
   extraReducers: (builder) => {
      builder
        .addCase(getMenu.pending, (state) => {
          state.status = 'loading'; 
        })
        .addCase(getMenu.fulfilled, (state, action) => {
          state.status = 'succeeded'; 
          state.menu = action.payload; 
        })
        .addCase(getMenu.rejected, (state, action) => {
          state.status = 'failed'; 
          state.error = action.error.message;
        });
    }
})
const cartSlice = createSlice({
   name: 'cart',
   initialState: {cart:[]},
   reducers: {
      addToCart(state,action){
         const existingItem = state.cart.find((item)=>item.id===action.payload.id)
         if(!existingItem){       
            state.cart.push({...action.payload, quantity:1})       
           
         } else {
            existingItem.quantity+=1
         }    
      },
      removeFromCart(state,action){         
         state.cart = state.cart.filter(item => item.id !== action.payload.id);
      },
      updateQuantityCart(state,action){
         //TODO
         const existingItem =state.cart.find((item)=>item.id===action.payload.id)
         const { id,changeType } = action.payload
         console.log(`changeType::${changeType}`)
         console.log(`id::${id}`)
         if(existingItem){
            if(changeType === 'increase'){
               if(existingItem.quantity<10){
                   existingItem.quantity+=1
               }                 
            } else if(changeType === 'decrease'){
               if(existingItem.quantity > 1){
                  existingItem.quantity-=1
               }
            } else if(changeType === 'input'){
               let newQuantity = action.payload.quantity
               existingItem.quantity = newQuantity
            }
         }
      }
   }
})
export const {addToCart, removeFromCart, updateQuantityCart} = cartSlice.actions
export const menuActions = menuSlice.actions

const totalPaySlice = createSlice({
   name:'totalPay',
   initialState: 0,
   reducers: {
      setTotalPay(state,action){
         return action.payload
      }
   }
})
export const {setTotalPay } = totalPaySlice.actions

//configure store
const store = configureStore({
   reducer: {
      menu: menuSlice.reducer,
      cart: cartSlice.reducer,
      totalPay:totalPaySlice.reducer
   }
})
export default store