import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { JustaNameProvider } from '@justaname.id/react';

require('dotenv').config();
const chainId = process.env.REACT_APP_CHAIN_ID ? parseInt(process.env.REACT_APP_CHAIN_ID) : undefined;
const validChainId = chainId === 1 || chainId === 11155111 ? chainId : undefined;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <JustaNameProvider backendUrl={process.env.REACT_APP_API_URL} chainId={validChainId}>
                <App />
            </JustaNameProvider>
        </BrowserRouter>
    </React.StrictMode>
);
