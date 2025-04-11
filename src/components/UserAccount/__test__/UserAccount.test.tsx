import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../util/test-utils';
import UserAccount from '../UserAccount';

jest.mock('firebase/database', () => {
    const mockUpdate = jest.fn();
    return {
        update: mockUpdate,
        ref: () => 'ref',
        getDatabase: jest.fn(),
        mockUpdate,
    };
});

describe('UserAcount', () => {
    test('renders component', () => {
        renderWithProviders(<UserAccount />);

        expect(
            screen.queryByTestId('user-account-settings')
        ).toBeInTheDocument();
        expect(screen.getByTestId('display-name-input')).toBeDisabled();
    });

    test('updates displayname', async () => {
        renderWithProviders(<UserAccount />);
        expect(
            screen.queryByTestId('user-account-settings')
        ).toBeInTheDocument();

        const { mockUpdate } = require('firebase/database');

        const displayNameInput =
            await screen.findByTestId('display-name-input');
        const editBtn = await screen.findByTestId('edit-display-name-btn');
        fireEvent.click(editBtn);
        expect(displayNameInput).toBeEnabled();
        fireEvent.change(displayNameInput, { target: { value: 'test' } });
        const saveBtn = await screen.findByTestId('save-display-name-btn');
        fireEvent.click(saveBtn);

        expect(mockUpdate).toHaveBeenCalledWith('ref', { displayName: 'test' });
    });

    test('cancels update displayname', async () => {
        renderWithProviders(<UserAccount />);
        expect(
            screen.queryByTestId('user-account-settings')
        ).toBeInTheDocument();

        const displayNameInput =
            await screen.findByTestId('display-name-input');
        const editBtn = await screen.findByTestId('edit-display-name-btn');
        fireEvent.click(editBtn);
        expect(displayNameInput).toBeEnabled();
        fireEvent.change(displayNameInput, { target: { value: 'test' } });
        const cancelBtn = await screen.findByTestId(
            'cancel-edit-display-name-btn'
        );
        fireEvent.click(cancelBtn);

        expect(displayNameInput).toBeDisabled();
    });
});
