import '../../src/css/base.css'
import { getMenu} from '../store/index'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

export const Menu =()=>{
   const dispatch = useDispatch()
   const { menu, status, error } = useSelector((state)=>state.menu)
   console.log(`menu`)
   console.log(menu)

   useEffect(() => {
      dispatch(getMenu());  // Fetch the menu data when the component mounts
    }, [dispatch]);

   if (status === 'loading') {
      return <div>Loading...</div>;  // Show loading indicator
    }
  
   if (status === 'failed') {
      return <div>Error: {error}</div>;  // Show error message
    }

   return (
      <div>
         <div className="titleBar" style={{ background: 'linear-gradient(to right, lightgrey, #4dc8fa)' }}>
            <h1 className="title">Menu - Orders</h1>
            <ul>
                {menu.map((item, index) => {
                    const mealType = Object.keys(item)[0];  
                    const meals = item[mealType];  
                    return (
                        <li key={index}>
                            <h2>{mealType}</h2>
                            <ul>
                                {meals.map((meal, mealIndex) => {
                                    const [name, quantity, price, photo] = meal.split(',');
                                    return (
                                        <li key={mealIndex}>
                                            <img src={photo} alt={name} style={{ width: '220px', height: '200px' }} />
                                            <span>{name} - {quantity} - {price}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    );
                })}
            </ul>
            
         </div>
      </div>
   )
}
