import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { getDatabase, push, ref, set, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Toast } from "react-bootstrap";

const CharacterCreationPage = () => {
    const [charName, setCharName] = useState('');
    const [charClass, setCharClass] = useState('');
    const [userId, setUserId] = useState('');
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [charArray, setCharArray] = useState([]);

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
        const database = getDatabase();
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
        console.log(newCharKey)


    }

    // Select Character?
    const fetchNames = async () => {
        const database = getDatabase();
        const charRef = ref(database, 'characters', 'name')
        const snapshot = await get(charRef);
        setCharArray(Object.values(snapshot.val()));
    }

    const onItemNameChange = (event) => {
        setItemName(event.target.value);
    }

    const onItemDescriptionChange = (event) => {
        setItemDescription(event.target.value);
    }

    const onItemSubmit = () => {
        const database = getDatabase();
        const itemRef = ref(database, 'inventory')

        const itemData = {
            name: itemName,
            description: itemDescription
        }

        const newItemKey = push(itemRef, itemData).key;
        const userRef = ref(database, "users/" + userId + "/characters/" + newItemKey + "/inventory");

        set(userRef, true);

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
            <Form>
                <Form.Group>
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control type="text" onChange={onItemNameChange} value={itemName}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Item Description</Form.Label>
                    <Form.Control type="text" onChange={onItemDescriptionChange} value={itemDescription}/>
                </Form.Group>
                <Button onClick={onItemSubmit}>Submit</Button>
            </Form>
            <button onClick={fetchNames}> Character Names</button>
            <ul>
                {charArray.map( (item, index) => (
                    <li key={index}>
                        {item.name}
                    </li>
                ) )}
            </ul>
        </div>

    )
}

export default CharacterCreationPage;
