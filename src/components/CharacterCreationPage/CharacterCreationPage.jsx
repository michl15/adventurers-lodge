import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { push, ref, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Toast } from "react-bootstrap";
import { firebaseDatabase } from "../../firebase/firebase";

const CharacterCreationPage = () => {
    const [charName, setCharName] = useState('');
    const [charClass, setCharClass] = useState('');
    const [userId, setUserId] = useState('');

    const [showToast, setShowToast] = useState(false);
    const toggleToast = () => setShowToast(true)
    const toggleToastOff = () => setShowToast(false)


    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            setUserId(user.uid)
    })

    }, []);


    const onNameChange = (event) => {
        setCharName(event.target.value);
    }

    const onClassChange = (event) => {
        setCharClass(event.target.value);
    }

    const onSubmit = () => {
        const database = firebaseDatabase;
        const charRef = ref(database, 'characters');

        const charData = {
            name: charName,
            class: charClass,
            level: 1
        }

        const newCharKey = push(charRef, charData).key;
        const userRef = ref(database, "users/" + userId + "/characters/" + newCharKey);

        set(userRef, true);

        toggleToast();
    }


    return (
        <div>
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
                <Toast show={showToast} onClose={toggleToastOff}>
                    <Toast.Header>
                        <strong className="me-auto">Character Created</strong>
                    </Toast.Header>
                    <Toast.Body>Congraulations! You made a character</Toast.Body>
                </Toast>
            </Form>
        </div>

    )
}

export default CharacterCreationPage;
