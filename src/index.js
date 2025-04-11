import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Route, Routes } from 'react-router';
import reportWebVitals from './reportWebVitals';
import LoginPage from './components/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/HomePage';
import CharacterCreationPage from './components/CharacterCreationPage';
import NavigationBar from './components/NavigationBar';
import PageContainer from './components/PageContainer';
import ScrollToTop from './components/ScrollToTop';
import CharacterPage from './components/CharacterPage';
import { Provider } from 'react-redux';
import { store } from './redux';
import ErrorBoundary from './components/ErrorBoundary';
import AuthErrorScreen from './components/AuthErrorScreen';
import AuthBoundary from './components/AuthBoundary';
import UserProfile from './components/UserProfile';
import UserAccount from './components/UserAccount';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HashRouter>
            <Provider store={store}>
                <ErrorBoundary>
                    <AuthBoundary>
                        <NavigationBar />
                        <PageContainer>
                            <ScrollToTop />
                            <Routes>
                                <Route path="/" element={<LoginPage />} />
                                <Route path="/home" element={<HomePage />} />
                                <Route
                                    path="/character_creation"
                                    element={<CharacterCreationPage />}
                                />
                                <Route
                                    path="/characters/:charId"
                                    element={<CharacterPage />}
                                />
                                <Route
                                    path="/auth_error"
                                    element={<AuthErrorScreen />}
                                />
                                <Route
                                    path="/profile/:uid"
                                    element={<UserProfile />}
                                />
                                <Route
                                    path="/account"
                                    element={<UserAccount />}
                                />
                                <Route
                                    path="/characters/:charId/edit"
                                    element={<CharacterCreationPage editMode />}
                                />
                            </Routes>
                        </PageContainer>
                    </AuthBoundary>
                </ErrorBoundary>
            </Provider>
        </HashRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
