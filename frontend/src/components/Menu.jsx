import '../../src/css/base.css'
import '../../src/css/menu-style.css'
import { getMenu, addToCart} from '../store/index'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

export const Menu =()=>{
   const dispatch = useDispatch()
   const { menu, status, error } = useSelector((state)=>state.menu)
//    console.log(`menu`)
//    console.log(menu)

   useEffect(() => {
      dispatch(getMenu());  
    }, [dispatch]);

   if (status === 'loading') {
      return <div>Loading...</div>; 
    }
  
   if (status === 'failed') {
      return <div>Error: {error}</div>;  
    }
    const handleAddToCart =(mealObj)=>{
        dispatch(addToCart(mealObj))
    }

   return (
      <div className="menuContainer">
         <div className="titleBar">
            <h1 className="title">Main Menu</h1>
            <ul>
                {menu.map((item, index) => {
                    const mealType = Object.keys(item)[0];  
                    const meals = item[mealType];  
                    return (
                        <li key={index}>
                            <h2 className="mealType">{mealType}</h2>
                            <ul>
                            <div className="row my-2">
                                {meals.map((meal, mealIndex) => {
                                    const [id,name, quantity, price, photo] = meal.split(',');
                                    const mealObj = { mealType,id,name, quantity, price, photo };
                                    return (
                                        
                                        <li key={mealIndex} className="col-md-5 meal">
                                        <div className="d-flex">
                                             <img src={photo} alt={name} style={{ width: '280px', height: '240px' }} />
                                             <div className="mealDetails">
                                                <p style={{ flex: '1' }}>{name} - {quantity} - {price}</p>
                                               <footer>
                                                <button className="viewBtn" onClick={()=>handleAddToCart(mealObj)}>Order</button>
                                               </footer>
                                             </div>
                                        </div>
                                        </li>                                    
                                       
                                    );
                                })}
                                </div>
                            </ul>
                        </li>
                    );
                })}
            </ul>
            
         </div>
      </div>
   )
}
