import { ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import { Class, Race } from "../../constants/types";

type DropdownProps = {
    options: Class[] | Race[];
    onOptChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown = ({options, onOptChange}: DropdownProps) => {
    const renderDropdown = () => {
        if (options.length > 0) {
            return options.map((item: Class | Race) => (
                <option key={item.index}>{item.name}</option>
            ))
        }
    }

    return (
        <Form.Select required defaultValue={""} onChange={(e: ChangeEvent<HTMLSelectElement>) => {onOptChange(e)}}>
            <option key="no-selection"></option>
            {renderDropdown()}
        </Form.Select>
    )
}

export default Dropdown;