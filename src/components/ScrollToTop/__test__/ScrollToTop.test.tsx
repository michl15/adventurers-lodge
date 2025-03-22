import { render } from "@testing-library/react"
import ScrollToTop from "../ScrollToTop"

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useLocation: () => ({
        pathname: "/"
    })
}));

window.scrollTo = jest.fn();

describe("ScrollToTop", () => {
    test("does not render a component", () => {
        const { container } = render(<ScrollToTop />);
        expect(container).toBeEmptyDOMElement();
    });

    test("calls window.scrollTo", () => {
        render(<ScrollToTop />);
        expect(window.scrollTo).toHaveBeenCalledTimes(1);
    })
})