import { render, RenderOptions } from '@testing-library/react';
import { AppStore, RootState, setupStore } from '../redux';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: Partial<RootState>;
    store?: AppStore;
}

export const renderWithProviders = (
    ui: React.ReactElement,
    extendedRenderOptions: ExtendedRenderOptions = {}
) => {
    const {
        preloadedState = {},
        // Automatically create a store instance if no store was passed in
        store = setupStore(preloadedState),
        ...renderOptions
    } = extendedRenderOptions;

    const Wrapper = ({ children }: PropsWithChildren) => (
        <Provider store={store}>{children}</Provider>
    );

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
};
