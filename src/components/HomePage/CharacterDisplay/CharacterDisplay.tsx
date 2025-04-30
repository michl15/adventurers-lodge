import { Database, get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import CharacterCard from '../CharacterCard';
import {
    Button,
    Col,
    Collapse,
    Container,
    Row,
    Spinner,
} from 'react-bootstrap';
import styled from 'styled-components';
import { firebaseDatabase } from '../../../firebase/firebase';
import { ChevronDoubleDown, ChevronDoubleUp } from 'react-bootstrap-icons';

const CardContainer = styled(Col)`
    margin: 10px 0px;
    :hover {
        background-color: #d9f6ff;
        cursor: pointer;
        border-radius: 5px;
    }
`;

const MidLine = styled.div`
    border-bottom: 1px solid lightgrey;
    padding-top: 15px;
`;

type CharacterDisplayProps = {
    uid: string;
};

const CharacterDisplay = ({ uid }: CharacterDisplayProps) => {
    const [characterMap, setCharacterMap] = useState(new Map());
    const [showAllChars, setShowAllChars] = useState(false);
    const [charsLoading, setCharsLoading] = useState(true);

    useEffect(() => {
        const getCharacterData = async (characters: object, db: Database) => {
            try {
                // iterate through characters
                for (const char of Object.entries(characters).reverse()) {
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
            } catch (error) {
                console.error('CharacterDisplay', error);
                console.error(
                    'The above error occurred while attempting to fetch characterData'
                );
            } finally {
                setCharsLoading(false);
            }
        };

        const getCharacterList = async (db: Database) => {
            // fetch list of characters associated with uid
            try {
                const userRef = ref(db, `/users/${uid}/characters`);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    // get the data for those characters
                    getCharacterData(snapshot.val(), db);
                } else {
                    setCharsLoading(false);
                }
            } catch (error) {
                console.error('CharacterDisplay', error);
                console.error(
                    'The above error occurred while attempting to fetch characters associated with user',
                    uid
                );
            }
        };
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
    const renderStartingCards = () => {
        return [...characterMap.values()].splice(0, 4).map((char) => (
            <CardContainer key={char.key} md="3">
                <CharacterCard characterData={char} />
            </CardContainer>
        ));
    };

    const renderAllCards = () => {
        return [...characterMap.values()].splice(4).map((char) => (
            <CardContainer key={char.key} md="3">
                <CharacterCard characterData={char} />
            </CardContainer>
        ));
    };

    return !charsLoading ? (
        <Container fluid data-testid="character-display-container">
            <Row>{renderStartingCards()}</Row>
            {characterMap.size > 4 ? (
                <>
                    <Row>
                        <Col>
                            <MidLine />
                        </Col>
                        <Col md="auto">
                            <Button
                                size="sm"
                                onClick={() => setShowAllChars(!showAllChars)}
                                variant="outline-secondary"
                                style={{ borderRadius: '100%' }}
                            >
                                {!showAllChars ? (
                                    <ChevronDoubleDown
                                        style={{ marginBottom: '3px' }}
                                    />
                                ) : (
                                    <ChevronDoubleUp
                                        style={{ marginBottom: '5px' }}
                                    />
                                )}
                            </Button>
                        </Col>
                        <Col>
                            <MidLine />
                        </Col>
                    </Row>
                    <Collapse in={showAllChars}>
                        <Row>{renderAllCards()}</Row>
                    </Collapse>{' '}
                </>
            ) : null}
        </Container>
    ) : (
        <Container>
            <Row
                className="d-flex justify-content-center"
                style={{ padding: '10px 0px' }}
            >
                <Spinner
                    variant="info"
                    style={{ width: '70px', height: '70px' }}
                />
            </Row>
        </Container>
    );
};

export default CharacterDisplay;
