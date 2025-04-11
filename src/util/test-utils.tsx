import { render, RenderOptions } from '@testing-library/react';
import { AppStore, RootState, setupStore } from '../redux';
import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router';

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
        <HashRouter>
            <Provider store={store}>{children}</Provider>
        </HashRouter>
    );

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
};
