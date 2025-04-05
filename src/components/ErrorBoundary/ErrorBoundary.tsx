import React, { ErrorInfo, ReactNode } from 'react';
import { Container } from 'react-bootstrap';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container>
                    <h1>An error occurred</h1>
                    <p>
                        Error: {this.state.error && this.state.error.toString()}
                    </p>
                    <p>
                        Error info:{' '}
                        {this.state.errorInfo &&
                            this.state.errorInfo.componentStack}
                    </p>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
