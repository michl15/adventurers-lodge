import { fireEvent, screen, within } from '@testing-library/react';
import NavigationBar from '../NavigationBar';
import { signOut } from 'firebase/auth';
import { renderWithProviders } from '../../../util/test-utils';
import { setupStore } from '../../../redux';
import { updateUser } from '../../../redux/UserReducer';

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

    test('renders component', async () => {
        const store = setupStore();
        store.dispatch(
            updateUser({
                displayName: 'mock user',
                uid: 'mock id',
                email: 'mockemail',
                emailVerified: true,
                photoURL: 'none',
            })
        );
        renderWithProviders(<NavigationBar />, { store });
        expect(await screen.findByTestId('navigation-bar')).toBeInTheDocument();
    });

    test('does not render component on login page', () => {
        const store = setupStore();
        store.dispatch(
            updateUser({
                displayName: 'mock user',
                uid: 'mock id',
                email: 'mockemail',
                emailVerified: true,
                photoURL: 'none',
            })
        );
        mockedUseLocation.pathname = '/login';
        renderWithProviders(<NavigationBar />, { store });
        expect(screen.queryByTestId('navigation-bar')).not.toBeInTheDocument();
    });

    test('goes to account settings page onclick', async () => {
        const store = setupStore();
        store.dispatch(
            updateUser({
                displayName: 'mock user',
                uid: 'mock id',
                email: 'mockemail',
                emailVerified: true,
                photoURL: 'none',
            })
        );
        renderWithProviders(<NavigationBar />, { store });
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
        const store = setupStore();
        store.dispatch(
            updateUser({
                displayName: 'mock user',
                uid: 'mock id',
                email: 'mockemail',
                emailVerified: true,
                photoURL: 'none',
            })
        );
        renderWithProviders(<NavigationBar />, { store });
        expect(screen.queryByTestId('navigation-bar')).toBeInTheDocument();

        const dropdownElement = await screen.findByTestId(
            'navbar-dropdown-btn'
        );
        const dropdownBtn = await within(dropdownElement).findByRole('button');

        fireEvent.click(dropdownBtn);
        const accountBtn =
            await within(dropdownElement).findByTestId('profile-btn');
        fireEvent.click(accountBtn);
        expect(mockedUseNavigate).toHaveBeenCalledWith('/profile/mock id');
    });

    test('signs out onclick', async () => {
        const mockedSignout = jest.mocked(signOut);
        mockedSignout.mockResolvedValue();
        const store = setupStore();
        store.dispatch(
            updateUser({
                displayName: 'mock user',
                uid: 'mock id',
                email: 'mockemail',
                emailVerified: true,
                photoURL: 'none',
            })
        );
        renderWithProviders(<NavigationBar />, { store });
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
