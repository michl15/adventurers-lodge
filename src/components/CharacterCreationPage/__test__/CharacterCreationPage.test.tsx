import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CharacterCreationPage from '../CharacterCreationPage';
import { onAuthStateChanged } from 'firebase/auth';
import { push, set } from 'firebase/database';
import { rollStat } from '../../../util/calculations';
import { Provider } from 'react-redux';
import { store } from '../../../redux';

const mockedUseNavigate = jest.fn();
window.scrollTo = jest.fn();

jest.spyOn(console, 'error');

jest.mock('react-router', () => ({
    ...(jest.requireActual('react-router') as any),
    useNavigate: () => mockedUseNavigate,
}));

jest.mock('../../../util/calculations', () => ({
    ...(jest.requireActual('../../../util/calculations') as any),
    rollStat: jest.fn(),
}));

const mockRaceAPIResp = {
    json: () =>
        Promise.resolve({
            languages: [
                {
                    name: 'common',
                    index: 'common',
                    url: 'mockUrl',
                },
            ],
            traits: [
                {
                    name: 'test trait',
                    index: 'test-trait',
                    url: 'mockUrl',
                },
            ],
            ability_bonuses: [
                {
                    ability_score: {
                        index: 'str',
                        name: 'str',
                    },
                    bonus: 2,
                },
            ],
        }),
    ok: true,
    status: 200,
};

const mockDesc = {
    json: () =>
        Promise.resolve({
            desc: ['mock desc'],
        }),
    ok: true,
    status: 200,
};

jest.mock('firebase/auth');
jest.mock('firebase/database');

