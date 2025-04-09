import { screen } from '@testing-library/react';
import CharacterDetails from '../CharacterDetails';
import { mockCharacterData } from '../../../constants/mockData';
import { renderWithProviders } from '../../../util/test-utils';

describe('CharacterDetails', () => {
    test('renders component with details', () => {
        renderWithProviders(<CharacterDetails details={mockCharacterData} />);
        expect(screen.queryByTestId('char-details')).toBeInTheDocument();
    });

    test('does not render component without details', () => {
        renderWithProviders(<CharacterDetails details={null} />);
        expect(screen.queryByTestId('char-details')).not.toBeInTheDocument();
    });
});
