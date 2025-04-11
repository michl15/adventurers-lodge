import { render, waitFor } from '@testing-library/react';
import ScrollToTop from '../ScrollToTop';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useLocation: () => ({
        pathname: '/',
    }),
}));

window.scrollTo = jest.fn();

describe('ScrollToTop', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('does not render a component', () => {
        const { container } = render(<ScrollToTop />);
        expect(container).toBeEmptyDOMElement();
    });

    test('calls window.scrollTo', async () => {
        render(<ScrollToTop />);
        await waitFor(() => {
            expect(window.scrollTo).toHaveBeenCalled();
        });
    });
});
