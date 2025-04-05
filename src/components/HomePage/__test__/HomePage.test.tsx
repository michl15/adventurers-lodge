import { screen } from '@testing-library/react';
import HomePage from '../HomePage';
import { renderWithProviders } from '../../../util/test-utils';
import { setupStore } from '../../../redux';
import { updateUser } from '../../../redux/UserReducer';
import { mockUser } from '../../../constants/mockData';
import { User } from 'firebase/auth';
const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockedUseNavigate,
}));

describe('HomePage', () => {
    test('renders component', () => {
        const store = setupStore();
        store.dispatch(updateUser(mockUser as User));
        renderWithProviders(<HomePage />, { store });
        expect(screen.queryByTestId('home-page-container')).toBeInTheDocument();
        expect(screen.queryByTestId('characters-header')).toBeInTheDocument();
    });

    test('does not render content if not signed in', () => {
        renderWithProviders(<HomePage />);
        expect(screen.queryByTestId('home-page-container')).toBeInTheDocument();
        expect(
            screen.queryByTestId('characters-header')
        ).not.toBeInTheDocument();
    });
});
