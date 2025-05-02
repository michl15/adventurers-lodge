import { Alert, Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';

const CharacterAccessDenied = () => {
    const navigate = useNavigate();
    const { charId } = useParams();

    const onReturnToHome = () => {
        navigate('/home');
    };

    const onBackToChar = () => {
        navigate(`/characters/${charId}`);
    };
    return (
        <Container data-testid="character-access-denied">
            <Alert variant="info">
                <Alert.Heading>Oops!</Alert.Heading>
                <p>
                    Looks like you don't have permission to edit this character.
                    There are plans in the works for a feature to give
                    permissions to edit other people's characters, but in the
                    meantime, please ask the creator of this character to make
                    changes to them.
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Row>
                        <Col md="auto">
                            <Button variant="info" onClick={onBackToChar}>
                                Back to Character
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="info" onClick={onReturnToHome}>
                                Return to Home
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Alert>
        </Container>
    );
};

export default CharacterAccessDenied;
