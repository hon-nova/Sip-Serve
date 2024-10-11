import {configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getMenu = createAsyncThunk('menu/fetchMenu', async () => {
   const response = await fetch('http://localhost:3001/menu');
   console.log('Response:', response);
   if(!response.ok){
      throw new Error(`Errors fetching data from the db`)
   }
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
          state.status = 'loading';  // Set loading status
        })
        .addCase(getMenu.fulfilled, (state, action) => {
          state.status = 'succeeded';  // Update status
          state.menu = action.payload;  // Store fetched menu data
        })
        .addCase(getMenu.rejected, (state, action) => {
          state.status = 'failed';  // Update status
          state.error = action.error.message;  // Store error message
        });
    }
})
export const menuActions = menuSlice.actions
//configure store
const store = configureStore({
   reducer: {
      menu: menuSlice.reducer
   }
})
export default store