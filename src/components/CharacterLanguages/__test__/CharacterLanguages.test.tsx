import {
    fireEvent,
    render,
    screen,
} from '@testing-library/react';
import CharacterLanguages from '../CharacterLanguages';
import { Language } from '../../../constants/types';

const mockAddLang = jest.fn();
const mockRemoveLang = jest.fn();
const mockLanguageList: Language[] = [
    {
        name: 'Lang1',
        index: 'lang1',
        url: 'lang1url',
        source: 'lang1source',
    },
    {
        name: 'Lang2',
        index: 'lang2',
        url: 'lang2url',
        source: false,
    },
];

describe('CharacterLanguages', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders component', async () => {
        render(
            <CharacterLanguages
                onAddLang={mockAddLang}
                onRemoveLang={mockRemoveLang}
                langList={mockLanguageList}
                edit={false}
            />
        );

        const container = await screen.findByTestId('languages-container');
        expect(container).toBeInTheDocument();
        const addLangBtn = screen.queryByTestId('add-language-btn');
        expect(addLangBtn).not.toBeInTheDocument();
    });

    test('renders component with no languages', async () => {
        render(
            <CharacterLanguages
                onAddLang={mockAddLang}
                onRemoveLang={mockRemoveLang}
                langList={null}
                edit={false}
            />
        );

        const container = await screen.findByTestId('languages-container');
        expect(container).toBeInTheDocument();
        const emptyList = await screen.findByTestId('no-languages');
        expect(emptyList).toHaveTextContent(
            'No languages added for this character'
        );
    });

    test('adds language valid input', async () => {
        render(
            <CharacterLanguages
                onAddLang={mockAddLang}
                onRemoveLang={mockRemoveLang}
                langList={mockLanguageList}
                edit={true}
            />
        );

        const container = await screen.findByTestId('languages-container');
        expect(container).toBeInTheDocument();
        const addLangBtn = await screen.findByTestId('add-language-btn');
        fireEvent.click(addLangBtn);
        const addLangInput = await screen.findByTestId('add-language-input');
        fireEvent.change(addLangInput, { target: { value: 'new language' } });
        const addLangSubmit = await screen.findByTestId('add-language-submit');
        fireEvent.click(addLangSubmit);

        expect(mockAddLang).toHaveBeenCalled();
    });

    test('adds language non unique input', async () => {
        render(
            <CharacterLanguages
                onAddLang={mockAddLang}
                onRemoveLang={mockRemoveLang}
                langList={mockLanguageList}
                edit={true}
            />
        );

        const container = await screen.findByTestId('languages-container');
        expect(container).toBeInTheDocument();
        const addLangBtn = await screen.findByTestId('add-language-btn');
        fireEvent.click(addLangBtn);
        const addLangInput = await screen.findByTestId('add-language-input');
        fireEvent.change(addLangInput, { target: { value: 'Lang1' } });
        const addLangSubmit = await screen.findByTestId('add-language-submit');
        fireEvent.click(addLangSubmit);

        expect(mockAddLang).not.toHaveBeenCalled();
        expect(
            await screen.findByTestId('invalid-language-input')
        ).toBeInTheDocument();
    });

    test('adds language cancel', async () => {
        render(
            <CharacterLanguages
                onAddLang={mockAddLang}
                onRemoveLang={mockRemoveLang}
                langList={mockLanguageList}
                edit={true}
            />
        );

        const container = await screen.findByTestId('languages-container');
        expect(container).toBeInTheDocument();
        const addLangBtn = await screen.findByTestId('add-language-btn');
        fireEvent.click(addLangBtn);
        const cancelBtn = await screen.findByTestId('add-language-cancel');
        fireEvent.click(cancelBtn);
        //expect(await screen.findByTestId("add-language-cancel")).not.toBeVisible();
        // TODO: figure out why this isn't working
    });

    test('removes language', async () => {
        render(
            <CharacterLanguages
                onAddLang={mockAddLang}
                onRemoveLang={mockRemoveLang}
                langList={mockLanguageList}
                edit={true}
            />
        );

        const container = await screen.findByTestId('languages-container');
        expect(container).toBeInTheDocument();
        const delLangBtn = await screen.findByTestId('delete-language-lang1');
        fireEvent.click(delLangBtn);
        expect(screen.queryByText('Lang 1')).not.toBeInTheDocument();
        expect(mockRemoveLang).toHaveBeenCalled();
    });
});
