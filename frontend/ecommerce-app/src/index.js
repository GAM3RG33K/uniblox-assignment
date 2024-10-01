import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { v4 as uuidv4 } from 'uuid';

export function getUserId() {
  let userId = localStorage.getItem('userId');

  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('userId', userId);
  }

  return userId;
}

export const userId = getUserId();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);