import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { useEffect } from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import styled from 'styled-components';

const ProfilePhoto = styled(Image)`
    height: 120px;
    width: 120px;
    background-position: center center;
    background-repeat: no-repeat;
    overflow: hidden;
`;

const UserProfile = () => {
    const user = useSelector((state: RootState) => state.user.user);

    const image = user?.photoURL
        ? user.photoURL
        : '/assets/placeholder-icon.png';

    useEffect(() => {}, []);

    return (
        <Container data-testid="user-public-profile">
            <Row className="d-flex justify-content-center">
                <Col md="auto" className="my-auto">
                    <ProfilePhoto src={image} />
                </Col>
                <Col className="my-auto">
                    <h1>{user?.displayName || user?.email}</h1>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;
