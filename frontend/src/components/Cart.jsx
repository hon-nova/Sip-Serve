
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { updateQuantityCart, removeFromCart } from "../store"

export const Cart =()=>{

   const cartItems = useSelector((state)=>state.cart.cart)
   console.log(`length cartItem in Cart`, cartItems.length)
   const dispatch = useDispatch()
   useEffect(() => {
      console.log(`useEffect cartItem in Cart`, cartItems);
  }, [cartItems]); // Log whenever cartItems change

   return (
      <div>      
         <h1>My Cart</h1>        
         <div className="row">
            <div className="col-md-9" style={{ border:"1px solid red" }}>                     
               {cartItems.map((item,index)=>(    
                  <div className="row my-2" key={index}>   
                  <div className="col" >           
                     <ul className="d-flex" >
                        <li><img src={item.photo} alt="" width="280" height="240"/></li>
                        <li>detail</li>
                        <li>
                           <button onClick={()=>dispatch(updateQuantityCart({id:item.id,changeType:'decrease'}))}>-</button>
                           <input type="number" name="quantity" value={item.quantity} 
                              onChange={(e)=>dispatch(updateQuantityCart({id:item.id,changeType:'input',quantity:e.target.value}))}/>
                          <button onClick={()=>dispatch(updateQuantityCart({id:item.id,changeType:'increase'}))}>+</button>                           
                        </li>
                     </ul> 
                  </div>
               <hr/>
               </div>
               ))}
            </div>
            <div className="col-md-3" style={{ border:"1px solid green" }}>
               {/* for displaying the est. total */}
            </div>
         </div>
        
      </div>
   )
}