import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { useParams } from 'react-router';
import { firebaseDatabase } from '../../firebase/firebase';
import { CharacterData } from '../../constants/types';
import CharacterDetails from './CharacterDetails';
import { useDispatch } from 'react-redux';
import { resetInventory, setInventory } from '../../redux/InventoryReducer';
import Inventory from '../Inventory';

const CharacterPage = () => {
    const [charDetails, setCharDetails] = useState<CharacterData | null>(null);

    const { charId } = useParams();
    const characterPath = 'characters/' + charId;
    const database = firebaseDatabase;
    const dispatch = useDispatch();

    const getCharacterDetails = async () => {
        try {
            const charRef = ref(database, characterPath);
            const snapshot = await get(charRef);
            if (snapshot.exists() && snapshot.val()) {
                setCharDetails(snapshot.val());
                dispatch(setInventory(snapshot.val().inventory));
            }
        } catch (error) {
            console.error('CharacterPage', error);
            console.error(
                'The above error occured while attempting to fetch character data for',
                charId
            );
        }
    };

    useEffect(() => {
        getCharacterDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        //on unmount, reset inventory
        return () => {
            dispatch(resetInventory());
        };
    }, [dispatch]);

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
