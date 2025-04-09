import { mockCharacterData } from '../../../constants/mockData';
import { renderWithProviders } from '../../../util/test-utils';
import CharacterPage from '../CharacterPage';
import { screen } from '@testing-library/react';

jest.spyOn(console, 'error').mockImplementation(jest.fn());

jest.mock('firebase/database', () => {
    const mockedGet = jest.fn();
    return {
        ref: jest.fn(),
        get: mockedGet,
        getDatabase: jest.fn(),
        mockedGet,
    };
});

describe('CharacterPage', () => {
    test('render component', async () => {
        const { mockedGet } = require('firebase/database');
        mockedGet.mockResolvedValue({
            exists: () => true,
            val: () => mockCharacterData,
        });
        renderWithProviders(<CharacterPage />);

        expect(await screen.findByTestId('character-page')).toBeInTheDocument();
    });

    test('render component ', async () => {
        const { mockedGet } = require('firebase/database');
        mockedGet.mockResolvedValue({
            exists: () => false,
            val: () => {},
        });
        renderWithProviders(<CharacterPage />);

        expect(await screen.findByTestId('missing-char')).toBeInTheDocument();
    });
});
