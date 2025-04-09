import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

const ErrorComponent = () => {
    throw new Error('test');
};

jest.spyOn(console, 'error').mockImplementation(jest.fn());

describe('ErrorBoundary', () => {
    test('renders on error', () => {
        render(
            <ErrorBoundary>
                <ErrorComponent />
            </ErrorBoundary>
        );
        expect(screen.queryByText('An error occurred')).toBeInTheDocument();
    });
});
