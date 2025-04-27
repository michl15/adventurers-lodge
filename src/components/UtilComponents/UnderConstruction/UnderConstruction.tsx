import { useState } from 'react';
import { Alert, Button, Col, Collapse, Row } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router';

const UnderConstruction = () => {
    const [showAlert, setShowAlert] = useState(true);
    const navigate = useNavigate();

    return (
        <Alert variant="warning">
            <Alert.Heading>
                <Row>
                    <Col className="my-auto" md="auto">
                        <span>
                            <ExclamationTriangleFill
                                style={{ marginBottom: '7px' }}
                            />{' '}
                            Under Construction
                        </span>
                    </Col>
                    <Col className="d-flex justify-content-end my-auto">
                        <Button
                            onClick={() => {
                                setShowAlert(!showAlert);
                            }}
                            size="sm"
                            variant="outline-warning"
                        >
                            <div className="my-auto">
                                {showAlert ? 'Hide' : 'Show'}
                            </div>
                        </Button>
                    </Col>
                </Row>
            </Alert.Heading>
            <Collapse in={showAlert}>
                <div>
                    <p>
                        Heads up! Some or all of the features on this page are
                        not yet implemented. New features are continuously being
                        added, so check back soon!
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button
                            variant="warning"
                            onClick={() => {
                                navigate('/home');
                            }}
                        >
                            Return to home
                        </Button>
                    </div>
                </div>
            </Collapse>
        </Alert>
    );
};

export default UnderConstruction;
