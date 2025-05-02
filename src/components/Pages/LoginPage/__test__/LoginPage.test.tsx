import { fireEvent, screen, waitFor } from '@testing-library/react';
import LoginPage from '../LoginPage';
import {
    GoogleAuthProvider,
    signInWithPopup,
    UserCredential,
} from 'firebase/auth';
import { renderWithProviders } from '../../../../util/test-utils';

const mockedUsedNavigate = jest.fn();

class MockUserCredential {
    user: any;
    providerId?: string;
    operationType?: string;

    constructor(user: any, providerId?: string, operationType?: string) {
        this.user = user;
        this.providerId = providerId;
        this.operationType = operationType;
    }

    getProviderId(): string | undefined {
        return this.providerId;
    }

    getOperationType(): string | undefined {
        return this.operationType;
    }

    _tokenResponse?: any;
    _auth?: any;
}

const mockUser = {
    uid: 'test-user-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    // Add other user properties as needed for your tests
};

jest.mock('react-router', () => ({
    ...(jest.requireActual('react-router') as any),
    useNavigate: () => mockedUsedNavigate,
}));

jest.mock('firebase/auth', () => {
    const AuthProviderMock = jest.fn(() => {
        return { credentialFromResult: jest.fn() };
    });
    const mockSignInWithPopup = jest.fn(() => {
        return Promise.resolve({ user: { uid: 'mockUserId' } });
    });

    const mockAuth = {
        currentUser: null,
        signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
        createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
        signOut: jest.fn(() => Promise.resolve()),
        onAuthStateChanged: jest.fn((callback) => {
            // Simulate initial auth state (e.g., no user logged in)
            callback(null);

            // Return a function to unsubscribe (required by Firebase API)
            return () => {};
        }),
        // Add other auth methods as needed
    };

    return {
        getAuth: jest.fn(() => mockAuth),
        connectAuthEmulator: jest.fn(),
        GoogleAuthProvider: AuthProviderMock,
        signInWithPopup: mockSignInWithPopup,
    };
});

jest.mock('firebase/database', () => {
    const mockGet = jest.fn();
    return {
        get: mockGet,
        update: jest.fn(),
        getDatabase: jest.fn(),
        ref: jest.fn(),
        mockGet,
    };
});

describe('LoginPage.tsx', () => {
    test('renders component', () => {
        renderWithProviders(<LoginPage />);

        expect(screen.getByTestId('login-page-container')).toBeInTheDocument();
    });

    test('Login with Google works', async () => {
        renderWithProviders(<LoginPage />);
        const mockedSignInPopup = jest.mocked(signInWithPopup);
        mockedSignInPopup.mockResolvedValue(
            new MockUserCredential(mockUser) as UserCredential
        );
        const mockedAuthProvider = jest.mocked(GoogleAuthProvider);
        mockedAuthProvider.credentialFromResult = jest.fn();

        const { mockGet } = require('firebase/database');
        mockGet.mockResolvedValue({
            exists: () => true,
            val: () => ({}),
        });

        const googleSignInButton = screen.getByTestId('google-login-button');
        fireEvent.click(googleSignInButton);
        expect(signInWithPopup).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalled());
    });

    test('Login with Google updates new user', async () => {
        renderWithProviders(<LoginPage />);
        const mockedSignInPopup = jest.mocked(signInWithPopup);
        mockedSignInPopup.mockResolvedValue(
            new MockUserCredential(mockUser) as UserCredential
        );
        const mockedAuthProvider = jest.mocked(GoogleAuthProvider);
        mockedAuthProvider.credentialFromResult = jest.fn();

        const { mockGet } = require('firebase/database');
        mockGet.mockResolvedValue({
            exists: () => false,
            val: () => {},
        });

        const googleSignInButton = screen.getByTestId('google-login-button');
        fireEvent.click(googleSignInButton);
        expect(signInWithPopup).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalled());
    });

    test('Login with Google handles error', async () => {
        const errorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        renderWithProviders(<LoginPage />);
        const mockedSignInPopup = jest.mocked(signInWithPopup);
        mockedSignInPopup.mockResolvedValue(
            new MockUserCredential(mockUser) as UserCredential
        );
        const mockedAuthProvider = jest.mocked(GoogleAuthProvider);
        mockedAuthProvider.credentialFromResult = jest.fn();

        const { mockGet } = require('firebase/database');
        mockGet.mockResolvedValue(new Error('test error'));

        const googleSignInButton = screen.getByTestId('google-login-button');
        fireEvent.click(googleSignInButton);
        await waitFor(() => {
            expect(errorSpy).toHaveBeenCalled();
        });
    });
});
