import { act, fireEvent, render, screen } from '@testing-library/react';
import EquipmentTab from '../EquipmentTab';
import {
    Equipment,
    EquipmentCategory,
    EquipmentData,
} from '../../../constants/types';
import selectEvent from 'react-select-event';
import { Provider } from 'react-redux';
import { store } from '../../../redux';

const mockAllEquipment: Equipment[] = [
    {
        name: 'Bow',
        index: 'bow',
        url: 'mockUrl',
    },
    {
        name: 'Sword',
        index: 'sword',
        url: 'mockUrl',
    },
];

const mockWeaponCategory = {
    name: 'Weapon',
    index: 'weapon',
    url: 'mockUrl',
};

const mockCategories: EquipmentCategory[] = [mockWeaponCategory];

describe('EquipmentTab', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        (global.fetch as jest.Mock).mockResolvedValue(
            Promise.resolve({
                ok: true,
                json: jest
                    .fn()
                    .mockResolvedValue(
                        Promise.resolve({ equipment: mockAllEquipment })
                    ),
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    test('renders component', async () => {
        render(
            <Provider store={store}><EquipmentTab
                allEquipment={mockAllEquipment}
                categories={mockCategories}
            />
            </Provider>
        );

        expect(await screen.findByTestId('equipment-tab')).toBeInTheDocument();
    });

    test('select category change', async () => {
        render(
            <Provider store={store}><EquipmentTab
                allEquipment={mockAllEquipment}
                categories={mockCategories}
            />
            </Provider>
        );

        expect(await screen.findByTestId('equipment-tab')).toBeInTheDocument();
        const selectElement = await screen.findByLabelText('Category');
        await selectEvent.select(selectElement, ['Weapon']);
    });

    test('submit button click', async () => {
        act(() => {
            render(
                <Provider store={store}><EquipmentTab
                    allEquipment={mockAllEquipment}
                    categories={mockCategories}
                />
                </Provider>
            );
        });

        expect(await screen.findByTestId('equipment-tab')).toBeInTheDocument();

        const selectElement = await screen.findByLabelText('Category');
        await selectEvent.select(selectElement, ['Weapon']);

        const searchInput = await screen.findByTestId('search-input');
        const searchButton = await screen.findByTestId('search-submit');

        act(() => {
            fireEvent.change(searchInput, { target: { value: 'Bow' } });
            fireEvent.click(searchButton);
        });

        expect(
            await screen.findByTestId('item-card-undefined')
        ).toBeInTheDocument();
    });
});
