import { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';
import { Class, Race } from '../../constants/types';

type DropdownProps = {
    options: Class[] | Race[];
    onOptChange: (selectedItem: Race | Class | null) => void;
};

const Dropdown = ({ options, onOptChange }: DropdownProps) => {
    const renderDropdown = () => {
        if (options.length > 0) {
            return options.map((item: Class | Race, index) => (
                <option key={`dropdown-option-${index}`}>{item.name}</option>
            ));
        }
    };

    return (
        <Form.Select
            required
            defaultValue={''}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const { selectedIndex } = e.target;
                if (selectedIndex === 0) {
                    onOptChange(null)
                }
                else {
                    const selectedItem = options[selectedIndex - 1]
                    onOptChange(selectedItem);
                }
            }}
        >
            <option key="no-selection"></option>
            {renderDropdown()}
        </Form.Select>
    );
};

export default Dropdown;
