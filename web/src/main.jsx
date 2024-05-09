import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

window.apiUrl = "http://83.229.83.240:5177";

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
)
