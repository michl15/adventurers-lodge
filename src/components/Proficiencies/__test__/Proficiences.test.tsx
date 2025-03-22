import { fireEvent, render, screen } from "@testing-library/react";
import Proficiencies from "../Proficiencies"

const mockSkills = {
    "Acrobatics": true,
    "Athletics": false
}

const mockProficiencesProps = {
    charLvl: 1,
    onSwitchChange: jest.fn(),
    charSkills: mockSkills,
}

describe("Proficiencies", () => {
    test("renders the component", () => {
        render(<Proficiencies
            charLvl={mockProficiencesProps.charLvl}
            onSwitchChange={mockProficiencesProps.onSwitchChange}
            charSkills={mockProficiencesProps.charSkills}
            editMode={true} />);

        expect(screen.getByTestId("proficiencies-list")).toBeInTheDocument();
    });

    test("renders the correct proficiency bonus", () => {
        render(<Proficiencies
            charLvl={mockProficiencesProps.charLvl}
            onSwitchChange={mockProficiencesProps.onSwitchChange}
            charSkills={mockProficiencesProps.charSkills}
            editMode={true} />);

        const acrobaticsProfBonus = screen.getByTestId("Acrobatics-switch-proficiency-bonus")
        expect(acrobaticsProfBonus).toBeInTheDocument();
        expect(acrobaticsProfBonus).toHaveTextContent("+2");

        const athleticsProfBonus = screen.getByTestId("Athletics-switch-proficiency-bonus")
        expect(athleticsProfBonus).toBeInTheDocument();
        expect(athleticsProfBonus).toHaveTextContent("+0");

    });

    test("calls switch onChange function", () => {
        render(<Proficiencies
            charLvl={mockProficiencesProps.charLvl}
            onSwitchChange={mockProficiencesProps.onSwitchChange}
            charSkills={mockProficiencesProps.charSkills}
            editMode={true} />);

        const acrobaticsSwitch = screen.getByTestId("Acrobatics-switch");
        expect(acrobaticsSwitch).toBeInTheDocument();
        fireEvent.click(acrobaticsSwitch);
        expect(mockProficiencesProps.onSwitchChange).toHaveBeenCalledWith("Acrobatics")
    });

    test("does not disable switches when editMode is true", () => {
        render(<Proficiencies
            charLvl={mockProficiencesProps.charLvl}
            onSwitchChange={mockProficiencesProps.onSwitchChange}
            charSkills={mockProficiencesProps.charSkills}
            editMode={true} />);

        const acrobaticsSwitch = screen.getByTestId("Acrobatics-switch");
        expect(acrobaticsSwitch).toBeInTheDocument();
        expect(acrobaticsSwitch).not.toBeDisabled()
    })

    test("disables switches when editMode is false", () => {
        render(<Proficiencies
            charLvl={mockProficiencesProps.charLvl}
            onSwitchChange={mockProficiencesProps.onSwitchChange}
            charSkills={mockProficiencesProps.charSkills} />);

        const acrobaticsSwitch = screen.getByTestId("Acrobatics-switch");
        expect(acrobaticsSwitch).toBeInTheDocument();
        expect(acrobaticsSwitch).toBeDisabled()
    })
})