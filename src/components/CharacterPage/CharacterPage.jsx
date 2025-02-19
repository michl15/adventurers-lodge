import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { getDatabase, push, ref, set, get } from "firebase/database";
import { Accordion } from "react-bootstrap";
import { useParams } from "react-router";

const CharacterPage = () => {
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemArray, setItemArray] = useState([]);
    const [isLoadingItems, setIsLoadingItems] = useState(true);

    const {charId} = useParams();
    const dbPath = "characters/" + charId + "/inventory";

    /**
     * Getting item list
     */
    const fetchItem = async () => {
        const database = getDatabase();
        const itemRef = ref(database, dbPath)
        const snapshot = await get(itemRef);
        if (snapshot.exists && snapshot.val()) {
            const ids = Object.keys(snapshot.val());
            let newArray = [];
           for(let i = 0; i < ids.length; i++) {
            const itemPath = 'items/' + ids[i];
                const newRef = ref(database, itemPath);
                const snapshot = await get(newRef);
                if (!newArray.includes(snapshot.val())) {
                    newArray.push(snapshot.val());
                } 
           }
            setItemArray(newArray);
        }
        setIsLoadingItems(false);
    }

    const onItemNameChange = (event) => {
        setItemName(event.target.value);
    }

    const onItemDescriptionChange = (event) => {
        setItemDescription(event.target.value);
    }

    /**
     * creating items
     */
    const onItemSubmit = () => {
        const database = getDatabase();
        const itemRef = ref(database, 'items')

        const itemData = {
            name: itemName,
            description: itemDescription
        }

        const newItemKey = push(itemRef, itemData).key;

        const charRef = ref(database, `${dbPath}/${newItemKey}`);
        set(charRef, true);

        // TODO: wrap in a try/catch block, only add this item if the set is successful
        const newArray = [...itemArray];
        newArray.push(itemData);
        setItemArray(newArray); 

    }

    useEffect(() => {
        fetchItem();
        // eslint-disable-next-line
    }, [])

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
                {!isLoadingItems ? itemArray.map((item, index) => (
                <Accordion key={index}>
                        <Accordion.Item eventKey={index}>
                            <Accordion.Header> {item.name} </Accordion.Header>
                            <Accordion.Body> {item.description} </Accordion.Body>
                        </Accordion.Item>
                </Accordion>
                )) : <Spinner animation="border"/>}
            </div>
        </div>
    )
}

export default CharacterPage
