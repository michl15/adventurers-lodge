import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { getDatabase, push, ref } from "firebase/database";

const CharacterCreationPage = () => {
    const [charName, setCharName] = useState('');
    const [charClass, setCharClass] = useState('');

    const onNameChange = (event) => {
        console.log(event.target.value)
        setCharName(event.target.value);
    }

    const onClassChange = (event) => {
        console.log(event.target.value)
        setCharClass(event.target.value);
    }

    const onSubmit = () => {
        const database = getDatabase();
        const charRef = ref(database, 'characters');

        const charData = {
            name: charName,
            class: charClass
        }

        push(charRef, charData);
    }

    return (
        <Form>
            <Form.Group>
                <Form.Label>Character Name</Form.Label>
                <Form.Control type="text" onChange={onNameChange} value={charName}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Character Class</Form.Label>
                <Form.Control type="text" onChange={onClassChange} value={charClass}/>
            </Form.Group>
            <Button onClick={onSubmit}>Submit</Button>
        </Form>
    )
}

export default CharacterCreationPage;