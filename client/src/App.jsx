import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import AdditionDemo from './pages/AdditionDemo.jsx';
import Header from './pages/Header.jsx';
import VotingSystem from './pages/VotingSystem.jsx';
import VotingTally from './pages/VotingTally.jsx';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import usePublicKeyStore from './store/PublicKeyStore.jsx';
import axios from 'axios';

function App() {
  const base_url = import.meta.env.VITE_NODE_ENV === 'production' ? import.meta.env.VITE_PRODUCTION_URL : import.meta.env.VITE_DEVELOPMENT_URL;
  const setPublicKeyData = usePublicKeyStore((state) => state.setPublicKeyData)
  
  useEffect(() => {
    const fetchPublicKey = async () => {
        try {
            const response = await axios.get(`${base_url}/public_key`);
            const { n, g } = response.data;

            setPublicKeyData({
              n: n,
              g: g
            })

        } catch (error) {
            console.error('Error fetching public key:', error);
        }
    };

    fetchPublicKey();
  }, []);

  return (
    <BrowserRouter>
      <div className='container-fluid d-flex flex-column min-vh-100 px-0'>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/additiondemo" replace />} />
          <Route path='/additiondemo' element={<AdditionDemo/>}/>
          <Route path='/votingsystem' element={<VotingSystem/>}/>
          <Route path='/votingtally' element={<VotingTally/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
