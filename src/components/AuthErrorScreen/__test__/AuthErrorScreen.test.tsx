import { fireEvent, render, screen } from '@testing-library/react';
import AuthErrorScreen from '../AuthErrorScreen';

const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...(jest.requireActual('react-router') as any),
    useNavigate: () => mockedUseNavigate,
}));

describe('AuthErrorScreen', () => {
    test('renders component', () => {
        render(<AuthErrorScreen />);
        expect(screen.queryByTestId('auth-error-screen')).toBeInTheDocument();
    });

    test('button click navigates to login', () => {
        render(<AuthErrorScreen />);
        expect(screen.queryByTestId('auth-error-screen')).toBeInTheDocument();
        const btn = screen.getByTestId('return-to-login-btn');
        fireEvent.click(btn);

        expect(mockedUseNavigate).toHaveBeenCalledWith('/login');
    });
});
