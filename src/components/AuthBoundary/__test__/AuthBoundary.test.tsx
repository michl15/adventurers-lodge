import { renderWithProviders } from '../../../util/test-utils';
import AuthBoundary from '../AuthBoundary';

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

jest.mock('firebase/auth', () => {
    const mockOnAuthStateChanged = jest.fn();
    return {
        getAuth: jest.fn().mockReturnValue({
            onAuthStateChanged: mockOnAuthStateChanged,
        }),
        mockOnAuthStateChanged, // Export the mock function for assertions
    };
});

describe('AuthBoundary', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUseLocation = {
            pathname: '/home',
            search: '',
            state: {},
            hash: '',
            key: '',
        };
    });

    test('does not reroute if user is found', () => {
        const { mockOnAuthStateChanged } = require('firebase/auth');
        mockOnAuthStateChanged.mockImplementationOnce(
            (callback: ({}) => void) => {
                callback({ uid: '123' });
            }
        );
        renderWithProviders(<AuthBoundary />);
        expect(mockedUseNavigate).not.toHaveBeenCalled();
    });

    test('reroutes if no user is found', () => {
        const { mockOnAuthStateChanged } = require('firebase/auth');
        mockOnAuthStateChanged.mockImplementationOnce(
            (callback: () => void) => {
                callback();
            }
        );
        renderWithProviders(<AuthBoundary />);
        expect(mockedUseNavigate).toHaveBeenCalled();
    });

    test('does not check auth on login screen', () => {
        mockedUseLocation.pathname = '/';
        const { mockOnAuthStateChanged } = require('firebase/auth');
        renderWithProviders(<AuthBoundary />);
        expect(mockOnAuthStateChanged).not.toHaveBeenCalled();
    });
});
