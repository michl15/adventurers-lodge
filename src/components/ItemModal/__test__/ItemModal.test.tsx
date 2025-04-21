import { fireEvent, render, screen } from '@testing-library/react';
import ItemModal from '../ItemModal';
import { Equipment, EquipmentCategory } from '../../../constants/types';
import { renderWithProviders } from '../../../util/test-utils';

const mockAllEquipment: Equipment[] = [
    {
        name: 'Bow',
        index: 'bow',
    },
    {
        name: 'Sword',
        index: 'sword',
    },
];

const mockCategories: EquipmentCategory[] = [
    {
        name: 'Weapon',
        index: 'weapon',
        url: 'mockUrl',
    },
];

const mockCloseModal = jest.fn();

describe('ItemModal', () => {
    test('renders component', async () => {
        renderWithProviders(
            <ItemModal
                categories={mockCategories}
                showModal={true}
                closeModal={mockCloseModal}
            />
        );

        expect(await screen.findByTestId('item-modal')).toBeInTheDocument();
    });

    test('closes modal', async () => {
        renderWithProviders(
            <ItemModal
                categories={mockCategories}
                showModal={true}
                closeModal={mockCloseModal}
            />
        );

        expect(await screen.findByTestId('item-modal')).toBeInTheDocument();
        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);
        expect(mockCloseModal).toHaveBeenCalled();
    });

    test('renders equipment tab', async () => {
        renderWithProviders(
            <ItemModal
                categories={mockCategories}
                showModal={true}
                closeModal={mockCloseModal}
            />
        );

        expect(await screen.findByTestId('item-modal')).toBeInTheDocument();
        expect(await screen.findByTestId('equipment-tab')).toBeInTheDocument();
    });

    test('renders custom items tab', async () => {
        renderWithProviders(
            <ItemModal
                categories={mockCategories}
                showModal={true}
                closeModal={mockCloseModal}
            />
        );

        expect(await screen.findByTestId('item-modal')).toBeInTheDocument();
        const tab2 = await screen.findByTestId('tab-2');
        fireEvent.click(tab2);
        expect(
            await screen.findByText('Not yet implemented')
        ).toBeInTheDocument();
    });
});
