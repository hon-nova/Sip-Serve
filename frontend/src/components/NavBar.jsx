import { useSelector } from "react-redux"
import '../css/nav-style.css'
import { Link } from 'react-router-dom'
export const NavBar =()=>{

   const cartItems = useSelector((state)=>state.cart.cart)
   const cartQuantity = cartItems.reduce((total,{quantity})=>{
      total+=quantity
      return total
   },0)
   // console.log(`cartQuantity: ${cartQuantity}`)
   // console.log(`length: cartItems: ${cartQuantity}`)
   return (
      <div className="d-flex justify-content-between nav">
         <div className="d-flex">
            <p className="mx-3"><Link to="/"><img src="/logo.png" alt="logo" width="70px" height="60px"/></Link></p>
           
            <p className="mx-3"><Link to="/menu">Menu</Link></p>
         </div>
         <div className="d-flex">
            <p className="mx-3"><Link to="/register">Register</Link></p>
            <p className="mx-3"><Link to="/cart"><i className="bi bi-cart4"></i></Link><sup><span className="myCart">{cartQuantity <10 ? `0`+cartQuantity:cartQuantity}</span></sup></p>
         </div>
      </div>
   )
}