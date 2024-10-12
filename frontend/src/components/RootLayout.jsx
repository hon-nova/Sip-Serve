import { Outlet } from 'react-router-dom'
import { NavBar } from './NavBar'
export const RootLayout =()=>{

   return (
      <div>
         <h1>Main Root Layout Navigation</h1>
         <div><NavBar/></div>
         <main>
            <Outlet />
         </main>
      </div>
   )
}