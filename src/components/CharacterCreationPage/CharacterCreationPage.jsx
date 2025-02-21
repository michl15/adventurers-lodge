import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { push, ref, set } from "firebase/database";
import { Toast } from "react-bootstrap";
import { firebaseDatabase } from "../../firebase/firebase";
import { useFirebaseAuth } from "../../context/FirebaseAuthContext";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { BASE_STATS } from "../../constants/constants";

const StatsRowContainer = styled(Row)`
    display: flex;
    justify-content: center;
    align-items: center;
`

const CharacterCreationPage = () => {
    const [charName, setCharName] = useState('');
    const [charClass, setCharClass] = useState('');
    const [charStats, setCharStats] = useState(BASE_STATS);
    const [charLvl, setCharLvl] = useState(1);
    const [validated, setValidated] = useState(false)

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
        setCharStats({...charStats, [label]: Number(event.target.value)})
    }

    const onLevelChange = (event) => {
        setValidated(false);
        setCharLvl(Number(event.target.value))
    }

    const onRollStats = () => {
        let newStatsObj = {}
        for(const [key] of Object.entries(charStats)) {
            console.log(key);
            // generate a random number between 5-18
            const newStat = Math.floor((Math.random() * 13) + 5);
            newStatsObj[key] = newStat;
        }
        setCharStats(newStatsObj);
    }

    const onResetStats = () => {
        setCharStats(BASE_STATS)

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
                level: charLvl
            }

            const newCharKey = push(charRef, charData).key;
            const userRef = ref(database, "users/" + user?.uid + "/characters/" + newCharKey);

            set(userRef, true).then(() => {
                toggleToast();
                navigate(`/characters/${newCharKey}`);
            }).catch((error) => {
                console.error(error)
            });
        }
    }

    const renderStatsForm = () => {
        const statsNames = Object.keys(charStats);
        return statsNames.map((stat) => {
            const modifier = Math.floor((charStats[stat] - 10) / 2);
            return (
            <Col key={`stats-${stat}`}>
                <Form.Group>
                    <Form.Label>{stat.toUpperCase()}</Form.Label>
                    <Form.Control type="text" onChange={(event) => {onStatChange(event, stat)}} value={charStats[stat]}/>
                    <Form.Text>
                        {modifier >= 0 ? `+${modifier}` : `${modifier}`}
                    </Form.Text>
                </Form.Group>
            </Col>
        )})
    }


    return (
        <div>
            <Container>
            <Form onSubmit={onSubmit} validated={validated} noValidate>
                <Row>
                <Form.Group>
                    <Form.Label>Character Name</Form.Label>
                    <Form.Control required type="text" onChange={onNameChange} value={charName}/>
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
                    <Col sm={4}>
                        <Form.Group>
                            <Form.Label>Level</Form.Label>
                            <Form.Control required type="text" onChange={onLevelChange} value={charLvl}/>
                        </Form.Group>
                    </Col>
                </Row>
                <StatsRowContainer>
                    {renderStatsForm()}
                    <Col>
                        <Button onClick={onRollStats}>Roll Stats</Button>
                        <Button onClick={onResetStats}>Reset</Button>
                    </Col>
                </StatsRowContainer>
                <Button type="submit">Create Character!</Button>
                <Toast show={showToast} onClose={toggleToastOff}>
                    <Toast.Header>
                        <strong className="me-auto">Character Created</strong>
                    </Toast.Header>
                    <Toast.Body>Congraulations! You made a character</Toast.Body>
                </Toast>
            </Form>
            </Container>
        </div>

    )
}

export default CharacterCreationPage;
