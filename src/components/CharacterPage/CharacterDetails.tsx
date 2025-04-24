import React, { useState } from 'react';
import {
    Button,
    Card,
    Col,
    Container,
    Image,
    Modal,
    Row,
} from 'react-bootstrap';
import { CharacterData } from '../../constants/types';
import styled from 'styled-components';
import Proficiencies from '../Proficiencies';
import { DEFAULT_PROFICIENCIES } from '../../constants/constants';
import StatsDisplay from './StatsDisplay';
import HPDisplay from './HPDisplay';
import CharacterLanguages from '../CharacterLanguages';
import CharacterTraits from '../CharacterTraits/CharacterTraits';
import Inventory from '../Inventory';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { useNavigate } from 'react-router';
import { ref, remove } from 'firebase/database';
import { firebaseDatabase } from '../../firebase/firebase';
import CharacterSpells from '../CharacterSpells';

type CharacterDetailsProps = {
    details: CharacterData | null;
};

const CharImage = styled(Image)`
    width: 100px;
`;

const EditButton = styled(Button)`
    margin-left: 10px;
`;

const CharacterDetails = ({ details }: CharacterDetailsProps) => {
    const user = useSelector((state: RootState) => state.user.user);
    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const onEditClick = () => {
        navigate(`/characters/${details?.key}/edit`);
    };

    const onDeleteCharClick = () => {
        setShowDeleteModal(true);
    };

    const onModalCancel = () => {
        setShowDeleteModal(false);
    };

    const onModalConfirm = () => {
        const charRef = ref(firebaseDatabase, `/characters/${details?.key}`);
        const userRef = ref(
            firebaseDatabase,
            `users/${user?.uid}/characters/${details?.key}`
        );

        remove(charRef).then(() => {
            remove(userRef).then(() => {
                navigate('/home');
            });
        });
    };

    if (details) {
        const editable = details.owner === user?.uid;
        const charImage = details.image
            ? details.image
            : '/assets/placeholder-icon.png';
        return (
            <Container fluid data-testid="char-details">
                <Row>
                    <Col md="auto">
                        <CharImage src={charImage} alt="character" />
                    </Col>
                    <Col className="my-auto">
                        <h3>{details.name}</h3>
                        <h4>{`Level ${details.level} ${details.race ? details.race.name : ''} ${details.class.name} `}</h4>
                    </Col>
                    <Col className="my-auto d-flex justify-content-center">
                        <HPDisplay maxHP={details.maxHP} currHP={details.hp} />
                    </Col>
                    {editable ? (
                        <Col
                            md="auto"
                            className="my-auto d-flex justify-content-end"
                        >
                            <EditButton
                                variant="outline-info"
                                onClick={onEditClick}
                                data-testid="char-edit-btn"
                            >
                                Edit
                            </EditButton>
                            <EditButton
                                variant="danger"
                                onClick={onDeleteCharClick}
                                data-testid="char-delete-btn"
                            >
                                Delete
                            </EditButton>
                        </Col>
                    ) : null}
                </Row>
                <hr />
                <Row>
                    <Col md="auto">
                        <h4>Skills</h4>
                        <Proficiencies
                            charLvl={details.level}
                            onSwitchChange={() => {}}
                            charSkills={details.skills || DEFAULT_PROFICIENCIES}
                            editMode={false}
                        />
                    </Col>
                    <Col>
                        <Row>
                            <h4>Stats</h4>
                            <StatsDisplay stats={details.stats} />
                        </Row>
                        <hr />
                        <Row>
                            <h4>Inventory</h4>
                            <Inventory />
                        </Row>
                        <hr />
                        <Row>
                            <h4>Spells</h4>
                            <CharacterSpells charClass={details.class.name} />
                        </Row>
                        <hr />
                        <Row>
                            <h4>Traits</h4>
                            <CharacterTraits
                                traits={details.traits}
                                edit={false}
                            />
                        </Row>
                        <br />
                        <Row>
                            <h4>Languages</h4>
                            <CharacterLanguages
                                langList={details.languages}
                                edit={false}
                            />
                        </Row>
                        <hr />
                        <Row className="justify-content-center">
                            <h4>Character Notes/Description</h4>
                            <Card style={{ width: '90%' }}>
                                <Card.Body>
                                    {details.description
                                        ? details.description
                                        : 'Edit your character to add more details here'}
                                </Card.Body>
                            </Card>
                        </Row>
                    </Col>
                </Row>
                <Modal
                    show={showDeleteModal}
                    variant="danger"
                    onHide={() => setShowDeleteModal(false)}
                    centered
                    data-testid="char-delete-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Delete this character?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>This action cannot be undone.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="outline-secondary"
                            onClick={onModalCancel}
                            data-testid="modal-cancel-btn"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={onModalConfirm}
                            data-testid="modal-confirm-btn"
                        >
                            Yes, delete character
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
    return null;
};

export default CharacterDetails;
