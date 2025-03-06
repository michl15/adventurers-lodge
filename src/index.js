import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Route, Routes } from 'react-router';
import reportWebVitals from './reportWebVitals';
import LoginPage from './components/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/HomePage';
import CharacterCreationPage from './components/CharacterCreationPage';
import CharacterPage from './components/CharacterPage/CharacterPage';
import { FirebaseAuthProvider } from './context/FirebaseAuthContext';
import NavigationBar from './components/NavigationBar';
import PageContainer from './components/PageContainer';
import ScrollToTop from './components/ScrollToTop';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FirebaseAuthProvider>
    <HashRouter>
      <NavigationBar/>
      <PageContainer>
      <ScrollToTop/>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/character_creation" element={<CharacterCreationPage/>}/>
          <Route path="/characters/:charId" element={<CharacterPage/>}/>
        </Routes>
      </PageContainer>
    </HashRouter>
    </FirebaseAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
