import { findByText, fireEvent, render, screen } from "@testing-library/react";
import ItemModal from "../ItemModal";
import { Equipment, EquipmentCategory } from "../../../constants/types";

const mockAllEquipment: Equipment[] = [
    {
        name: "Bow",
        index: "bow",
        url: "mockUrl"
    },
    {
        name: "Sword",
        index: "sword",
        url: "mockUrl"
    },
]

const mockCategories: EquipmentCategory[] = [
    {
        name: "Weapon",
        index: "weapon",
        url: "mockUrl"
    }
]

const mockCloseModal = jest.fn();

describe("ItemModal", () => {
    test("renders component", async () => {
        render(<ItemModal allEquipment={mockAllEquipment} categories={mockCategories} showModal={true} closeModal={mockCloseModal} />);

        expect(await screen.findByTestId("item-modal")).toBeInTheDocument();
    });

    test("renders equipment tab", async () => {
        render(<ItemModal allEquipment={mockAllEquipment} categories={mockCategories} showModal={true} closeModal={mockCloseModal} />);

        expect(await screen.findByTestId("item-modal")).toBeInTheDocument();
        expect(await screen.findByTestId("equipment-tab")).toBeInTheDocument();
    });

    test("renders magic items tab", async () => {
        render(<ItemModal allEquipment={mockAllEquipment} categories={mockCategories} showModal={true} closeModal={mockCloseModal} />);

        expect(await screen.findByTestId("item-modal")).toBeInTheDocument();
        const tab2 = await screen.findByTestId("tab-2");
        fireEvent.click(tab2);
        expect(await screen.findByText("Not yet implemented")).toBeInTheDocument();
    });

    test("renders custom item tab", async () => {
        render(<ItemModal allEquipment={mockAllEquipment} categories={mockCategories} showModal={true} closeModal={mockCloseModal} />);

        expect(await screen.findByTestId("item-modal")).toBeInTheDocument();
        const tab3 = await screen.findByTestId("tab-3");
        fireEvent.click(tab3);
        expect(await screen.findByText("Not yet implemented")).toBeInTheDocument();
    });
})