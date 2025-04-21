import { fireEvent, screen } from '@testing-library/react';
import { setupStore } from '../../../redux';
import { addItem } from '../../../redux/InventoryReducer';
import { renderWithProviders } from '../../../util/test-utils';
import Inventory from '../Inventory';

describe('Inventory', () => {
    test('renders component', () => {
        renderWithProviders(<Inventory />);
        expect(screen.queryByTestId('inventory-container')).toBeInTheDocument();
    });

    test('renders component', async () => {
        const store = setupStore();
        store.dispatch(
            addItem({
                name: 'mockItem',
                index: 'mockitem',
                quantity: 1,
            })
        );
        renderWithProviders(<Inventory edit />, { store });
        let quantity = await screen.findByTestId('mockitem-quantity');
        expect(quantity).toHaveTextContent('1');

        const incrementBtn = await screen.findByTestId('mockitem-inc-btn');
        fireEvent.click(incrementBtn);
        expect(quantity).toHaveTextContent('2');

        const decrementBtn = await screen.findByTestId('mockitem-dec-btn');
        fireEvent.click(decrementBtn);
        expect(quantity).toHaveTextContent('1');
    });
});
