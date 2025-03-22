import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import CharacterDisplay from "../CharacterDisplay"
import { get } from "firebase/database";
import { mockCharacterData } from "../../../constants/mockData";

const mockExists = jest.fn();
const mockData = jest.fn();

const mockedUseNavigate = jest.fn()

jest.mock('firebase/database')

jest.mock('react-router', () => ({
    ...(jest.requireActual('react-router') as any),
    useNavigate: () => mockedUseNavigate,
}));

describe("CharacterDisplay", () => {
    beforeEach(() => {
        (get as jest.Mock).mockResolvedValue({
            exists: mockExists.mockReturnValue(true),
            val: mockData.mockReturnValueOnce({ "test char": true }).mockReturnValueOnce({ mockCharacterData })
        });
    });

    afterEach(() => {
        jest.clearAllMocks()
    })

    test("renders component", async () => {
        render(<CharacterDisplay uid={"mock uid"} />);
        await waitFor(() => expect(screen.queryByTestId("character-display-container")).toBeInTheDocument());
    });

    test("renders component if the first snapshot does not exist", async () => {
        (get as jest.Mock).mockResolvedValue({
            exists: mockExists.mockReturnValue(false),
            val: mockData.mockReturnValueOnce({ "test char": true }).mockReturnValueOnce({ mockCharacterData })
        });
        render(<CharacterDisplay uid={"mock uid"} />);
        await waitFor(() => expect(screen.queryByTestId("character-display-container")).toBeInTheDocument());
    });

    test("renders component if the second snapshot does not exist", async () => {
        (get as jest.Mock).mockResolvedValue({
            exists: mockExists.mockReturnValueOnce(true).mockReturnValueOnce(false),
            val: mockData.mockReturnValueOnce({ "test char": true }).mockReturnValueOnce({ mockCharacterData })
        });
        render(<CharacterDisplay uid={"mock uid"} />);
        await waitFor(() => expect(screen.queryByTestId("character-display-container")).toBeInTheDocument());
    });

    test("calls onClick", async () => {
        render(<CharacterDisplay uid={"mock uid"} />);
        await waitFor(() => {
            expect(screen.queryByTestId("character-display-container")).toBeInTheDocument();
            const createACharCard = screen.getByTestId("character-creation-card");
            fireEvent.click(createACharCard);
            expect(mockedUseNavigate).toHaveBeenCalled()
        });
    });

})