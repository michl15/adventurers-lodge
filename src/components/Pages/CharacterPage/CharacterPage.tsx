import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { useLocation, useParams } from 'react-router';
import { firebaseDatabase } from '../../../firebase/firebase';
import { CharacterData } from '../../../constants/types';
import CharacterDetails from './CharacterDetails';
import { useDispatch } from 'react-redux';
import { resetInventory, setInventory } from '../../../redux/InventoryReducer';
import { setCharSpells } from '../../../redux/SpellsReducer';
import {
    resetAllCharData,
    setAllStats,
    setLvl,
} from '../../../redux/CharDataReducer';

const CharacterPage = () => {
    const [charDetails, setCharDetails] = useState<CharacterData | null>(null);
    const [charFound, setCharFound] = useState(true);

    const { charId } = useParams();
    const characterPath = 'characters/' + charId;
    const database = firebaseDatabase;
    const dispatch = useDispatch();

    const location = useLocation();

    const getCharacterDetails = async () => {
        try {
            const charRef = ref(database, characterPath);
            const snapshot = await get(charRef);
            const values = snapshot.val();
            if (snapshot.exists() && values) {
                setCharDetails({
                    ...values,
                    key: charId,
                });
                if (values.level) {
                    dispatch(setLvl(values.level));
                }
                if (values.stats) {
                    dispatch(setAllStats(values.stats));
                }
                if (values.inventory) {
                    dispatch(setInventory(snapshot.val().inventory));
                }
                if (values.spells) {
                    dispatch(setCharSpells(snapshot.val().spells));
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
        dispatch(resetInventory());
        dispatch(resetAllCharData());
    }, [dispatch, location.pathname]);

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
