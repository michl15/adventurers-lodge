import { fireEvent, screen, waitFor } from '@testing-library/react';
import CharacterDetails from '../CharacterDetails';
import { mockCharacterData, mockUser } from '../../../../constants/mockData';
import { renderWithProviders } from '../../../../util/test-utils';
import { setupStore } from '../../../../redux';
import { updateUser } from '../../../../redux/UserReducer';
import { CurrentUser } from '../../../../constants/types';
import { remove } from 'firebase/database';

const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...(jest.requireActual('react-router') as any),
    useNavigate: () => mockedUseNavigate,
}));

jest.mock('firebase/database');

describe('CharacterDetails', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders component with details', () => {
        renderWithProviders(<CharacterDetails details={mockCharacterData} />);
        expect(screen.queryByTestId('char-details')).toBeInTheDocument();
    });

    test('does not render component without details', () => {
        renderWithProviders(<CharacterDetails details={null} />);
        expect(screen.queryByTestId('char-details')).not.toBeInTheDocument();
    });

    test('navigates when edit clicked', async () => {
        const store = setupStore();
        store.dispatch(updateUser(mockUser as CurrentUser));
        renderWithProviders(<CharacterDetails details={mockCharacterData} />, {
            store,
        });

        expect(screen.queryByTestId('char-details')).toBeInTheDocument();
        const editBtn = await screen.findByTestId('char-edit-btn');
        fireEvent.click(editBtn);
        expect(mockedUseNavigate).toHaveBeenCalledWith(
            '/characters/mock key/edit'
        );
    });

    test('navigates when edit clicked', async () => {
        const store = setupStore();
        store.dispatch(updateUser(mockUser as CurrentUser));

        (remove as jest.Mock).mockResolvedValue('resolved');

        renderWithProviders(<CharacterDetails details={mockCharacterData} />, {
            store,
        });

        expect(screen.queryByTestId('char-details')).toBeInTheDocument();
        const deleteBtn = await screen.findByTestId('char-delete-btn');
        fireEvent.click(deleteBtn);

        expect(await screen.findByTestId('char-delete-modal')).toBeVisible();
        const confirmBtn = await screen.findByTestId('modal-confirm-btn');
        fireEvent.click(confirmBtn);
        await waitFor(() => {
            expect(remove).toHaveBeenCalledTimes(2);
            expect(mockedUseNavigate).toHaveBeenCalledWith('/home');
        });
    });

    test('closes modal on cancel', async () => {
        const store = setupStore();
        store.dispatch(updateUser(mockUser as CurrentUser));

        (remove as jest.Mock).mockResolvedValue('resolved');

        renderWithProviders(<CharacterDetails details={mockCharacterData} />, {
            store,
        });

        expect(screen.queryByTestId('char-details')).toBeInTheDocument();
        const deleteBtn = await screen.findByTestId('char-delete-btn');
        fireEvent.click(deleteBtn);

        expect(await screen.findByTestId('char-delete-modal')).toBeVisible();
        const cancelBtn = await screen.findByTestId('modal-cancel-btn');
        fireEvent.click(cancelBtn);
        //expect(await screen.findByTestId("char-delete-modal"))
    });
});
