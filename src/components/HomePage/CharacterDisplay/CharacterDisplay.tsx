import { Database, get, ref } from 'firebase/database';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import CharacterCard from '../CharacterCard';
import { Card, Container, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { PlusCircle } from 'react-bootstrap-icons';
import { firebaseDatabase } from '../../../firebase/firebase';

const CardContainer = styled(Row)`
    margin: 10px 0px;
    :hover {
        background-color: #d9f6ff;
        cursor: pointer;
        border-radius: 5px;
    }
`;

const CreateAChar = styled(Row)`
    margin: 10px 0px;

    :hover {
        background-color: lightgrey;
        cursor: pointer;
        border-radius: 5px;
    }
`;

const CreateCardContent = styled.div`
    display: flex;
    align-items: center;
`;

type CharacterDisplayProps = {
    uid: string;
    onCharacterCreationClick: MouseEventHandler<HTMLElement>;
};

const CharacterDisplay = ({
    uid,
    onCharacterCreationClick,
}: CharacterDisplayProps) => {
    const [characterMap, setCharacterMap] = useState(new Map());

    useEffect(() => {
        const getCharacterData = async (characters: object, db: Database) => {
            // iterate through characters
            for (const char of Object.entries(characters)) {
                const charId = char[0];
                const charRef = ref(db, `/characters/${charId}`);

                const snapshot = await get(charRef);
                if (snapshot.exists() && !characterMap.has(charId)) {
                    characterMap.set(charId, {
                        ...snapshot.val(),
                        key: charId,
                    });
                }
            }
            setCharacterMap(new Map(characterMap));
        };

        const getCharacterList = async (db: Database) => {
            // fetch list of characters associated with uid
            const userRef = ref(db, `/users/${uid}/characters`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                // get the data for those characters
                getCharacterData(snapshot.val(), db);
            }
        };

        // get the database - TODO: add db to app context
        const db = firebaseDatabase;

        // Call function to get characters
        getCharacterList(db);

        // disabling because we don't want characterMap in the deps
        // as updating it would cause infinite re-renders due to new reference
        // eslint-disable-next-line
    }, [uid]);

    /**
     * Maps the characterMap to comoponents for rendering
     * @returns all card elements for characters
     */
    const renderCharacterCards = () => {
        return [...characterMap.values()].map((char) => (
            <CardContainer key={char.key}>
                <CharacterCard characterData={char} />
            </CardContainer>
        ));
    };

    /**
     * Create the card element to add a new character
     * separated out for readability
     * @param {Function} onCharacterCreationClick
     * @returns
     */
    const createACharCard = (
        onCharacterCreationClick: MouseEventHandler<HTMLElement>
    ) => {
        return (
            <Card onClick={onCharacterCreationClick}>
                <Card.Body>
                    <CreateCardContent>
                        <PlusCircle style={{ marginRight: '10px' }} />
                        <span>Create a new Character</span>
                    </CreateCardContent>
                </Card.Body>
            </Card>
        );
    };

    return (
        <Container fluid>
            <CreateAChar>
                {createACharCard(onCharacterCreationClick)}
            </CreateAChar>
            {renderCharacterCards()}
        </Container>
    );
};

export default CharacterDisplay;
