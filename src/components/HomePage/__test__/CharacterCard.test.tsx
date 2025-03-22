import { fireEvent, render, screen } from '@testing-library/react';
import CharacterCard from '../CharacterCard';
import { mockCharacterData } from '../../../constants/mockData';

const mockedUseNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...(jest.requireActual('react-router') as any),
    useNavigate: () => mockedUseNavigate,
}));

describe('CharacterCard', () => {
    test('renders component', () => {
        render(<CharacterCard characterData={mockCharacterData} />);

        expect(screen.queryByTestId('character-card')).toBeInTheDocument();
        expect(screen.getByTestId('character-card-name')).toHaveTextContent(
            mockCharacterData.name
        );
    });

    test('calls onClick', () => {
        render(<CharacterCard characterData={mockCharacterData} />);

        const card = screen.getByTestId('character-card');
        fireEvent.click(card);
        expect(mockedUseNavigate).toHaveBeenCalledWith(
            `/characters/${mockCharacterData.key}`
        );
    });
});
