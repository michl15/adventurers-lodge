import { render, screen } from '@testing-library/react';
import PageContainer from '../PageContainer';

const mockChild = <div />;

describe('PageContainer', () => {
    test('renders component', () => {
        render(<PageContainer children={mockChild} />);

        expect(screen.getByTestId('page-container')).toBeInTheDocument();
    });
});
