import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Route, Routes } from 'react-router';
import reportWebVitals from './reportWebVitals';
import LoginPage from './components/Pages/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/Pages/HomePage';
import CharacterCreationPage from './components/Pages/CharacterCreationPage';
import NavigationBar from './components/UtilComponents/NavigationBar';
import PageContainer from './components/UtilComponents/PageContainer';
import ScrollToTop from './components/UtilComponents/ScrollToTop';
import CharacterPage from './components/Pages/CharacterPage';
import { Provider } from 'react-redux';
import { store } from './redux';
import ErrorBoundary from './components/UtilComponents/ErrorBoundary';
import AuthErrorScreen from './components/UtilComponents/AuthErrorScreen';
import AuthBoundary from './components/UtilComponents/AuthBoundary';
import UserProfile from './components/Pages/User/UserProfile';
import UserAccount from './components/Pages/User/UserAccount';
import UnderConstruction from './components/UtilComponents/UnderConstruction';
import LandingPage from './components/Pages/LandingPage';
import LargeQueries from './components/UtilComponents/LargeQueries';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HashRouter>
            <Provider store={store}>
                <ErrorBoundary>
                    <AuthBoundary>
                        <NavigationBar />
                        <LargeQueries />
                        <PageContainer>
                            <ScrollToTop />
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/login" element={<LoginPage />} />
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
                                <Route
                                    path="/campaign_creation"
                                    element={<UnderConstruction />}
                                />
                                <Route
                                    path="/browse"
                                    element={<UnderConstruction />}
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
