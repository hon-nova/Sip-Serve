import { useSelector } from "react-redux"
import '../css/nav-style.css'
export const NavBar =()=>{

   const cartItems = useSelector((state)=>state.cart.cart)
   console.log(`cartItem in NavBar`, cartItems)
   return (
      <div className="d-flex justify-content-between nav">
         <div className="d-flex">
            <p className="mx-3"><a href="/">Logo</a></p>
            <p className="mx-3"><a href="/">Home</a></p>
            <p className="mx-3"><a href="/menu">Menu</a></p>
         </div>
         <div className="d-flex">
            <p className="mx-3"><a href="/register">Register</a></p>
            <p className="mx-3"><a href="/cart"><i className="bi bi-cart4"></i></a><span className="myCart">{cartItems.length <10 ? `0`+cartItems.length:cartItems.length}</span></p>
         </div>
      </div>
   )
}