import { act, fireEvent, screen } from '@testing-library/react';
import EquipmentTab from '../EquipmentTab';
import { EquipmentCategory, EquipmentData } from '../../../constants/types';
import selectEvent from 'react-select-event';
import { renderWithProviders } from '../../../util/test-utils';
import { setupStore } from '../../../redux';
import { setEquipment } from '../../../redux/EquipmentReducer';

const mockAllEquipment: EquipmentData[] = [
    {
        name: 'Bow',
        index: 'bow',
        weapon_category: {
            name: 'Weapon',
        },
    },
    {
        name: 'Sword',
        index: 'sword',
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
        renderWithProviders(<EquipmentTab categories={mockCategories} />);

        expect(await screen.findByTestId('equipment-tab')).toBeInTheDocument();
    });

    test('select category change', async () => {
        renderWithProviders(<EquipmentTab categories={mockCategories} />);

        expect(await screen.findByTestId('equipment-tab')).toBeInTheDocument();
        const selectElement = await screen.findByLabelText('Category');
        await selectEvent.select(selectElement, ['Weapon']);
    });

    test('submit button click', async () => {
        const store = setupStore();
        store.dispatch(setEquipment(mockAllEquipment));
        act(() => {
            renderWithProviders(<EquipmentTab categories={mockCategories} />, {
                store,
            });
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

        expect(await screen.findByTestId('item-card-bow')).toBeInTheDocument();
    });
});
