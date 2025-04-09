import React from 'react';
import { Button, Card, Col, Container, Image, Row } from 'react-bootstrap';
import { CharacterData } from '../../constants/types';
import styled from 'styled-components';
import Proficiencies from '../Proficiencies';
import { DEFAULT_PROFICIENCIES } from '../../constants/constants';
import StatsDisplay from './StatsDisplay';
import HPDisplay from './HPDisplay';
import CharacterLanguages from '../CharacterLanguages';
import CharacterTraits from '../CharacterTraits/CharacterTraits';
import Inventory from '../Inventory';

type CharacterDetailsProps = {
    details: CharacterData | null;
};

const CharImage = styled(Image)`
    width: 100px;
`;

const EditButton = styled(Button)`
    margin-left: 100%;
`;

const CharacterDetails = ({ details }: CharacterDetailsProps) => {
    if (details) {
        const charImage = details.image
            ? details.image
            : '/assets/placeholder-icon.png';
        return (
            <Container fluid data-testid="char-details">
                <Row>
                    <Col md="auto">
                        <CharImage src={charImage} alt="character" />
                    </Col>
                    <Col xs lg={6} className="my-auto">
                        <h3>{details.name}</h3>
                        <h4>{`Level ${details.level} ${details.race ? details.race.name : ''} ${details.class.name} `}</h4>
                    </Col>
                    <Col xs lg={3} className="my-auto">
                        <HPDisplay maxHP={details.maxHP} currHP={details.hp} />
                    </Col>
                    <Col xs lg={1} className="my-auto">
                        <EditButton variant="outline-info">
                            Edit (TODO)
                        </EditButton>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col md="auto">
                        <h4>Skills</h4>
                        <Proficiencies
                            charLvl={details.level}
                            onSwitchChange={() => { }}
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
                        <Row>
                            <h4>Inventory</h4>
                            <Inventory />
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
            </Container>
        );
    }
    return null;
};

export default CharacterDetails;
