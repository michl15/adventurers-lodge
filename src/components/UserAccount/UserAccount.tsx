import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import {
    Button,
    Col,
    Container,
    Form,
    Image,
    InputGroup,
    Row,
} from 'react-bootstrap';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { PencilSquare } from 'react-bootstrap-icons';
import { getAuth } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { firebaseDatabase } from '../../firebase/firebase';
import { updateDisplayName } from '../../redux/UserReducer';

const ProfilePhoto = styled(Image)`
    height: 90px;
    width: 90px;
    background-position: center center;
    background-repeat: no-repeat;
    overflow: hidden;
    border-radius: 10px;
    border: 3px #0dcaf0 solid;
`;

const ProfileWrapper = styled.div`
    height: 90px;
    width: 90px;
    position: relative;

    &:hover {
        cursor: pointer;
        opacity: 0.8;
    }
`;

const EditIcon = styled.div`
    color: white;
    position: absolute;
    bottom: -10px;
    right: -10px;
    background-color: #0dcaf0;
    padding: 3px 10px 10px 10px;
    border-radius: 50%;

    &:hover {
        cursor: pointer;
        opacity: 1;
    }
`;

const UserAccount = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useDispatch();

    const [displayName, setDisplayName] = useState(user?.displayName);
    const [editDisplayName, setEditDisplayName] = useState(false);

    const image = user?.photoURL
        ? user.photoURL
        : '/assets/placeholder-icon.png';

    const onDisplayNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDisplayName(event.target.value);
    };

    const onSaveDisplayName = () => {
        if (displayName) {
            const displayNameRef = ref(
                firebaseDatabase,
                `users/${user?.uid}/userData`
            );
            update(displayNameRef, { displayName: displayName });
            dispatch(updateDisplayName(displayName));
            setEditDisplayName(false);
        }
    };

    useEffect(() => {
        setDisplayName(user?.displayName);
    }, [user]);

    return (
        <Container data-testid="user-account-settings">
            <Form>
                <Row>
                    <Col md="auto" className="my-auto">
                        <ProfileWrapper>
                            <EditIcon>
                                <PencilSquare />
                            </EditIcon>

                            <ProfilePhoto src={image} />
                        </ProfileWrapper>
                    </Col>
                    <Col>
                        <Form.Label>Display Name</Form.Label>

                        <InputGroup>
                            <Form.Control
                                disabled={!editDisplayName}
                                size="lg"
                                value={displayName || ''}
                                onChange={onDisplayNameChange}
                                data-testid="display-name-input"
                            />
                            {editDisplayName ? (
                                <>
                                    <Button
                                        onClick={onSaveDisplayName}
                                        data-testid="save-display-name-btn"
                                    >
                                        Save
                                    </Button>{' '}
                                    <Button
                                        variant="danger"
                                        onClick={() =>
                                            setEditDisplayName(false)
                                        }
                                        data-testid="cancel-edit-display-name-btn"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => setEditDisplayName(true)}
                                    data-testid="edit-display-name-btn"
                                >
                                    Edit
                                </Button>
                            )}
                            {}
                        </InputGroup>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default UserAccount;
