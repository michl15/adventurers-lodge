import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { push, ref, set } from "firebase/database";
import { Toast } from "react-bootstrap";
import { firebaseDatabase } from "../../firebase/firebase";
import { useFirebaseAuth } from "../../context/FirebaseAuthContext";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { BASE_STATS, DEFAULT_PROFICIENCIES, } from "../../constants/constants";
import { calculateProficiencyBonus, calculateStatModifier } from "../../util/calculations";
import Proficiencies from "../Proficiencies";

const StatsRowContainer = styled(Row)`
    display: flex;
    justify-content: center;
    align-items: center;
`
const StatsButtons = styled(Button)`
    margin: 5px 5px;
    margin-top: 10px;
`

const DescriptionBox = styled(Form.Control)`
    min-height: 300px;
    width: 100%;
    border: 1px solid #dee2e6;
    border-radius: 8px;
`

const StatsInput = styled(Form.Control)`
    height: 60px;
    text-align: center;
    font-size: 18px;
`

const NameInput =  styled(Form.Control)`
    height: 60px;
    font-size: 22px;
    margin-bottom: 10px;
`

const SubmitButtonContainer = styled.div`
    display: flex;
    justify-content: right;
    padding: 10px 10px;
`
const CharacterCreationPage = () => {
    const [charName, setCharName] = useState('');
    const [charClass, setCharClass] = useState('');
    const [charStats, setCharStats] = useState(BASE_STATS);
    const [charLvl, setCharLvl] = useState(1);
    const [validated, setValidated] = useState(false)
    const [charSkills, setCharSkills] = useState(DEFAULT_PROFICIENCIES);
    const [charMaxHP, setCharMaxHP] = useState(null);
    const [charDesc, setCharDesc] = useState('');

    const { user } = useFirebaseAuth();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const toggleToast = () => setShowToast(true)
    const toggleToastOff = () => setShowToast(false)

    const onNameChange = (event) => {
        setValidated(false);
        setCharName(event.target.value);
    }

    const onClassChange = (event) => {
        setValidated(false);
        setCharClass(event.target.value);
    }

    const onStatChange = (event, label) => {
        setValidated(false);
        if (!event.target.value) {
            setCharStats({...charStats, [label]: ''})

        }
        else if (Number(event.target.value)) {
            setCharStats({...charStats, [label]: Number(event.target.value)})
        }
    }

    const onLevelChange = (event) => {
        setValidated(false);
        if (!event.target.value) {
            setCharLvl('')
        }
        else if (Number(event.target.value)) {
            setCharLvl(Number(event.target.value))
        }
    }

    const onMaxHPChange = (event) => {
        if (!event.target.value) {
            setCharMaxHP('')
        }
        else if (Number(event.target.value)) {
            setCharMaxHP(Number(event.target.value))
        }
    }

    const onDescChange = (event) => {
        setValidated(false);
        setCharDesc(event.target.value);
    }


    const onRollStats = () => {
        let newStatsObj = {}
        for(const [key] of Object.entries(charStats)) {
            // generate a random number between 5-18
            const newStat = Math.floor((Math.random() * 13) + 5);
            newStatsObj[key] = newStat;
        }
        setCharStats(newStatsObj);
    }

    const onResetStats = () => {
        setCharStats(BASE_STATS);
    }

    const onSubmit = (event) => {
        const form = event.currentTarget;
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);

        if (user && form.checkValidity()) {
            const database = firebaseDatabase;
            const charRef = ref(database, 'characters');

            const charData = {
                name: charName,
                class: charClass,
                stats: charStats,
                level: charLvl || 1,
                skills: charSkills
            }

            const newCharKey = push(charRef, charData).key;
            const userRef = ref(database, "users/" + user?.uid + "/characters/" + newCharKey);

            set(userRef, true).then(() => {
                event.preventDefault();
                event.stopPropagation();
                navigate(`/characters/${newCharKey}`);
            }).catch((error) => {
                event.preventDefault();
                event.stopPropagation();
                toggleToast();
                console.error(error)
            });
        }
    }

    const renderStatsForm = () => {
        const statsNames = Object.keys(charStats);
        return statsNames.map((stat) => {
            const modifier = calculateStatModifier(charStats[stat]);
            return (
            <Col key={`stats-${stat}`}>
                <Form.Group>
                    <Form.Label>{stat.toUpperCase()}</Form.Label>
                    <StatsInput type="text" onChange={(event) => {onStatChange(event, stat)}} value={charStats[stat]}/>
                    <Form.Text>
                        {modifier >= 0 ? `+${modifier}` : `${modifier}`}
                    </Form.Text>
                </Form.Group>
            </Col>
        )})
    }

    const onSwitchChange = (skill) => {
        setCharSkills({...charSkills, [skill]: !charSkills[skill]})
    }

    return (
        <div>
            <Container>
                <h3>Create a Character</h3>
            <Form onSubmit={onSubmit} validated={validated} noValidate>
                <Row>
                <h4>Basic Info</h4>
                <Form.Group>
                    <Form.Label>Character Name</Form.Label>
                    <NameInput required type="text" onChange={onNameChange} value={charName}/>
                    <Form.Control.Feedback type="invalid">
                        Please enter a name for your character.
                    </Form.Control.Feedback>
                </Form.Group>
                </Row>
                <Row>
                    <Col sm={8}>
                        <Form.Group>
                            <Form.Label>Character Class</Form.Label>
                            <Form.Control required type="text" onChange={onClassChange} value={charClass}/>
                            <Form.Control.Feedback type="invalid">
                                Please enter a class for your character.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col sm={2}>
                        <Form.Group>
                            <Form.Label>Level</Form.Label>
                            <Form.Control required type="text" onChange={onLevelChange} value={charLvl}/>
                            <Form.Control.Feedback type="invalid">
                                Please enter a level for your character.
                            </Form.Control.Feedback>
                            <Form.Text>
                                {`Proficiency Bonus: +${calculateProficiencyBonus(charLvl)}`}
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col sm={2}>
                        <Form.Group>
                            <Form.Label>Max HP</Form.Label>
                            <Form.Control required type="text" onChange={onMaxHPChange} value={charMaxHP}/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md="auto">
                    <h4>Proficiencies</h4>
                        <Proficiencies charLvl={charLvl} charSkills={charSkills} onSwitchChange={onSwitchChange}/>
                    </Col>
                    <Col>
                    <StatsRowContainer>
                    <h4>Stats</h4>
                    {renderStatsForm()}
                        <Row className="justify-content-md-center">
                            <Col xs lg="2">
                                <StatsButtons onClick={onRollStats} size="sm">Randomize</StatsButtons>
                            </Col>
                            <Col xs lg="2">
                                <StatsButtons onClick={onResetStats} size="sm" variant="danger">Reset</StatsButtons>
                            </Col>
                        </Row>
                </StatsRowContainer>
                    <h4>Other</h4>
                        <Row>
                            <Form.Group>
                                <Form.Label>Description/Notes</Form.Label>
                                <DescriptionBox type="text" onChange={onDescChange} value={charDesc} as="textarea"/>
                            </Form.Group>
                        </Row>
                        <Row>
                        <Form.Group controlId="formFileLg" className="mb-3">
                            <Form.Label>Upload an image (NOT WORKING right now)</Form.Label>
                            <Form.Control type="file" size="md" accept=".png,.jpeg"/>
                        </Form.Group>
                        </Row>
                    </Col>
                </Row>
                <Toast show={showToast} onClose={toggleToastOff}>
                    <Toast.Header>
                        <strong className="me-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body>Something went wrong, please try again</Toast.Body>
                </Toast>
                <SubmitButtonContainer>
                            <Button type="submit" size='lg'>Create Character!</Button>
                        </SubmitButtonContainer>
            </Form>
            </Container>
        </div>

    )
}

export default CharacterCreationPage;
