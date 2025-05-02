import { ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';
import { Class, Race } from '../../../constants/types';

type DropdownProps = {
    options: Class[] | Race[];
    onOptChange: (selectedItem: Race | Class | null) => void;
    defaultValue?: string;
    loading?: boolean;
};

const Dropdown = ({
    options,
    onOptChange,
    defaultValue,
    loading,
}: DropdownProps) => {
    const renderDropdown = () => {
        if (options.length > 0) {
            return options.map((item: Class | Race, index) => (
                <option key={`dropdown-option-${index}`}>{item.name}</option>
            ));
        }
    };

    return (
        <Form.Select
            data-testid="dropdown"
            required
            value={defaultValue || ''}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const { selectedIndex } = e.target;
                if (selectedIndex === 0) {
                    onOptChange(null);
                } else {
                    const selectedItem = options[selectedIndex - 1];
                    onOptChange(selectedItem);
                }
            }}
            disabled={loading}
        >
            <option key="no-selection"></option>
            {renderDropdown()}
        </Form.Select>
    );
};

export default Dropdown;
