import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import {push, ref, set, get } from "firebase/database";
import { Accordion } from "react-bootstrap";
import { useParams } from "react-router";
import { firebaseDatabase } from "../../firebase/firebase";
import { CharacterData, Item } from "../../constants/types";
import CharacterDetails from "./CharacterDetails";

const CharacterPage = () => {
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemArray, setItemArray] = useState<Item[]>([]);
    const [isLoadingItems, setIsLoadingItems] = useState(true);
    const [charDetails, setCharDetails] = useState<CharacterData | null>(null);
    const [showItemModal, setShowItemModal] = useState(false);
    const [itemValidated, setItemValidated] = useState(false);

    const {charId} = useParams();
    const dbPath = "characters/" + charId + "/inventory";
    const characterPath = "characters/" + charId;
    const database = firebaseDatabase;

    /**
     * Getting item list
     */
    const fetchItem = async () => {
        const itemRef = ref(database, dbPath)
        const snapshot = await get(itemRef);
        if (snapshot.exists() && snapshot.val()) {
            const ids = Object.keys(snapshot.val());
            let newArray: Item[] = [];
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

    const getCharacterDetails = async () => {
        const charRef = ref(database, characterPath);
        const snapshot = await get(charRef);
        if (snapshot.exists() && snapshot.val()) {
            setCharDetails(snapshot.val());
        }

    }

    const onItemNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemValidated(false);
        setItemName(event.target.value);
    }

    const onItemDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setItemValidated(false);
        setItemDescription(event.currentTarget.value);
    }

    /**
     * creating items
     */
    const onItemSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setItemValidated(true);
        const itemRef = ref(database, 'items')
    
        const form = event.currentTarget;
        if (form.checkValidity()) {
            const itemData = {
                name: itemName,
                description: itemDescription
            }
    
            const newItemKey = push(itemRef, itemData).key;
    
            const charRef = ref(database, `${dbPath}/${newItemKey}`);
            set(charRef, true);
    
            // TODO: wrap in a try/catch block, only add this item if the set is successful
            const newArray: Item[] = [...itemArray];
            newArray.push(itemData);
            setItemArray(newArray); 
            closeModal();
        }
    }

    useEffect(() => {
        fetchItem();
        getCharacterDetails();
        // eslint-disable-next-line
    }, [])

    const renderAddItemForm = () => {
        return (
            <Form noValidate validated={itemValidated} onSubmit={onItemSubmit}>
                <Form.Group>
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control type="text" onChange={onItemNameChange} value={itemName} required/>
                    <Form.Control.Feedback type="invalid">
                        Please enter a name for the item.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Item Description</Form.Label>
                    <Form.Control type="text" onChange={onItemDescriptionChange} value={itemDescription}/>
                </Form.Group>
                <br/>
                <Button type="submit">Submit</Button>
            </Form>
        )
    }

    const openModal = () => setShowItemModal(true);
    const closeModal = () => setShowItemModal(false)


    const renderInventory = () => {
        return (
            <>
                <h4>Inventory</h4>
                <div>
                    {!isLoadingItems ? itemArray.map((item, index) => (
                    <Accordion key={index}>
                            <Accordion.Item eventKey={index.toString()}>
                                <Accordion.Header> {item.name} </Accordion.Header>
                                <Accordion.Body> {item.description} </Accordion.Body>
                            </Accordion.Item>
                    </Accordion>
                    )) : <Spinner animation="border"/>}
                    <br/>
                    <Button onClick={openModal}>Add Item (WIP)</Button>
                </div>
            </>
        )
    }

    return (
        <div>
            <CharacterDetails details={charDetails} inventory={renderInventory}/>
            <Modal show={showItemModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <h3>Add an item</h3>
                </Modal.Header>
                <Modal.Body>
                    {renderAddItemForm()}
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CharacterPage
