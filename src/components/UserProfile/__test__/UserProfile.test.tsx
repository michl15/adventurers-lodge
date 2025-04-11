import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../util/test-utils';
import UserProfile from '../UserProfile';

describe('UserProfile', () => {
    test('renders component', () => {
        renderWithProviders(<UserProfile />);

        expect(screen.queryByTestId('user-public-profile')).toBeInTheDocument();
    });
});
