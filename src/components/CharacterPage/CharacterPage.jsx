import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { getDatabase, push, ref, set, get } from "firebase/database";
import { Accordion } from "react-bootstrap";

const CharacterPage = ({name, charClass}) => {
    const [userId, setUserId] = useState('');
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [charArray, setCharArray] = useState([]);
    const [itemArray, setItemArray] = useState([]);

    const fetchNames = async () => {
        const database = getDatabase();
        const charRef = ref(database, 'characters', 'name')
        const snapshot = await get(charRef);
        setCharArray(Object.values(snapshot.val()));
    }

    const fetchItem = async () => {
        const database = getDatabase();
        const itemRef = ref(database, 'inventory', 'name', 'description')
        const snapshot = await get(itemRef);
        setItemArray(Object.values(snapshot.val()));
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

        console.log(itemArray)

    }

    return (
        <div>
            Character
            <h1>Add Item</h1>
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
            <h1>Inventory</h1>
            <div>
                {itemArray.map((item, index) => (
                <Accordion>
                        <Accordion.Item eventKey={index}>
                            <Accordion.Header> {item.name} </Accordion.Header>
                            <Accordion.Body> {item.description} </Accordion.Body>
                        </Accordion.Item>
                </Accordion>
                ))}
            </div>
        </div>
    )
}

export default CharacterPage
