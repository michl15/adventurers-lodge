import { fireEvent, render, screen } from '@testing-library/react';
import NavigationBar from '../NavigationBar';
import { BrowserRouter, useLocation } from 'react-router';
import { signOut } from 'firebase/auth';
import { renderWithProviders } from '../../../util/test-utils';

jest.mock('firebase/firebase');

const mockedUseNavigate = jest.fn();
let mockedUseLocation = {
    pathname: '/home',
    search: '',
    state: {},
    hash: '',
    key: '',
};

jest.mock('react-router', () => ({
    ...(jest.requireActual('react-router') as any),
    useNavigate: () => mockedUseNavigate,
    useLocation: () => mockedUseLocation,
}));

describe('NavigationBar', () => {
    beforeEach(() => {
        mockedUseLocation = {
            pathname: '/home',
            search: '',
            state: {},
            hash: '',
            key: '',
        };
    });

    test('renders component', () => {
        renderWithProviders(
            <BrowserRouter>
                <NavigationBar />
            </BrowserRouter>
        );
        expect(screen.queryByTestId('navigation-bar')).toBeInTheDocument();
    });

    test('does not render component on login page', () => {
        mockedUseLocation.pathname = '/';
        renderWithProviders(
            <BrowserRouter>
                <NavigationBar />
            </BrowserRouter>
        );
        expect(screen.queryByTestId('navigation-bar')).not.toBeInTheDocument();
    });

    test('calls onSignOut on button click', () => {
        renderWithProviders(
            <BrowserRouter>
                <NavigationBar />
            </BrowserRouter>
        );

        const mockedSignout = jest.mocked(signOut);
        mockedSignout.mockResolvedValue();
        const signOutBtn = screen.getByTestId('navbar-sign-out-btn');
        expect(signOutBtn).toBeInTheDocument();
        fireEvent.click(signOutBtn);
        expect(signOut).toHaveBeenCalled();
    });
});
