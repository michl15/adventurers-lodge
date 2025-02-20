import React, { useEffect, useState } from "react";
import { Button, Form, Spinner, Modal } from "react-bootstrap";
import {push, ref, set, get } from "firebase/database";
import { Accordion } from "react-bootstrap";
import { useParams } from "react-router";
import { firebaseDatabase } from "../../firebase/firebase";


const CharacterPage = () => {
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemArray, setItemArray] = useState([]);
    const [isLoadingItems, setIsLoadingItems] = useState(true);
    //Modal states
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const {charId} = useParams();
    const dbPath = "characters/" + charId + "/inventory";

    /**
     * Getting item list
     */
    const fetchItem = async () => {
        const database = firebaseDatabase;
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
        const database = firebaseDatabase;
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
        handleClose()

    }

    useEffect(() => {
        fetchItem();
        // eslint-disable-next-line
    }, [])



    return (
        <div>
            Character
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

            <Button variant="primary" onClick={handleShow}>
                    Add Item
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="itemForm.NameInput">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                        type="text"
                        onChange={onItemNameChange}
                        value={itemName}
                        placeholder="Item Name"
                        autoFocus
                    />
                    </Form.Group>
                    <Form.Group
                    className="mb-3"
                    controlId="itemForm.DescriptionInput"
                    >
                    <Form.Label>Item Description</Form.Label>
                    <Form.Control as="textarea" onChange={onItemDescriptionChange} value={itemDescription} rows={3} />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={onItemSubmit}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CharacterPage
