import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { useParams } from 'react-router';
import { firebaseDatabase } from '../../firebase/firebase';
import { CharacterData } from '../../constants/types';
import CharacterDetails from './CharacterDetails';
import { useDispatch } from 'react-redux';
import { resetInventory, setInventory } from '../../redux/InventoryReducer';

const CharacterPage = () => {
    const [charDetails, setCharDetails] = useState<CharacterData | null>(null);
    const [charFound, setCharFound] = useState(true);

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
                if (snapshot.val().inventory) {
                    dispatch(setInventory(snapshot.val().inventory));
                }
            } else {
                throw new Error('No character found');
            }
        } catch (error) {
            console.error('CharacterPage', error);
            console.error(
                'The above error occured while attempting to fetch character data for',
                charId
            );
            setCharFound(false);
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

    return charFound ? (
        <div data-testid="character-page">
            <CharacterDetails details={charDetails} />
        </div>
    ) : (
        <div data-testid="missing-char">
            <h1>Character not found</h1>
        </div>
    );
};

export default CharacterPage;
