import {
    findByTestId,
    fireEvent,
    render,
    screen,
    within,
} from '@testing-library/react';
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
        renderWithProviders(<NavigationBar />);
        expect(screen.queryByTestId('navigation-bar')).toBeInTheDocument();
    });

    test('does not render component on login page', () => {
        mockedUseLocation.pathname = '/';
        renderWithProviders(<NavigationBar />);
        expect(screen.queryByTestId('navigation-bar')).not.toBeInTheDocument();
    });

    test('goes to account settings page onclick', async () => {
        renderWithProviders(<NavigationBar />);
        expect(screen.queryByTestId('navigation-bar')).toBeInTheDocument();

        const dropdownElement = await screen.findByTestId(
            'navbar-dropdown-btn'
        );
        const dropdownBtn = await within(dropdownElement).findByRole('button');

        fireEvent.click(dropdownBtn);
        const accountBtn =
            await within(dropdownElement).findByTestId('account-btn');
        fireEvent.click(accountBtn);
        expect(mockedUseNavigate).toHaveBeenCalledWith('/account');
    });

    test('goes to account settings page onclick', async () => {
        renderWithProviders(<NavigationBar />);
        expect(screen.queryByTestId('navigation-bar')).toBeInTheDocument();

        const dropdownElement = await screen.findByTestId(
            'navbar-dropdown-btn'
        );
        const dropdownBtn = await within(dropdownElement).findByRole('button');

        fireEvent.click(dropdownBtn);
        const accountBtn =
            await within(dropdownElement).findByTestId('profile-btn');
        fireEvent.click(accountBtn);
        expect(mockedUseNavigate).toHaveBeenCalledWith('/profile/undefined');
    });

    test('signs out onclick', async () => {
        const mockedSignout = jest.mocked(signOut);
        mockedSignout.mockResolvedValue();
        renderWithProviders(<NavigationBar />);
        expect(screen.queryByTestId('navigation-bar')).toBeInTheDocument();

        const dropdownElement = await screen.findByTestId(
            'navbar-dropdown-btn'
        );
        const dropdownBtn = await within(dropdownElement).findByRole('button');

        fireEvent.click(dropdownBtn);
        const signOutBtn =
            await within(dropdownElement).findByTestId('signout-btn');
        fireEvent.click(signOutBtn);
    });
});