describe('CharacterCreationPage', () => {
    beforeEach(() => {
        global.fetch = jest.fn();

        const mockResponseData = {
            results: [
                { name: 'mockName', url: 'mockUrl', index: 'mockIndex' },
                { name: 'mockName2', url: 'mockUrl2', index: 'mockIndex2' },
            ],
        };

        (global.fetch as jest.Mock).mockResolvedValue({
            json: () => Promise.resolve(mockResponseData),
            ok: true,
            status: 200,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders component', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
    });

    //#region input onchanges
    test('character name onChange', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);
        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const nameInput = await screen.findByTestId('char-name-input');
        fireEvent.change(nameInput, { target: { value: 'mockName' } });
        expect(nameInput).toHaveValue('mockName');
    });

    test('character level onChange', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });

        const lvlInput = await screen.findByTestId('char-lvl-input');
        fireEvent.change(lvlInput, { target: { value: 12 } });
        expect(lvlInput).toHaveValue('12');
    });

    test('character level onChange empty', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });

        const lvlInput = await screen.findByTestId('char-lvl-input');
        fireEvent.change(lvlInput, { target: { value: '' } });
        expect(lvlInput).toHaveValue('');
    });

    test('character level onChange non-number value', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });

        const lvlInput = await screen.findByTestId('char-lvl-input');
        fireEvent.change(lvlInput, { target: { value: 'text' } });
        expect(lvlInput).toHaveValue('1');
    });

    test('character custom race onChange', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);
        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const customRaceBtn = await screen.findByTestId('char-custom-race-btn');
        fireEvent.click(customRaceBtn);
        const raceInput = await screen.findByTestId('char-race-input');
        fireEvent.change(raceInput, { target: { value: 'custom race' } });
        expect(raceInput).toHaveValue('custom race');
    });

    test('character custom race onChange empty', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);
        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const customRaceBtn = await screen.findByTestId('char-custom-race-btn');
        fireEvent.click(customRaceBtn);
        const raceInput = await screen.findByTestId('char-race-input');
        fireEvent.change(raceInput, { target: { value: 'custom race' } });
        fireEvent.change(raceInput, { target: { value: '' } });
        expect(raceInput).toHaveValue('');
    });

    test('character custom class onChange', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);
        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const customClassBtn = await screen.findByTestId(
            'char-custom-class-btn'
        );
        fireEvent.click(customClassBtn);
        const classInput = await screen.findByTestId('char-class-input');
        fireEvent.change(classInput, { target: { value: 'custom class' } });
        expect(classInput).toHaveValue('custom class');
    });

    test('character custom class onChange empty', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);
        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const customClassBtn = await screen.findByTestId(
            'char-custom-class-btn'
        );
        fireEvent.click(customClassBtn);
        const classInput = await screen.findByTestId('char-class-input');
        fireEvent.change(classInput, { target: { value: 'init' } }); // need value to change in order to trigger onChange
        fireEvent.change(classInput, { target: { value: '' } });
        expect(classInput).toHaveValue('');
    });

    test('character stats onChange positive modifier', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const statInput = await screen.findByTestId('stats-input-dex');
        fireEvent.change(statInput, { target: { value: 12 } });
        expect(statInput).toHaveValue('12');
        const statModifier = await screen.findByTestId('stats-modifier-dex');
        expect(statModifier).toHaveTextContent('+1');
    });

    test('character stats onChange negative modifier', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const statInput = await screen.findByTestId('stats-input-dex');
        fireEvent.change(statInput, { target: { value: 8 } });
        expect(statInput).toHaveValue('8');
        const statModifier = await screen.findByTestId('stats-modifier-dex');
        expect(statModifier).toHaveTextContent('-1');
    });

    test('character stats onChange empty', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const statInput = await screen.findByTestId('stats-input-dex');
        fireEvent.change(statInput, { target: { value: '' } });
        expect(statInput).toHaveValue('');
        const statModifier = await screen.findByTestId('stats-modifier-dex');
        expect(statModifier).toHaveTextContent('-5');
    });

    test('character stats onChange non-number value', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const statInput = await screen.findByTestId('stats-input-con');
        fireEvent.change(statInput, { target: { value: 'text' } });
        expect(statInput).toHaveValue('10');
        const statModifier = await screen.findByTestId('stats-modifier-con');
        expect(statModifier).toHaveTextContent('+0');
    });

    test('max HP onChange', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const maxHP = await screen.findByTestId('char-max-hp');
        expect(maxHP).toHaveValue('10');
        fireEvent.change(maxHP, { target: { value: 20 } });
        expect(maxHP).toHaveValue('20');
    });

    test('max HP onChange empty', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const maxHP = await screen.findByTestId('char-max-hp');
        expect(maxHP).toHaveValue('10');
        fireEvent.change(maxHP, { target: { value: '' } });
        expect(maxHP).toHaveValue('');
    });

    test('max HP onChange non-number string', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const maxHP = await screen.findByTestId('char-max-hp');
        expect(maxHP).toHaveValue('10');
        fireEvent.change(maxHP, { target: { value: 'text' } });
        expect(maxHP).toHaveValue('10');
    });

    test('description onChange', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const description = await screen.findByTestId('char-description-input');
        expect(description).toHaveValue('');
        fireEvent.change(description, { target: { value: 'test input' } });
        expect(description).toHaveValue('test input');
    });

    test('switches onChange', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const skillSwitch = await screen.findByTestId('Acrobatics-switch');
        const profBonus = await screen.findByTestId(
            'Acrobatics-switch-proficiency-bonus'
        );
        expect(profBonus).toHaveTextContent('+0');
        fireEvent.click(skillSwitch);
        expect(profBonus).toHaveTextContent('+2');
    });

    test('rollStats onClick', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const rollStatsBtn = await screen.findByTestId('roll-stats');
        fireEvent.click(rollStatsBtn);
        expect(rollStat).toHaveBeenCalled();
    });

    test('resetStats onClick', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });

        const statInput = await screen.findByTestId('stats-input-dex');
        fireEvent.change(statInput, { target: { value: 12 } });
        expect(statInput).toHaveValue('12');
        const resetStatsBtn = await screen.findByTestId('reset-stats');
        fireEvent.click(resetStatsBtn);
        expect(statInput).toHaveValue('10');
    });

    //#endregion

    //#region dropdown onchange
    test('character race dropdown apply stats', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const dropdowns = await screen.findAllByTestId('dropdown');
        const classDropdown = dropdowns[0];

        (global.fetch as jest.Mock)
            .mockResolvedValueOnce(mockRaceAPIResp)
            .mockResolvedValueOnce(mockDesc);
        fireEvent.change(classDropdown, { target: { selectedIndex: 1 } });
        await waitFor(() => {
            expect(screen.getByTestId('race-info-alert')).toBeInTheDocument();
        });

        const strStat = await screen.findByTestId('stats-input-str');
        expect(strStat).toHaveValue('10');
        const applyBonusBtn = await screen.findByTestId('apply-bonus-btn');
        fireEvent.click(applyBonusBtn);

        expect(strStat).toHaveValue('12');
    });

    test('character race dropdown', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const dropdowns = await screen.findAllByTestId('dropdown');
        const raceDropDown = dropdowns[0];
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce(mockRaceAPIResp)
            .mockResolvedValueOnce(mockDesc);
        fireEvent.change(raceDropDown, { target: { selectedIndex: 1 } });

        const alert = await screen.findByTestId('race-info-alert');

        await waitFor(() => {
            expect(alert).toBeInTheDocument();
        });

        (global.fetch as jest.Mock)
            .mockResolvedValueOnce(mockRaceAPIResp)
            .mockResolvedValueOnce(mockDesc);
        fireEvent.change(raceDropDown, { target: { selectedIndex: 2 } });
        await waitFor(() => {
            expect(alert).toBeInTheDocument();
        });

        fireEvent.change(raceDropDown, { target: { selectedIndex: 0 } });
        await waitFor(() => {
            expect(alert).not.toBeInTheDocument();
        });
    });

    test('character class dropdown', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);
        const classDropdown = screen.getAllByTestId('dropdown')[1];

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
            expect(
                screen.queryByTestId('class-info-alert')
            ).not.toBeInTheDocument();
        });

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: () =>
                Promise.resolve({
                    hit_die: 10,
                    proficiency_choices: [{ desc: 'test desc' }],
                }),
            ok: true,
            status: 200,
        });
        fireEvent.change(classDropdown, { target: { selectedIndex: 1 } });
        await waitFor(() => {
            expect(
                screen.queryByTestId('class-info-alert')
            ).toBeInTheDocument();
        });

        fireEvent.change(classDropdown, { target: { selectedIndex: 0 } });
        await waitFor(() => {
            expect(
                screen.queryByTestId('class-info-alert')
            ).not.toBeInTheDocument();
        });

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: () =>
                Promise.resolve({
                    hit_die: 10,
                    proficiency_choices: [{ desc: 'test desc' }],
                }),
            ok: true,
            status: 200,
        });
        fireEvent.change(classDropdown, { target: { selectedIndex: 2 } });
        await waitFor(() => {
            expect(
                screen.queryByTestId('class-info-alert')
            ).toBeInTheDocument();
        });
    });

    test('hit die dropdown onchange', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });
        const hitDieDropdown = screen.getByTestId('hit-die-select');
        fireEvent.change(hitDieDropdown, { target: { selectedIndex: 0 } });
        expect(hitDieDropdown).toHaveValue('d6');
    });
    //#endregion

    //#region add/remove traits/languages
    test('add and delete language', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });

        const addLangBtn = await screen.findByTestId('add-language-btn');
        fireEvent.click(addLangBtn);
        const addLangInput = await screen.findByTestId('add-language-input');
        fireEvent.change(addLangInput, { target: { value: 'new lang' } });
        const addLangSubmit = await screen.findByTestId('add-language-submit');
        fireEvent.click(addLangSubmit);
        const newLanguageField = await screen.findByText('new lang');
        expect(newLanguageField).toBeInTheDocument();

        //delete
        const deleteLangBtn = await screen.findByTestId(
            'delete-language-new-lang'
        );
        fireEvent.click(deleteLangBtn);
        expect(newLanguageField).not.toBeInTheDocument();
    });

    test('add and delete trait', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
        });

        const addTraitBtn = await screen.findByTestId('add-trait-btn');
        fireEvent.click(addTraitBtn);
        const addTraitInput = await screen.findByTestId('add-trait-input');
        fireEvent.change(addTraitInput, { target: { value: 'new trait' } });
        const addTraitSubmit = await screen.findByTestId('add-trait-submit');
        fireEvent.click(addTraitSubmit);
        const newTraitField = await screen.findByTestId('trait-new-trait');
        expect(newTraitField).toBeInTheDocument();

        //delete
        fireEvent.click(newTraitField);
        const deleteLangBtn = await screen.findByTestId(
            'delete-trait-new-trait'
        );
        fireEvent.click(deleteLangBtn);
        expect(newTraitField).not.toBeInTheDocument();
    });
    //#endregion

    //#region submit button tests
    test('submit button click invalid form', async () => {
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            const submitBtn = screen.getByTestId('create-char-submit');
            fireEvent.click(submitBtn, {
                currentTarget: {
                    checkValidity: () => {
                        return false;
                    },
                },
            });
            expect(window.scrollTo).toHaveBeenCalled();
        });
    });

    test('submit button click valid form', async () => {
        const mockedAuthCallback = (_auth: any, callback: any) => {
            callback({ user: 'test user' });
        };
        (onAuthStateChanged as jest.Mock).mockImplementation(
            mockedAuthCallback
        );
        (set as jest.Mock).mockResolvedValue('');
        (push as jest.Mock).mockReturnValue({ key: 'testkey' });
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
            const form = screen.getByTestId('character-creation-form') as any;
            form.checkValidity = jest.fn(() => {
                return true;
            });
            const submitBtn = screen.getByTestId('create-char-submit');
            fireEvent.click(submitBtn, {
                currentTarget: {
                    checkValidity: () => {
                        return true;
                    },
                },
            });
            expect(push).toHaveBeenCalled();
            expect(mockedUseNavigate).toHaveBeenCalled();
        });
    });

    test('submit button click valid form with error', async () => {
        const mockedAuthCallback = (_auth: any, callback: any) => {
            callback({ user: 'test user' });
        };
        (onAuthStateChanged as jest.Mock).mockImplementation(
            mockedAuthCallback
        );
        (set as jest.Mock).mockRejectedValue('');
        (push as jest.Mock).mockReturnValue({ key: 'testkey' });
        render(<Provider store={store}><CharacterCreationPage /></Provider>);

        await waitFor(() => {
            expect(
                screen.queryByTestId('character-creation-page-container')
            ).toBeInTheDocument();
            const form = screen.getByTestId('character-creation-form') as any;
            form.checkValidity = jest.fn(() => {
                return true;
            });
            const submitBtn = screen.getByTestId('create-char-submit');
            fireEvent.click(submitBtn, {
                currentTarget: {
                    checkValidity: () => {
                        return true;
                    },
                },
            });
            expect(console.error).toHaveBeenCalled();
        });
    });
    //#endregion
});
