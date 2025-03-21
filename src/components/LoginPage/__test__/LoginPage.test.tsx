import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import LoginPage from "../LoginPage"
import { GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";

const mockedUsedNavigate = jest.fn();

class MockUserCredential {
    user: any;
    providerId?: string;
    operationType?: string;

    constructor(user: any, providerId?: string, operationType?: string) {
        this.user = user;
        this.providerId = providerId;
        this.operationType = operationType
    }

    getProviderId(): string | undefined {
        return this.providerId;
    }

    getOperationType(): string | undefined {
        return this.operationType
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
    ...jest.requireActual('react-router') as any,
    useNavigate: () => mockedUsedNavigate,
}));


jest.mock('firebase/auth', () => {
    const AuthProviderMock = jest.fn(() => { return { credentialFromResult: jest.fn() } })
    const mockSignInWithPopup = jest.fn(() => {
        return Promise.resolve({ user: { uid: 'mockUserId' } });
    })

    const mockAuth = {
        currentUser: null,
        signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
        createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
        signOut: jest.fn(() => Promise.resolve()),
        onAuthStateChanged: jest.fn((callback) => {
            // Simulate initial auth state (e.g., no user logged in)
            callback(null);

            // Return a function to unsubscribe (required by Firebase API)
            return () => { };
        })
        // Add other auth methods as needed
    };

    return {
        getAuth: jest.fn(() => mockAuth),
        connectAuthEmulator: jest.fn(),
        GoogleAuthProvider: AuthProviderMock,
        signInWithPopup: mockSignInWithPopup
    }
});

describe('LoginPage.tsx', () => {
    test('renders component', () => {
        render(<LoginPage />);

        expect(screen.getByTestId("login-page-container")).toBeInTheDocument();
    });

    test('Username input updates as expected', () => {
        render(<LoginPage />);

        const usernameInput: HTMLInputElement = screen.getByTestId("username-input");
        expect(usernameInput).toBeInTheDocument();
        fireEvent.change(usernameInput, { target: { value: "Test Username" } });
        expect(usernameInput.value).toBe("Test Username");
    });

    test('Password input updates as expected', () => {
        render(<LoginPage />);

        const passwordInput: HTMLInputElement = screen.getByTestId("password-input");
        expect(passwordInput).toBeInTheDocument();
        fireEvent.change(passwordInput, { target: { value: "Test Password" } });
        expect(passwordInput.value).toBe("Test Password");
    });

    test.skip('Submit button logs in user', () => {
        // TODO: Implement when email/password login is implemented
    });

    test('Login with Google works', async () => {
        render(<LoginPage />);
        const mockedSignInPopup = jest.mocked(signInWithPopup);
        mockedSignInPopup.mockResolvedValue(new MockUserCredential(mockUser) as UserCredential);
        const mockedAuthProvider = jest.mocked(GoogleAuthProvider);
        mockedAuthProvider.credentialFromResult = jest.fn();

        const googleSignInButton = screen.getByTestId("google-login-button");
        fireEvent.click(googleSignInButton);
        expect(signInWithPopup).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalled());

    })
})