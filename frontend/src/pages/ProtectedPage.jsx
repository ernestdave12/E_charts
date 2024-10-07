import React, { useEffect, useState } from 'react';
import CryptoCharts from '../components/CryptoCharts';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, logoutUser } from '../redux/authSlice';
import './css/cssprotectedpage/ProtectedPage.css'

const ProtectedPage = () => {
  const [ethPrice, setEthPrice] = useState(null);
  const [ethPrices, setEthPrices] = useState([]);
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@trade');

    ws.onmessage = (event) => {
      const tradeData = JSON.parse(event.data);
      setEthPrice(tradeData.p); 
      setEthPrices((prevPrices) => {
        const newPrices = [...prevPrices, parseFloat(tradeData.p)];
        if (newPrices.length > 100) {
          newPrices.shift(); 
        }
        return newPrices;
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>Page protégée avec WebSocket (Prix Ethereum)</h1> <button onClick={handleLogout}>Logout</button>
      <h2>Prix en temps réel d'Ethereum (ETH/USDT)</h2>
      <div>
        {ethPrice ? (
          <p>ETH/USDT : ${parseFloat(ethPrice).toFixed(2)}</p>
        ) : (
          <p>Connexion au WebSocket en cours...</p>
        )}
      </div>
      <CryptoCharts ethPrices={ethPrices} />
    </div>
  );
};

export default ProtectedPage;
