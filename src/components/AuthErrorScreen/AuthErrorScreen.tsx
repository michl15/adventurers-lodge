import { Button, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

const AuthErrorContainer = styled(Container)`
    margin: 150px auto;
    border: 1px solid #dee2e6;
    padding: 50px 50px;
    border-radius: 15px;
    max-width: 80%;
`;

const AuthErrorScreen = () => {
    const navigate = useNavigate();

    const onReturnToLogin = () => {
        navigate('/');
    };
    return (
        <AuthErrorContainer>
            <Row className="d-flex justify-content-md-center">
                <h1 style={{ textAlign: 'center' }}>
                    Looks like you&apos;ve been signed out
                </h1>
            </Row>
            <Row className="d-flex justify-content-md-center">
                <p style={{ textAlign: 'center' }}>
                    To view your profile and characters, please log back in.
                </p>
            </Row>
            <br />
            <Row className="justify-content-md-center">
                <Button onClick={onReturnToLogin}>Return to Login</Button>
            </Row>
        </AuthErrorContainer>
    );
};

export default AuthErrorScreen;
