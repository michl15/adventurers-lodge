import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { push, ref, set, get } from 'firebase/database';
import { Accordion } from 'react-bootstrap';
import { useParams } from 'react-router';
import { firebaseDatabase } from '../../firebase/firebase';
import {
    CharacterData,
    Equipment,
    EquipmentCategory,
    Item,
} from '../../constants/types';
import CharacterDetails from './CharacterDetails';
import {
    API_EQUIPMENT,
    API_EQUIPMENT_CATEGORIES,
} from '../../constants/api';
import ItemModal from '../ItemModal';
import { useDispatch } from 'react-redux';
import { setInventory } from '../../redux/InventoryReducer';
import Inventory from '../Inventory';

const CharacterPage = () => {
    const [charDetails, setCharDetails] = useState<CharacterData | null>(null);

    const { charId } = useParams();
    const characterPath = 'characters/' + charId;
    const database = firebaseDatabase;
    const dispatch = useDispatch();


    const getCharacterDetails = async () => {
        const charRef = ref(database, characterPath);
        const snapshot = await get(charRef);
        if (snapshot.exists() && snapshot.val()) {
            setCharDetails(snapshot.val());
            dispatch(setInventory(snapshot.val().inventory));
        }
    };


    useEffect(() => {
        getCharacterDetails();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const renderInventory = () => {
        return (
            <>
                <h4>Inventory</h4>
                <Inventory />
            </>
        );
    };

    return (
        <div>
            <CharacterDetails
                details={charDetails}
                inventory={renderInventory}
            />
        </div>
    );
};

export default CharacterPage;
