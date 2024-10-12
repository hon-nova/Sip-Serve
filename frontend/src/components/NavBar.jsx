import { useSelector } from "react-redux"
import '../css/nav-style.css'
import { Link } from 'react-router-dom'
export const NavBar =()=>{

   const cartItems = useSelector((state)=>state.cart.cart)
   console.log(`length: cartItems: ${cartItems.length}`)
   return (
      <div className="d-flex justify-content-between nav">
         <div className="d-flex">
            <p className="mx-3"><Link to="/">Logo</Link></p>
            <p className="mx-3"><Link to="/">Home</Link></p>
            <p className="mx-3"><Link to="/menu">Menu</Link></p>
         </div>
         <div className="d-flex">
            <p className="mx-3"><Link to="/register">Register</Link></p>
            <p className="mx-3"><Link to="/cart"><i className="bi bi-cart4"></i></Link><span className="myCart">{cartItems.length <10 ? `0`+cartItems.length:cartItems.length}</span></p>
         </div>
      </div>
   )
}