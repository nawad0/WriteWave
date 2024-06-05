// src/main.jsx (or index.js)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

window.apiUrl = import.meta.env.VITE_API_URL;
window.webUrl = import.meta.env.VITE_WEB_URL;
window.minioUrl = import.meta.env.VITE_MINIO_URL;

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
        <App />
    // </React.StrictMode>
)
