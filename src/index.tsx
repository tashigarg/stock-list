import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import StockApp from "./stocks/views/StockApp";

// Create React ref of the root in index.html
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Attach the Stock Application to the root
root.render(
    <StockApp />
);
