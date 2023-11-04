import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AdditionDemo from './pages/AdditionDemo.jsx';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/additiondemo" replace />} />
        <Route path='/additiondemo' element={<AdditionDemo/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
