
import React from 'react';
import ReactDOM from 'react-dom/client';
import $ from 'jquery';
import Popper from 'popper.js';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { AppProvider } from './context/appContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
// let persistor = persistStore(store);

root.render(
  <React.StrictMode>
    <AppProvider>

    {/* <Provider store = {store}>
      <PersistGate persistor={persistor}> */}
    <App />
    {/* </PersistGate>
    </Provider> */}
      </AppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();