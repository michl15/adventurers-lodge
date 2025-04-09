import { fireEvent, screen } from '@testing-library/react';
import { mockArmor, mockSword } from '../../../constants/mockData';
import { renderWithProviders } from '../../../util/test-utils';
import ItemCard from '../ItemCard';

describe('ItemCard', () => {
    test('renders component', () => {
        renderWithProviders(<ItemCard itemData={mockSword} />);
        expect(screen.queryByTestId('item-card-sword')).toBeInTheDocument();
    });

    test('renders component with desc tag', () => {
        renderWithProviders(<ItemCard itemData={mockArmor} />);
        expect(screen.queryByTestId('item-card-armor')).toBeInTheDocument();
        expect(screen.queryByTestId('desc-tag')).toBeInTheDocument();
    });

    test('increments/decrements component', async () => {
        renderWithProviders(<ItemCard itemData={mockSword} />);
        expect(screen.queryByTestId('item-card-sword')).toBeInTheDocument();

        const incrementBtn = await screen.findByTestId('increment-item-sword');
        const decrementBtn = await screen.findByTestId('decrement-item-sword');
        const quantity = await screen.findByTestId('item-quantity-sword');

        expect(quantity).toHaveTextContent('0');
        fireEvent.click(incrementBtn);
        expect(quantity).toHaveTextContent('1');
        fireEvent.click(incrementBtn);
        expect(quantity).toHaveTextContent('2');
        fireEvent.click(decrementBtn);
        expect(quantity).toHaveTextContent('1');
    });
});
