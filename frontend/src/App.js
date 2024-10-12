import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './components/HomePage'
import { Quiz } from './components/QuizVariable'
import { Menu } from './components/Menu'
import { Cart } from './components/Cart'

function App() {
  return (
   <Router>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/quiz" element={<Quiz />}/>
      <Route path="/menu" element={<Menu />}/>
      <Route path="/cart" element={<Cart />}/>
    </Routes>
   </Router>
  );
}

export default App;
