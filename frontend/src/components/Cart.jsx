import { useDispatch } from "react-redux"
import { cartActions } from "../store"
export const Cart =()=>{

   const cartItems = useDispatch((state=>state.cart))
   console.log(`cartItem in Cart`, cartItems)
   const dispatch = useDispatch()

   return (
      <div>
         <h1>My Cart</h1>
         {}
         <div className="row">
            <div className="col-md-9" style={{ border:"1px solid red" }}>
                               
               {cartItems.length>0 && cartItems.map((item,index)=>(    
                  <div className="row my-2" key={index}>   
                  <div className="col" >           
                     <ul className="d-flex" >
                        <li><img src={item.photo} alt="" width="280" height="240"/></li>
                        <li>detail</li>
                        <li>
                           <button onClick={()=>dispatch(cartActions.updateQuantityCart({id:item.id,changeType:'decrease'}))}>-</button>
                           <input type="number" name="quantity" value={item.quantity} 
                              onChange={(e)=>dispatch(cartActions.updateQuantityCart({id:item.id,changeType:'input',quantity:e.target.value}))}/>
                          <button onClick={()=>dispatch(cartActions.updateQuantityCart({id:item.id,changeType:'increase'}))}>+</button>
                           
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