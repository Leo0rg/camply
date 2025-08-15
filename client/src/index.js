import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './fonts.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { HelmetProvider } from 'react-helmet-async';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    width: 100%;
    line-height: 1.6;
    color: #333;
    background-color: #F6EBBF;
    position: relative;
    min-height: 100vh;
    font-family: 'WADIK', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .container {
    margin: 0 auto;
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  
  .py-3 {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
  
  /* Оптимизация производительности */
  img {
    max-width: 100%;
    height: auto;
    content-visibility: auto;
  }
  
  /* Улучшение доступности */
  :focus {
    outline: 3px solid #EE5806;
    outline-offset: 2px;
  }
  
  /* Улучшение отзывчивости для мобильных устройств */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
  }
  
  /* Предотвращение CLS (Cumulative Layout Shift) */
  img, video {
    aspect-ratio: attr(width) / attr(height);
  }
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <GlobalStyle />
        <App />
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
