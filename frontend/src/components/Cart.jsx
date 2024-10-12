
import { useDispatch, useSelector } from "react-redux"
import { updateQuantityCart, removeFromCart } from "../store"
import '../css/cart-style.css'
import { Link } from 'react-router-dom'

export const Cart =()=>{

   const cartItems = useSelector((state)=>state.cart.cart)
   console.log(`length cartItem in Cart`, cartItems.length)
   const dispatch = useDispatch()
 
  let subTotals =[]
  cartItems.reduce((total, {price,quantity})=>{
     let sub = parseFloat(price.replace('$','')) * quantity      
     subTotals.push(sub)
      return  subTotals
  },0)
  let subT = subTotals.reduce((acc,item)=>{
      acc+=item
      return acc
   },0)
   
  console.log(`total::`,subT); 
  let fiveP =(subT*0.05)
  let sevenP =(subT*0.07)
  let totalTaxes = fiveP + sevenP
  let estTotal = parseFloat(subT + totalTaxes)

   return (
      <div className="container">      
         <h1>My Cart</h1>        
         <div className="row">
            <div className="col-md-8" style={{ border:"1px solid #d0d0d5" }}>                     
               {cartItems.map((item,index)=>(  
                    
                  <div className="row my-2" key={index}>   
                  <div className="col" >
                             
                     <div className="d-flex" >
                        <img src={item.photo} className="myCartImage" alt=""/>
                        <div className="d-flex">
                           <ul>
                              <p>{item.mealType}: {item.name} - Price: {item.price}</p>
                              <div className="mb-4">
                                 <button 
                                 onClick={()=>dispatch(updateQuantityCart({id:item.id,changeType:'decrease'}))}
                                 className="btnQuantity"
                                 >-</button>
                                 <input type="number" name="quantity" value={item.quantity} 
                                 onChange={(e)=>dispatch(updateQuantityCart({id:item.id,changeType:'input',quantity:e.target.value}))}
                                 className="btnQuantity"
                                 id="btnQuantityInput"
                                 />
                                 <button 
                                 onClick={()=>dispatch(updateQuantityCart({id:item.id,changeType:'increase'}))}
                                 className="btnQuantity">+</button>                           
                              </div>
                             <button onClick={()=>dispatch(removeFromCart(item))} className="btnRemove">Remove</button>
                           </ul> 
                           <div className="d-flex mx-5"><h6>Sub-total: ${subTotals[index].toFixed(2)}</h6>                           
                          </div>                          
                        </div> 
                     </div> 
                  </div>
               <hr/>
               </div>
               ))}
            </div>
            <div className="col-md-4" style={{ border:"1px solid #d0d0d5" }}>
            <div>
               <table className="equal-width-table">
               <tr>
                  <td>Sub:</td><td></td><td>$ {subT.toFixed(2)}</td>
               </tr>
               <tr>
                  <td>5% GST:</td><td>$ {fiveP.toFixed(2)}</td><td></td>
               </tr>
               <tr>
                  <td>7% HST:</td><td>$ {sevenP.toFixed(2)}</td><td></td>
               </tr>
               <tr>
               <td>Total taxes:</td><td></td><td>$ {totalTaxes.toFixed(2)}</td>
               </tr>
               <hr/>
               <tr>
                  <td>Estimate:</td><td></td><td style={{ borderBottom:"5px double black" }}>$ {parseFloat(estTotal).toFixed(2)}</td>
               </tr> 
              </table>
            </div>
            <div className="mt-5 d-flex justify-content-center">
               <Link to="/payment" className="processToPay" >Continue to process</Link>
            </div>
               
            </div>
         </div>
        
      </div>
   )
}