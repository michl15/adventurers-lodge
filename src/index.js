import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Route, Routes } from 'react-router';
import reportWebVitals from './reportWebVitals';
import LoginPage from './components/LoginPage';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { FIREBASE_CONFIG } from './config/firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/HomePage';
import CharacterCreationPage from './components/CharacterCreationPage';
import CharacterPage from './components/CharacterPage/CharacterPage';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage app={app} analytics={analytics}/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/character_creation" element={<CharacterCreationPage/>}/>
        <Route path="/character_page" element={<CharacterPage/>}/>

      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
