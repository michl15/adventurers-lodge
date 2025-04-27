import { fireEvent, render, screen } from '@testing-library/react';
import CharacterTraits from '../CharacterTraits';
import { Trait } from '../../../constants/types';

const mockAddTrait = jest.fn();
const mockRemoveTrait = jest.fn();
const mockTraitList: Trait[] = [
    {
        name: 'Trait1',
        index: 'trait1',
        url: 'trait1url',
        source: false,
        desc: ['trait 1 info'],
    },
    {
        name: 'Trait2',
        index: 'trait2',
        url: 'trait2url',
        source: false,
        desc: ['trait 2 info'],
    },
];

describe('CharacterTraits', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders component', async () => {
        render(
            <CharacterTraits
                edit={false}
                addNewTrait={mockAddTrait}
                removeTrait={mockRemoveTrait}
                traits={mockTraitList}
            />
        );

        expect(
            await screen.findByTestId('character-traits-container')
        ).toBeInTheDocument();
    });

    test('renders component no languages', async () => {
        render(
            <CharacterTraits
                edit={false}
                addNewTrait={mockAddTrait}
                removeTrait={mockRemoveTrait}
                traits={null}
            />
        );

        expect(
            await screen.findByTestId('character-traits-container')
        ).toBeInTheDocument();
        expect(
            await screen.findByTestId('no-traits-element')
        ).toBeInTheDocument();
    });

    test('add trait valid input', async () => {
        render(
            <CharacterTraits
                edit
                addNewTrait={mockAddTrait}
                removeTrait={mockRemoveTrait}
                traits={mockTraitList}
            />
        );

        expect(
            await screen.findByTestId('character-traits-container')
        ).toBeInTheDocument();
        const addTraitBtn = await screen.findByTestId('add-trait-btn');
        fireEvent.click(addTraitBtn);
        const addTraitInput = await screen.findByTestId('add-trait-input');
        fireEvent.change(addTraitInput, { target: { value: 'new trait' } });
        const addTraitSubmit = await screen.findByTestId('add-trait-submit');
        fireEvent.click(addTraitSubmit);

        expect(mockAddTrait).toHaveBeenCalled();
    });

    test('add trait invalid input', async () => {
        render(
            <CharacterTraits
                edit
                addNewTrait={mockAddTrait}
                removeTrait={mockRemoveTrait}
                traits={mockTraitList}
            />
        );

        expect(
            await screen.findByTestId('character-traits-container')
        ).toBeInTheDocument();
        const addTraitBtn = await screen.findByTestId('add-trait-btn');
        fireEvent.click(addTraitBtn);
        const addTraitInput = await screen.findByTestId('add-trait-input');
        fireEvent.change(addTraitInput, { target: { value: 'Trait1' } });
        const addTraitInfoInput = await screen.findByTestId(
            'add-trait-info-input'
        );
        fireEvent.change(addTraitInfoInput, {
            target: { value: 'Trait1 info' },
        });
        const addTraitSubmit = await screen.findByTestId('add-trait-submit');
        fireEvent.click(addTraitSubmit);

        expect(mockAddTrait).not.toHaveBeenCalled();
    });

    test('remove trait', async () => {
        render(
            <CharacterTraits
                edit
                addNewTrait={mockAddTrait}
                removeTrait={mockRemoveTrait}
                traits={mockTraitList}
            />
        );

        expect(
            await screen.findByTestId('character-traits-container')
        ).toBeInTheDocument();
        const deleteTraitBtn = await screen.findByTestId('delete-trait-trait1');
        fireEvent.click(deleteTraitBtn);

        expect(mockRemoveTrait).toHaveBeenCalled();
    });
});
