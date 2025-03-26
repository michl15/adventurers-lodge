import { render, screen } from '@testing-library/react';
import HomePage from '../HomePage';
import { onAuthStateChanged } from 'firebase/auth';

const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...(jest.requireActual('react-router') as any),
    useNavigate: () => mockedUseNavigate,
}));

jest.mock('firebase/auth', () => {
    return {
        getAuth: jest.fn(() => {
            return { user: 'test user' };
        }),
        signOut: jest.fn(),
        onAuthStateChanged: jest.fn(),
    };
});

describe('HomePage', () => {
    test('renders component', () => {
        const mockedOnAuthState = jest.mocked(onAuthStateChanged);
        const mockedAuthCallback = (_auth: any, callback: any) => {
            callback({ user: 'test user' });
        };
        mockedOnAuthState.mockImplementation(mockedAuthCallback as any);
        render(<HomePage />);
        expect(screen.queryByTestId('home-page-container')).toBeInTheDocument();
        expect(screen.queryByTestId('characters-header')).toBeInTheDocument();
    });

    test('does not render content if not signed in', () => {
        const mockedOnAuthState = jest.mocked(onAuthStateChanged);
        const mockedAuthCallback = (_auth: any, callback: any) => {
            callback(null);
        };
        mockedOnAuthState.mockImplementation(mockedAuthCallback as any);
        render(<HomePage />);
        expect(screen.queryByTestId('home-page-container')).toBeInTheDocument();
        expect(
            screen.queryByTestId('characters-header')
        ).not.toBeInTheDocument();
    });
});
