import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { HomePage } from './components/HomePage'
// import { Quiz } from './components/QuizVariable'
import { Menu } from './components/Menu'
import { Cart } from './components/Cart'
import { RootLayout } from './components/RootLayout';
import { Payment } from './components/Payment';
import { Success } from './components/Success'
import { Cancel } from './components/Cancel'

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<RootLayout/>}>
     
      <Route index element={<HomePage/>}></Route>
      <Route path="/cart" element={<Cart />}></Route>
      <Route path="/menu" element={<Menu />}></Route>
      <Route path="/payment" element={<Payment/>}></Route>
      <Route path="/success" element={<Success />}></Route>
      <Route path="/cancel" element={<Cancel />}></Route>
    </Route>
  ))
  return (
   <RouterProvider router={router}>
     
   </RouterProvider>
  );
}

export default App;
