import { Alert, Carousel, Col, Container, Image, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { InfoCircle } from 'react-bootstrap-icons';
import styled from 'styled-components';

const SignInLink = styled.a`
    color: oklch(78.9% 0.154 211.53);

    &:hover {
        cursor: pointer;
    }
`;

const CarouselImage = styled(Image)`
    width: 100%;
    padding: 150px;
    padding-top: 0px;
`;

const wipSrc =
    'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/work-in-progress-design-template-6cc0b86afbb81d0528f26113e3ec02cf_screen.jpg?ts=1698307882';

const LandingPage = () => {
    const { user } = useSelector((state: RootState) => state.user);

    return (
        <Container>
            {!user && (
                <Row className="d-flex justify-content-md-center">
                    <Col>
                        <Alert variant="info">
                            <span>
                                <InfoCircle
                                    style={{
                                        marginBottom: '3px',
                                        marginRight: '10px',
                                    }}
                                />
                                To get started, please{' '}
                                <SignInLink href="/#/login">
                                    sign in →
                                </SignInLink>
                            </span>
                        </Alert>
                    </Col>
                </Row>
            )}
            <Row className="d-flex justify-content-md-center">
                <Col md="auto">
                    <h1>Welcome to Adventurer&apos;s Lodge!</h1>
                </Col>
            </Row>
            <Row className="d-flex justify-content-md-center">
                <Col md="auto">
                    <h3>Looking to start a campaign?</h3>
                </Col>
            </Row>
            <Row>
                <h4>For Players</h4>
                <Col>
                    <Carousel variant="dark">
                        <Carousel.Item>
                            <CarouselImage src="/assets/char-creation.png" />
                            <Carousel.Caption>
                                <h5>Simple Character Creation</h5>
                                <p>
                                    Create your characters quickly and easily,
                                    with guidance
                                </p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <CarouselImage src="/assets/char-management.png" />
                            <Carousel.Caption>
                                <h5>Character Management</h5>
                                <p>
                                    Save and edit your characters, and update
                                    their stats, inventories, and more
                                </p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </Col>
            </Row>

            <Row>
                <h4>For GMs</h4>
                <Col>
                    <Carousel variant="dark">
                        <Carousel.Item>
                            <CarouselImage src={wipSrc} />
                            <Carousel.Caption>
                                <h5>Create a campaign</h5>
                                <p>Work In Progress, check back soon!</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </Col>
            </Row>
        </Container>
    );
};

export default LandingPage;
