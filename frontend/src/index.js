// frontend/src/index.js
import './redux/axiosInterceptor';
import React from 'react';
import { createRoot } from 'react-dom/client'; 
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container); // Créer un root avec createRoot
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
