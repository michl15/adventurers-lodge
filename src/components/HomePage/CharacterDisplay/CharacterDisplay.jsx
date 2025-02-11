import { get, getDatabase, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import CharacterCard from "../CharacterCard";

const CharacterDisplay = ({uid}) => {
    const [characterMap, setCharacterMap] = useState(new Map());

    useEffect(() => {
        const getCharacterData = async (characters, db) => {
            // iterate through characters
            for(const char of Object.entries(characters)) {
                const charId = char[0];
                const charRef = ref(db, `/characters/${charId}`);
    
                const snapshot = await get(charRef);
                if(snapshot.exists()) {
                    const newCharList = characterMap.set(charId, {...snapshot.val(), key: charId});
                    setCharacterMap(newCharList);
                    console.log(characterMap);
                }
            }
        }
    
        const getCharacterList = async (db) => {
            // fetch list of characters associated with uid
            const userRef = ref(db, `/users/${uid}/characters`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                // get the data for those characters
                getCharacterData(snapshot.val(), db);
            }
        }

        const db = getDatabase();

        getCharacterList(db);
    }, [characterMap, uid]);
        

    const renderCharacterCards = () => {
        return [...characterMap.values()].map((char) => <CharacterCard key={char.key} characterData={char}/>)
    }

    return (
        <>
          {renderCharacterCards()}
        </>
    )
}

export default CharacterDisplay;